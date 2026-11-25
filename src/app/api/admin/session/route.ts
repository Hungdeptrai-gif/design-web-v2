import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  checkPin,
  createSessionToken,
  getAdminPin,
  isAdminRequest,
} from "@/dich-vu-du-lieu/xac-thuc-quan-tri";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Is the current browser signed in as admin? */
export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: isAdminRequest(req), configured: Boolean(getAdminPin()) });
}

/** Sign in with the admin PIN. */
export async function POST(req: NextRequest) {
  if (!getAdminPin()) {
    return NextResponse.json(
      { error: "Chưa cấu hình mã quản trị. Thêm biến môi trường ADMIN_PIN trong Vercel rồi Redeploy." },
      { status: 503 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as { pin?: unknown };
  // Slow down guessing a little.
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (typeof body.pin !== "string" || !checkPin(body.pin)) {
    return NextResponse.json({ error: "Mật khẩu quản trị không chính xác." }, { status: 401 });
  }
  const session = createSessionToken();
  if (!session) return NextResponse.json({ error: "Không thể tạo phiên đăng nhập." }, { status: 500 });

  const res = NextResponse.json({ authenticated: true });
  res.cookies.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAge,
  });
  return res;
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
