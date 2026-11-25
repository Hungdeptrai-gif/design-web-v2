import { after, NextRequest, NextResponse } from "next/server";

import {
  addQuote,
  getSiteContent,
  getStoreMode,
  listQuotes,
  saveSiteContent,
  StoreUnavailableError,
  updateQuotes,
  type SiteContent,
} from "@/dich-vu-du-lieu/kho-du-lieu";
import { notifyNewQuote } from "@/dich-vu-du-lieu/thong-bao-phieu-moi";
import { isAdminRequest } from "@/dich-vu-du-lieu/xac-thuc-quan-tri";
import type { QuoteLead } from "@/kieu-du-lieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: NO_CACHE_HEADERS });

/** Public visitors get site content only; customer quotes are returned to admins only. */
async function snapshot(isAdmin: boolean) {
  const [site, quotes] = await Promise.all([getSiteContent(), isAdmin ? listQuotes() : Promise.resolve([])]);
  return { ...site, quotes, isAdmin, storeMode: getStoreMode() };
}

export async function GET(req: NextRequest) {
  try {
    return json(await snapshot(isAdminRequest(req)));
  } catch (err) {
    console.error("Load studio data error:", err);
    return json({ error: "Không thể tải dữ liệu." }, 500);
  }
}

// ---------------------------------------------------------------------------
// New quote from the public form
// ---------------------------------------------------------------------------

const PHONE_RE = /^(0|\+84)(2|3|5|7|8|9)[0-9]{8,9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** "13:27:36 — 25/11/2026" in Vietnam time, matching the format the site already shows. */
function vietnamTimestamp(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return `${parts.hour}:${parts.minute}:${parts.second} — ${parts.day}/${parts.month}/${parts.year}`;
}

function buildQuote(input: Partial<QuoteLead>): QuoteLead | { error: string } {
  const name = str(input.name, 120);
  const phone = str(input.phone, 20).replace(/[\s.-]/g, "");
  const email = str(input.email, 200);
  const category = str(input.category, 120);
  const note = str(input.note, 2000);

  if (name.length < 2) return { error: "Vui lòng nhập họ tên người liên hệ." };
  if (!PHONE_RE.test(phone)) return { error: "Số điện thoại đăng ký không hợp lệ." };
  if (email && !EMAIL_RE.test(email)) return { error: "Địa chỉ email không hợp lệ." };
  if (!category) return { error: "Vui lòng chọn lĩnh vực cần tư vấn." };

  // Id, code and time are assigned by the server, not trusted from the browser.
  const now = new Date();
  const vn = vietnamTimestamp(now);
  const [day, month] = vn.split(" — ")[1].split("/");
  return {
    id: `q-${now.getTime()}`,
    code: `TKKT-${day}${month}-${Math.floor(100 + Math.random() * 900)}`,
    name,
    phone,
    email: email || undefined,
    category,
    note: note || "Đăng ký tư vấn và nhận báo giá thiết kế.",
    createdAt: vn,
    status: "pending",
  };
}

// ---------------------------------------------------------------------------

type Patch = Partial<Omit<SiteContent, "updatedAt">> & {
  newQuote?: Partial<QuoteLead>;
  quotes?: QuoteLead[];
  deletedQuoteIds?: string[];
};

export async function POST(req: NextRequest) {
  let patch: Patch;
  try {
    patch = (await req.json()) as Patch;
  } catch {
    return json({ error: "Dữ liệu gửi lên không hợp lệ." }, 400);
  }

  try {
    // Public: submit a new quote request.
    if (patch.newQuote) {
      const quote = buildQuote(patch.newQuote);
      if ("error" in quote) return json({ error: quote.error }, 400);
      await addQuote(quote);
      // Notify after the response is sent; Vercel keeps the function alive for it.
      after(() => notifyNewQuote(quote));
      return json({ ok: true, quote });
    }

    // Everything else changes site content or the quote inbox: admins only.
    if (!isAdminRequest(req)) {
      return json({ error: "Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại." }, 401);
    }

    const sitePatch: Partial<Omit<SiteContent, "updatedAt">> = {};
    if (Array.isArray(patch.categories)) sitePatch.categories = patch.categories;
    if (Array.isArray(patch.projects)) sitePatch.projects = patch.projects;
    if (Array.isArray(patch.comparisons)) sitePatch.comparisons = patch.comparisons;
    if (patch.verifiedStats && typeof patch.verifiedStats === "object") sitePatch.verifiedStats = patch.verifiedStats;
    if (Object.keys(sitePatch).length) await saveSiteContent(sitePatch);

    if (Array.isArray(patch.quotes) || Array.isArray(patch.deletedQuoteIds)) {
      await updateQuotes(
        Array.isArray(patch.quotes) ? patch.quotes : [],
        Array.isArray(patch.deletedQuoteIds) ? patch.deletedQuoteIds.filter((id) => typeof id === "string") : []
      );
    }

    return json(await snapshot(true));
  } catch (err) {
    if (err instanceof StoreUnavailableError) return json({ error: err.message }, 503);
    console.error("Save studio data error:", err);
    return json({ error: "Không thể lưu dữ liệu. Vui lòng thử lại." }, 500);
  }
}
