import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { isAdminRequest } from "@/dich-vu-du-lieu/xac-thuc-quan-tri";

export const runtime = "nodejs";

/** Admin uploads: 3D renders, CAD sheets (images/SVG) and PDF documents. */
const ALLOWED: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};
// Vercel rejects request bodies above ~4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Không tìm thấy tệp tải lên." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const contentType = ALLOWED[ext];
    if (!contentType) {
      return NextResponse.json({ error: "Chỉ hỗ trợ PNG, JPG, WEBP, SVG hoặc PDF." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Tệp vượt quá 4 MB. Vui lòng nén hoặc giảm kích thước." }, { status: 413 });
    }

    const baseName =
      path
        .basename(file.name, ext)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 50) || "ban-ve";
    const uniqueName = `${Date.now()}-${baseName}${ext}`;

    // Vercel: store in Vercel Blob (added via Vercel → Storage).
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
      const blob = await put(`uploads/${uniqueName}`, file, { access: "public", contentType });
      return NextResponse.json({ url: blob.url, fileName: file.name, size: file.size });
    }
    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Chưa kết nối kho lưu tệp. Thêm Vercel Blob trong Vercel → Storage rồi Redeploy." },
        { status: 503 }
      );
    }

    // Local development: save into public/uploads.
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, uniqueName), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${uniqueName}`, fileName: file.name, size: file.size });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Lỗi khi lưu tệp lên máy chủ." }, { status: 500 });
  }
}
