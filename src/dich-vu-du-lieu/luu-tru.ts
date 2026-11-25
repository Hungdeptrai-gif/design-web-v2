/**
 * Bộ truy xuất dữ liệu đọc/ghi của toàn bộ phân hệ (Dự án, Danh mục, Đối chiếu CAD, Báo giá, Số liệu).
 */
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
import {
  broadcastSnapshot,
  fetchLatestFromServer,
  persistToServer,
  STORAGE_KEYS,
  StudioSnapshot,
  writeCacheSafe,
} from "./dong-bo-thoi-gian-thuc";

export { uploadStudioFile } from "./tai-tep-tin";
export {
  STUDIO_CHANNEL_NAME,
  STUDIO_LOCAL_EVENT,
  type StudioSnapshot,
} from "./dong-bo-thoi-gian-thuc";

function filterRealQuotes(list: QuoteLead[]): QuoteLead[] {
  return list.filter(
    (q) => q && q.id !== "q-demo-1" && !String(q.phone).toLowerCase().includes("x")
  );
}

export const studioStorage = {
  getCategories(): string[] {
    if (typeof window === "undefined") return INITIAL_CATEGORIES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!raw) return INITIAL_CATEGORIES;
      const parsed: string[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: string[]): Promise<StudioSnapshot | null> {
    writeCacheSafe(STORAGE_KEYS.CATEGORIES, categories);
    broadcastSnapshot({ categories });
    return persistToServer({ categories });
  },

  getProjects(): ProjectItem[] {
    if (typeof window === "undefined") return INITIAL_PROJECTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!raw) return INITIAL_PROJECTS;
      const parsed: ProjectItem[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  },

  saveProjects(projects: ProjectItem[]): Promise<StudioSnapshot | null> {
    writeCacheSafe(STORAGE_KEYS.PROJECTS, projects);
    broadcastSnapshot({ projects });
    return persistToServer({ projects });
  },

  getComparisons(): ComparisonPair[] {
    if (typeof window === "undefined") return INITIAL_COMPARISONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMPARISONS);
      if (!raw) return INITIAL_COMPARISONS;
      const parsed: ComparisonPair[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_COMPARISONS;
    } catch {
      return INITIAL_COMPARISONS;
    }
  },

  saveComparisons(comparisons: ComparisonPair[]): Promise<StudioSnapshot | null> {
    writeCacheSafe(STORAGE_KEYS.COMPARISONS, comparisons);
    broadcastSnapshot({ comparisons });
    return persistToServer({ comparisons });
  },

  getQuotes(): QuoteLead[] {
    if (typeof window === "undefined") return INITIAL_QUOTES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (!raw) return INITIAL_QUOTES;
      const parsed: QuoteLead[] = JSON.parse(raw);
      return Array.isArray(parsed) ? filterRealQuotes(parsed) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  },

  saveQuotes(quotes: QuoteLead[]): Promise<StudioSnapshot | null> {
    const clean = filterRealQuotes(quotes);
    writeCacheSafe(STORAGE_KEYS.QUOTES, clean);
    broadcastSnapshot({ quotes: clean });
    return persistToServer({ quotes: clean });
  },

  addQuote(newLead: QuoteLead): QuoteLead[] {
    const current = this.getQuotes();
    const updated = [newLead, ...current];
    writeCacheSafe(STORAGE_KEYS.QUOTES, updated);
    broadcastSnapshot({ quotes: updated });
    void persistToServer({ newQuote: newLead });
    return updated;
  },

  getVerifiedStats(): StudioVerifiedStats {
    if (typeof window === "undefined") return INITIAL_VERIFIED_STATS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VERIFIED_STATS);
      if (!raw) return INITIAL_VERIFIED_STATS;
      return JSON.parse(raw) as StudioVerifiedStats;
    } catch {
      return INITIAL_VERIFIED_STATS;
    }
  },

  saveVerifiedStats(verifiedStats: StudioVerifiedStats): Promise<StudioSnapshot | null> {
    writeCacheSafe(STORAGE_KEYS.VERIFIED_STATS, verifiedStats);
    broadcastSnapshot({ verifiedStats });
    return persistToServer({ verifiedStats });
  },

  syncFromServer(): Promise<StudioSnapshot | null> {
    return fetchLatestFromServer();
  },

  isAdminAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true";
  },

  setAdminAuthenticated(status: boolean): void {
    if (typeof window === "undefined") return;
    if (status) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },
};
