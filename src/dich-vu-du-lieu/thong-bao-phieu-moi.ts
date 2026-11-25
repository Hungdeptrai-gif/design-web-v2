/**
 * Thông báo khi có phiếu báo giá mới: Bot Zalo (nếu đã cấu hình) và Email (nếu đã cấu hình).
 * Mỗi kênh chạy độc lập: một kênh lỗi không chặn kênh còn lại, và không làm hỏng việc lưu phiếu.
 *
 * Email dùng Resend (https://resend.com, miễn phí 3.000 thư/tháng):
 *   RESEND_API_KEY  – khóa API của Resend
 *   NOTIFY_EMAIL    – email nhận thông báo (với tài khoản Resend chưa xác minh tên miền,
 *                     đây phải là email bạn dùng để đăng ký Resend)
 *   RESEND_FROM     – (không bắt buộc) người gửi, mặc định "Thietkekythuat <onboarding@resend.dev>"
 */
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import type { QuoteLead } from "@/kieu-du-lieu";

import { notifyZaloBotNewQuote } from "./may-chu-zalo-bot";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function sendQuoteEmail(quote: QuoteLead): Promise<{ ok: boolean; detail: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.NOTIFY_EMAIL?.trim();
  if (!apiKey || !to) return { ok: false, detail: "Chưa cấu hình RESEND_API_KEY / NOTIFY_EMAIL." };

  const rows: [string, string | undefined][] = [
    ["Mã phiếu", quote.code],
    ["Khách hàng", quote.name],
    ["Số điện thoại / Zalo", quote.phone],
    ["Email", quote.email],
    ["Lĩnh vực", quote.category],
    ["Yêu cầu", quote.note],
    ["Thời gian", quote.createdAt],
  ];
  const zalo = `https://zalo.me/${quote.phone.replace(/^\+84/, "0").replace(/\D/g, "")}`;
  const html = `
    <h2 style="font-family:Arial,sans-serif">🔔 Phiếu báo giá mới – ${escapeHtml(SITE_CONFIG.name)}</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top">${k}</td><td style="padding:6px 0"><b>${escapeHtml(String(v))}</b></td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif"><a href="${zalo}">Mở Zalo của khách</a></p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM?.trim() || `${SITE_CONFIG.name} <onboarding@resend.dev>`,
        to: [to],
        reply_to: quote.email || undefined,
        subject: `Phiếu báo giá mới #${quote.code ?? ""} – ${quote.name} (${quote.category})`,
        html,
      }),
    });
    if (!res.ok) return { ok: false, detail: `Resend trả về ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { ok: true, detail: "Đã gửi email thông báo." };
  } catch (err) {
    return { ok: false, detail: `Không gửi được email: ${(err as Error).message}` };
  }
}

export async function notifyNewQuote(quote: QuoteLead): Promise<void> {
  const results = await Promise.allSettled([notifyZaloBotNewQuote(quote), sendQuoteEmail(quote)]);
  for (const r of results) {
    if (r.status === "rejected") console.error("Quote notification failed:", r.reason);
    else if (r.value && typeof r.value === "object" && "ok" in r.value && !r.value.ok) {
      console.warn("Quote email not sent:", r.value.detail);
    }
  }
}
