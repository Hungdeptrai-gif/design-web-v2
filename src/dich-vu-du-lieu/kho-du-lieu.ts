/**
 * Kho dữ liệu phía máy chủ.
 *
 * - Trên Vercel: dùng Upstash Redis (thêm qua Vercel → Storage, biến môi trường
 *   KV_REST_API_URL / KV_REST_API_TOKEN được Vercel tự điền).
 * - Chạy trên máy (npm run dev): dùng file data/studio-db.json như trước.
 * - Trên Vercel mà chưa gắn Redis: đọc nội dung mẫu, còn mọi thao tác ghi báo lỗi
 *   rõ ràng (StoreUnavailableError) thay vì "giả vờ" thành công.
 *
 * Mỗi phiếu báo giá được lưu thành một mục riêng (Redis hash) để phiếu mới của
 * khách không bao giờ bị ghi đè khi quản trị viên đang sửa danh sách.
 */
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import seedDb from "../../data/studio-db.json";
import {
  INITIAL_CATEGORIES,
  INITIAL_COMPARISONS,
  INITIAL_PROJECTS,
  INITIAL_VERIFIED_STATS,
} from "@/du-lieu-mau";
import type {
  ComparisonPair,
  ProjectItem,
  QuoteLead,
  StudioVerifiedStats,
  ZaloBotConfig,
} from "@/kieu-du-lieu";

export interface SiteContent {
  categories: string[];
  projects: ProjectItem[];
  comparisons: ComparisonPair[];
  verifiedStats: StudioVerifiedStats;
  updatedAt: number;
}

export class StoreUnavailableError extends Error {
  constructor() {
    super(
      "Website chưa được kết nối kho dữ liệu. Quản trị viên cần thêm Upstash Redis trong Vercel → Storage."
    );
    this.name = "StoreUnavailableError";
  }
}

const KEYS = {
  site: "tkkt:site",
  quotes: "tkkt:quotes",
  zalo: "tkkt:zalo",
} as const;

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "studio-db.json");
const ZALO_FILE = path.join(DATA_DIR, "zalo-bot-config.json");

// ---------------------------------------------------------------------------
// Backend selection
// ---------------------------------------------------------------------------

type RedisConfig = { url: string; token: string };

function getRedisConfig(): RedisConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export type StoreMode = "redis" | "file" | "unavailable";

export function getStoreMode(): StoreMode {
  if (getRedisConfig()) return "redis";
  // Vercel's filesystem is read-only/ephemeral, so files cannot be the store there.
  return process.env.VERCEL ? "unavailable" : "file";
}

/** Executes one Redis command through the Upstash REST API. */
async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const cfg = getRedisConfig();
  if (!cfg) throw new StoreUnavailableError();
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as { result?: T; error?: string } | null;
  if (!res.ok || !json || json.error) {
    throw new Error(`Redis ${command[0]} failed: ${json?.error ?? res.status}`);
  }
  return json.result as T;
}

// ---------------------------------------------------------------------------
// Seed content (bundled with the build so it is available on Vercel)
// ---------------------------------------------------------------------------

type SeedShape = Partial<SiteContent> & { quotes?: QuoteLead[] };

function seedSiteContent(): SiteContent {
  const seed = seedDb as SeedShape;
  return normalizeSite(seed);
}

function normalizeSite(raw: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    categories: Array.isArray(raw?.categories) ? raw.categories : INITIAL_CATEGORIES,
    projects: Array.isArray(raw?.projects) ? raw.projects : INITIAL_PROJECTS,
    comparisons: Array.isArray(raw?.comparisons) ? raw.comparisons : INITIAL_COMPARISONS,
    verifiedStats: raw?.verifiedStats ?? INITIAL_VERIFIED_STATS,
    updatedAt: typeof raw?.updatedAt === "number" ? raw.updatedAt : Date.now(),
  };
}

/** Real quotes only: drops the old demo entry and masked phone numbers. */
export function isRealQuote(q: QuoteLead | null | undefined): q is QuoteLead {
  return Boolean(q && q.id && q.id !== "q-demo-1" && !String(q.phone).toLowerCase().includes("x"));
}

/** Quote ids are "q-<timestamp>", so newest first = descending id timestamp. */
function sortNewestFirst(list: QuoteLead[]): QuoteLead[] {
  const ts = (q: QuoteLead) => Number(q.id.replace(/^q-/, "")) || 0;
  return [...list].sort((a, b) => ts(b) - ts(a));
}

// ---------------------------------------------------------------------------
// File backend (local development)
// ---------------------------------------------------------------------------

type FileDb = SiteContent & { quotes: QuoteLead[] };

let fileQueue: Promise<unknown> = Promise.resolve();

/** Serializes file writes inside one process (same guarantee as before). */
function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = fileQueue.then(fn, fn);
  fileQueue = next.catch(() => undefined);
  return next;
}

async function readFileDb(): Promise<FileDb> {
  try {
    const parsed = JSON.parse(await readFile(DB_FILE, "utf-8")) as SeedShape;
    return { ...normalizeSite(parsed), quotes: (parsed.quotes ?? []).filter(isRealQuote) };
  } catch {
    return { ...seedSiteContent(), quotes: [] };
  }
}

async function writeFileDb(db: FileDb): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getSiteContent(): Promise<SiteContent> {
  const mode = getStoreMode();
  if (mode === "file") return normalizeSite(await readFileDb());
  if (mode === "unavailable") return seedSiteContent();

  const raw = await redis<string | null>(["GET", KEYS.site]);
  if (raw) return normalizeSite(JSON.parse(raw) as Partial<SiteContent>);
  // First run: copy the bundled content into Redis.
  const seed = seedSiteContent();
  await redis(["SET", KEYS.site, JSON.stringify(seed), "NX"]);
  return seed;
}

export async function saveSiteContent(patch: Partial<Omit<SiteContent, "updatedAt">>): Promise<SiteContent> {
  const mode = getStoreMode();
  if (mode === "unavailable") throw new StoreUnavailableError();

  if (mode === "file") {
    return withFileLock(async () => {
      const db = await readFileDb();
      const next: FileDb = { ...db, ...patch, updatedAt: Date.now() };
      await writeFileDb(next);
      return normalizeSite(next);
    });
  }

  // Admin-only writes: a single writer, so read-modify-write is acceptable.
  const current = await getSiteContent();
  const next: SiteContent = { ...current, ...patch, updatedAt: Date.now() };
  await redis(["SET", KEYS.site, JSON.stringify(next)]);
  return next;
}

export async function listQuotes(): Promise<QuoteLead[]> {
  const mode = getStoreMode();
  if (mode === "file") return sortNewestFirst((await readFileDb()).quotes);
  if (mode === "unavailable") return [];

  // HGETALL returns [field1, value1, field2, value2, ...]
  const flat = await redis<string[]>(["HGETALL", KEYS.quotes]);
  const quotes: QuoteLead[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      const q = JSON.parse(flat[i]) as QuoteLead;
      if (isRealQuote(q)) quotes.push(q);
    } catch {
      // Skip corrupt entries rather than failing the whole inbox.
    }
  }
  return sortNewestFirst(quotes);
}

export async function addQuote(quote: QuoteLead): Promise<void> {
  const mode = getStoreMode();
  if (mode === "unavailable") throw new StoreUnavailableError();
  if (mode === "file") {
    await withFileLock(async () => {
      const db = await readFileDb();
      await writeFileDb({ ...db, quotes: [quote, ...db.quotes.filter((q) => q.id !== quote.id)], updatedAt: Date.now() });
    });
    return;
  }
  await redis(["HSET", KEYS.quotes, quote.id, JSON.stringify(quote)]);
}

/**
 * Applies the admin's edits: upserts the given quotes and deletes only the ids
 * the admin explicitly removed, so quotes that arrived meanwhile are kept.
 */
export async function updateQuotes(upserts: QuoteLead[], deletedIds: string[]): Promise<void> {
  const mode = getStoreMode();
  if (mode === "unavailable") throw new StoreUnavailableError();
  const clean = upserts.filter(isRealQuote);

  if (mode === "file") {
    await withFileLock(async () => {
      const db = await readFileDb();
      const byId = new Map(db.quotes.map((q) => [q.id, q]));
      for (const q of clean) byId.set(q.id, q);
      for (const id of deletedIds) byId.delete(id);
      await writeFileDb({ ...db, quotes: sortNewestFirst([...byId.values()]), updatedAt: Date.now() });
    });
    return;
  }

  if (clean.length) {
    await redis(["HSET", KEYS.quotes, ...clean.flatMap((q) => [q.id, JSON.stringify(q)])]);
  }
  if (deletedIds.length) {
    await redis(["HDEL", KEYS.quotes, ...deletedIds]);
  }
}

// ---------------------------------------------------------------------------
// Zalo bot configuration (contains the bot token: server-side only)
// ---------------------------------------------------------------------------

export async function readZaloConfig(): Promise<Partial<ZaloBotConfig> | null> {
  const mode = getStoreMode();
  try {
    if (mode === "file") return JSON.parse(await readFile(ZALO_FILE, "utf-8")) as Partial<ZaloBotConfig>;
    if (mode === "redis") {
      const raw = await redis<string | null>(["GET", KEYS.zalo]);
      return raw ? (JSON.parse(raw) as Partial<ZaloBotConfig>) : null;
    }
  } catch {
    // Missing or unreadable config: fall back to environment variables.
  }
  return null;
}

export async function writeZaloConfig(config: ZaloBotConfig): Promise<void> {
  const mode = getStoreMode();
  if (mode === "unavailable") throw new StoreUnavailableError();
  if (mode === "file") {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(ZALO_FILE, JSON.stringify(config, null, 2), "utf-8");
    return;
  }
  await redis(["SET", KEYS.zalo, JSON.stringify(config)]);
}
