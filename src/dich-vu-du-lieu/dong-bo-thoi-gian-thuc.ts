/**
 * Dịch vụ đồng bộ thời gian thực giữa các tab trình duyệt (BroadcastChannel) và máy chủ (/api/studio).
 */
import { INITIAL_PROJECTS } from "@/du-lieu-mau";
import {
  ComparisonPair,
  ProjectItem,
  QuoteLead,
  StudioVerifiedStats,
} from "@/kieu-du-lieu";

export const STORAGE_KEYS = {
  CATEGORIES: "tkkt_categories_v1",
  PROJECTS: "tkkt_projects_v1",
  COMPARISONS: "tkkt_comparisons_v1",
  QUOTES: "tkkt_quotes_v1",
  VERIFIED_STATS: "tkkt_verified_stats_v1",
  UPDATED_AT: "tkkt_updated_at_v1",
  LEGACY_MIGRATED: "tkkt_migrated_legacy_v1",
} as const;

export const STUDIO_CHANNEL_NAME = "tkkt_studio_realtime_v1";
export const STUDIO_LOCAL_EVENT = "tkkt-studio-local-update";

export interface StudioSnapshot {
  categories: string[];
  projects: ProjectItem[];
  comparisons: ComparisonPair[];
  quotes: QuoteLead[];
  verifiedStats: StudioVerifiedStats;
  updatedAt: number;
}

let pendingSaves = 0;

export function writeCacheSafe(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Dữ liệu gốc luôn được lưu trên /api/studio
  }
}

export function broadcastSnapshot(partial: Partial<StudioSnapshot>): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  writeCacheSafe(STORAGE_KEYS.UPDATED_AT, now);

  const payload = { ...partial, updatedAt: now };

  try {
    const bc = new BroadcastChannel(STUDIO_CHANNEL_NAME);
    bc.postMessage(payload);
    bc.close();
  } catch {
    // Bỏ qua nếu không hỗ trợ
  }

  window.dispatchEvent(new CustomEvent(STUDIO_LOCAL_EVENT, { detail: payload }));
}

export async function persistToServer(
  body: Record<string, unknown>
): Promise<StudioSnapshot | null> {
  if (typeof window === "undefined") return null;
  pendingSaves += 1;
  try {
    const res = await fetch("/api/studio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const saved: StudioSnapshot = await res.json();
      writeCacheSafe(STORAGE_KEYS.CATEGORIES, saved.categories);
      writeCacheSafe(STORAGE_KEYS.PROJECTS, saved.projects);
      writeCacheSafe(STORAGE_KEYS.COMPARISONS, saved.comparisons);
      writeCacheSafe(STORAGE_KEYS.QUOTES, saved.quotes);
      writeCacheSafe(STORAGE_KEYS.VERIFIED_STATS, saved.verifiedStats);
      writeCacheSafe(STORAGE_KEYS.UPDATED_AT, saved.updatedAt);

      try {
        const bc = new BroadcastChannel(STUDIO_CHANNEL_NAME);
        bc.postMessage(saved);
        bc.close();
      } catch {
        // Bỏ qua
      }
      return saved;
    }
    if (res.status === 401 && window.location.pathname.startsWith("/admin")) {
      window.location.reload();
    }
    return null;
  } catch {
    return null;
  } finally {
    pendingSaves = Math.max(0, pendingSaves - 1);
  }
}

async function migrateLegacyBrowserDataIfNeeded(
  serverSnap: StudioSnapshot
): Promise<StudioSnapshot> {
  if (typeof window === "undefined") return serverSnap;
  if (localStorage.getItem(STORAGE_KEYS.LEGACY_MIGRATED) === "true") {
    return serverSnap;
  }

  localStorage.setItem(STORAGE_KEYS.LEGACY_MIGRATED, "true");

  try {
    const rawV2 = localStorage.getItem("piu_projects_v2");
    const rawV1 = localStorage.getItem("ts_projects");
    const legacyRaw = rawV2 || rawV1;
    if (!legacyRaw) return serverSnap;

    const legacyProjects: ProjectItem[] = JSON.parse(legacyRaw);
    if (!Array.isArray(legacyProjects) || legacyProjects.length === 0) {
      return serverSnap;
    }

    const defaultPinnedIds = new Set(
      INITIAL_PROJECTS.filter((p) => p.featured).map((p) => p.id)
    );
    const legacyPinnedIds = legacyProjects.filter((p) => p.featured).map((p) => p.id);
    const hasCustomPin =
      legacyPinnedIds.length !== defaultPinnedIds.size ||
      legacyPinnedIds.some((id) => !defaultPinnedIds.has(id));
    const hasCustomProjects =
      legacyProjects.length !== INITIAL_PROJECTS.length ||
      legacyProjects.some((lp) => !INITIAL_PROJECTS.some((ip) => ip.id === lp.id));

    if (!hasCustomPin && !hasCustomProjects) {
      return serverSnap;
    }

    const seedMap = new Map(INITIAL_PROJECTS.map((p) => [p.id, p]));
    const mergedProjects: ProjectItem[] = legacyProjects.map((lp) => {
      const seed = seedMap.get(lp.id);
      return {
        ...lp,
        image:
          lp.image === "/images/elevator-3d.jpg"
            ? "/images/elevator-clean-3d.jpg"
            : lp.image,
        cadSheets: lp.cadSheets ?? seed?.cadSheets,
      };
    });

    const rawCats =
      localStorage.getItem("piu_categories_v2") || localStorage.getItem("ts_categories");
    const mergedCats: string[] = rawCats ? JSON.parse(rawCats) : serverSnap.categories;

    const saved = await persistToServer({
      projects: mergedProjects,
      categories: Array.isArray(mergedCats) ? mergedCats : serverSnap.categories,
    });

    return saved ?? { ...serverSnap, projects: mergedProjects };
  } catch {
    return serverSnap;
  }
}

export async function fetchLatestFromServer(): Promise<StudioSnapshot | null> {
  if (typeof window === "undefined") return null;
  if (pendingSaves > 0) return null;
  try {
    const res = await fetch(`/api/studio?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok || pendingSaves > 0) return null;
    const data: StudioSnapshot = await res.json();
    const finalData = await migrateLegacyBrowserDataIfNeeded(data);
    writeCacheSafe(STORAGE_KEYS.CATEGORIES, finalData.categories);
    writeCacheSafe(STORAGE_KEYS.PROJECTS, finalData.projects);
    writeCacheSafe(STORAGE_KEYS.COMPARISONS, finalData.comparisons);
    writeCacheSafe(STORAGE_KEYS.QUOTES, finalData.quotes);
    writeCacheSafe(STORAGE_KEYS.VERIFIED_STATS, finalData.verifiedStats);
    writeCacheSafe(STORAGE_KEYS.UPDATED_AT, finalData.updatedAt);
    return finalData;
  } catch {
    return null;
  }
}
