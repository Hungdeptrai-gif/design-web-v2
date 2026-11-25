/**
 * Xác thực quản trị phía máy chủ.
 *
 * Mã PIN nằm trong biến môi trường ADMIN_PIN (không nằm trong mã nguồn giao diện).
 * Đăng nhập đúng → máy chủ đặt cookie httpOnly có chữ ký HMAC, hết hạn sau 7 ngày.
 * Mọi API ghi dữ liệu, xem phiếu báo giá, tải tệp và cấu hình Bot Zalo đều kiểm tra cookie này.
 */
import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "tkkt_admin";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

/** Only used when running locally (never on Vercel) so `npm run dev` works without setup. */
const LOCAL_DEV_PIN = "thietkekythuat2026";

export function getAdminPin(): string | null {
  const pin = process.env.ADMIN_PIN?.trim();
  if (pin) return pin;
  return process.env.VERCEL ? null : LOCAL_DEV_PIN;
}

function getSecret(): string | null {
  const pin = getAdminPin();
  if (!pin) return null;
  // A separate secret is optional; otherwise derive one from the PIN so that
  // changing ADMIN_PIN also signs everyone out.
  return process.env.ADMIN_SESSION_SECRET?.trim() || `tkkt-session:${pin}`;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPin(input: string): boolean {
  const pin = getAdminPin();
  return Boolean(pin) && safeEqual(input.trim(), pin as string);
}

export function createSessionToken(): { value: string; maxAge: number } | null {
  const secret = getSecret();
  if (!secret) return null;
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `admin.${expires}`;
  return { value: `${payload}.${sign(payload, secret)}`, maxAge: SESSION_SECONDS };
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires < Date.now() / 1000) return false;
  return safeEqual(parts[2], sign(`admin.${parts[1]}`, secret));
}

export function isAdminRequest(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}
