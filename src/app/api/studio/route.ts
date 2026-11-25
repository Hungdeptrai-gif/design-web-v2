import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  INITIAL_CATEGORIES,
  INITIAL_COMPARISONS,
  INITIAL_PROJECTS,
  INITIAL_QUOTES,
  INITIAL_VERIFIED_STATS,
} from "@/du-lieu-mau";
import {
  ComparisonPair,
  ProjectItem,
  QuoteLead,
  StudioVerifiedStats,
} from "@/kieu-du-lieu";
import { notifyZaloBotNewQuote } from "@/dich-vu-du-lieu/may-chu-zalo-bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface StudioDatabase {
  categories: string[];
  projects: ProjectItem[];
  comparisons: ComparisonPair[];
  quotes: QuoteLead[];
  verifiedStats: StudioVerifiedStats;
  updatedAt?: number;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "studio-db.json");

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

let writeQueue: Promise<void> = Promise.resolve();

function sanitizeRealQuotes(list: QuoteLead[] | undefined): QuoteLead[] {
  if (!Array.isArray(list)) return INITIAL_QUOTES;
  // Loại bỏ hoàn toàn dữ liệu mẫu ảo q-demo-1 hoặc số điện thoại chứa ký tự che 'xxx'
  return list.filter(
    (q) => q && q.id !== "q-demo-1" && !String(q.phone).toLowerCase().includes("x")
  );
}

async function loadDb(): Promise<StudioDatabase> {
  try {
    const raw = await readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<StudioDatabase>;
    const cleanQuotes = sanitizeRealQuotes(parsed.quotes);
    const hadFakeQuote =
      Array.isArray(parsed.quotes) && parsed.quotes.length !== cleanQuotes.length;

    const db: StudioDatabase = {
      categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_CATEGORIES,
      projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_PROJECTS,
      comparisons: Array.isArray(parsed.comparisons) ? parsed.comparisons : INITIAL_COMPARISONS,
      quotes: cleanQuotes,
      verifiedStats: parsed.verifiedStats ?? INITIAL_VERIFIED_STATS,
      updatedAt: parsed.updatedAt ?? Date.now(),
    };

    if (hadFakeQuote || !parsed.verifiedStats) {
      await saveDb(db);
    }

    return db;
  } catch {
    const seed: StudioDatabase = {
      categories: INITIAL_CATEGORIES,
      projects: INITIAL_PROJECTS,
      comparisons: INITIAL_COMPARISONS,
      quotes: INITIAL_QUOTES,
      verifiedStats: INITIAL_VERIFIED_STATS,
      updatedAt: Date.now(),
    };
    await mkdir(DB_DIR, { recursive: true });
    await writeFile(DB_FILE, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
}

async function saveDb(db: StudioDatabase): Promise<void> {
  await mkdir(DB_DIR, { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export async function GET() {
  await writeQueue;
  const db = await loadDb();
  return NextResponse.json(db, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const patch = (await req.json()) as Partial<StudioDatabase> & {
      newQuote?: QuoteLead;
    };

    if (patch.newQuote) {
      const cleanedPhone = String(patch.newQuote.phone || "").replace(/[\s.-]/g, "");
      if (!/^(0|\+84)(2|3|5|7|8|9)[0-9]{8,9}$/.test(cleanedPhone)) {
        return NextResponse.json(
          { error: "Số điện thoại đăng ký không hợp lệ." },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }
    }

    let resultDb!: StudioDatabase;

    writeQueue = writeQueue.then(async () => {
      const current = await loadDb();
      resultDb = {
        categories: patch.categories !== undefined ? patch.categories : current.categories,
        projects: patch.projects !== undefined ? patch.projects : current.projects,
        comparisons: patch.comparisons !== undefined ? patch.comparisons : current.comparisons,
        quotes: patch.newQuote
          ? [patch.newQuote, ...current.quotes]
          : patch.quotes !== undefined
          ? sanitizeRealQuotes(patch.quotes)
          : current.quotes,
        verifiedStats:
          patch.verifiedStats !== undefined ? patch.verifiedStats : current.verifiedStats,
        updatedAt: Date.now(),
      };
      await saveDb(resultDb);
    });

    await writeQueue;

    // Bắn thông báo tức thì về Bot Zalo ngay khi có khách gửi phiếu báo giá mới
    if (patch.newQuote) {
      void notifyZaloBotNewQuote(patch.newQuote).catch((err) =>
        console.error("Zalo Bot notify error:", err)
      );
    }

    return NextResponse.json(resultDb, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Save studio DB error:", err);
    return NextResponse.json(
      { error: "Không thể lưu dữ liệu." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
