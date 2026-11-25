# Hướng dẫn đưa website Thietkekythuat lên Vercel

Website cần 3 thứ để chạy đủ chu trình **khách gửi phiếu → lưu lại → bạn nhận thông báo → xử lý trong /admin**:

| Thành phần | Dùng để | Cách thêm |
|---|---|---|
| **Upstash Redis** | Lưu phiếu báo giá, dự án, danh mục, cấu hình | Vercel → Storage (1 lần bấm) |
| **Vercel Blob** | Lưu ảnh / bản vẽ bạn tải lên trong /admin | Vercel → Storage (1 lần bấm) |
| **ADMIN_PIN** | Mật khẩu vào trang quản trị | Vercel → Environment Variables |

## 1. Thêm kho dữ liệu (Upstash Redis)
1. Mở dự án trên Vercel → tab **Storage** → **Create Database**.
2. Chọn **Upstash for Redis** (mục Marketplace) → **Continue** → chọn gói **Free** → đặt tên (ví dụ `thietkekythuat-db`) → **Create**.
3. Ở bước **Connect Project**, chọn đúng dự án website → **Connect**.
   Vercel tự thêm `KV_REST_API_URL` và `KV_REST_API_TOKEN`.

## 2. Thêm kho ảnh (Vercel Blob)
1. Tab **Storage** → **Create Database** → chọn **Blob** → **Continue** → đặt tên → **Create**.
2. **Connect** với dự án website. Vercel tự thêm `BLOB_READ_WRITE_TOKEN`.

## 3. Đặt mật khẩu quản trị
1. **Settings → Environment Variables** → **Add New**.
2. Key: `ADMIN_PIN` – Value: mật khẩu bạn chọn (ít nhất 10 ký tự, có chữ và số).
3. **Save**.

## 4. Triển khai lại
**Deployments** → bấm **⋯** ở bản mới nhất → **Redeploy**. (Biến môi trường chỉ có hiệu lực sau khi Redeploy.)

## 5. Kiểm tra
1. Mở `https://<ten-web>.vercel.app/bao-gia`, gửi thử một phiếu.
2. Mở `/admin` → nhập `ADMIN_PIN` → **Phiếu Báo Giá Khách**: phiếu vừa gửi phải xuất hiện.

Nếu gửi phiếu báo lỗi *"Website chưa được kết nối kho dữ liệu"* → làm lại bước 1 và Redeploy.

## 6. Nhận thông báo qua Zalo
Vào `/admin` → **Kết Nối Bot Zalo** → dán **Bot Token** → **Lưu** → mở Zalo nhắn `hi` cho Bot → bấm **Dò Chat ID** → **Gửi thử**.
Token được lưu trên máy chủ và **không bao giờ hiển thị lại** trên trình duyệt.

> Token Bot Zalo cũ đã nằm trong file chia sẻ qua Google Drive, nên hãy **tạo token mới** trước khi dùng.

## 7. (Không bắt buộc) Nhận thông báo qua Email
1. Đăng ký miễn phí tại https://resend.com bằng email bạn muốn nhận thông báo.
2. **API Keys → Create API Key** → sao chép khóa.
3. Thêm 2 biến trên Vercel: `RESEND_API_KEY` = khóa vừa tạo, `NOTIFY_EMAIL` = email đăng ký Resend.
4. Redeploy.

(Khi chưa xác minh tên miền riêng trên Resend, email chỉ gửi được tới chính email đăng ký Resend – đủ cho việc nhận thông báo.)

## Chạy trên máy tính (để phát triển)
```bash
npm install
npm run dev
```
Không cần cấu hình gì: dữ liệu lưu vào `data/studio-db.json`, ảnh vào `public/uploads/`, mật khẩu admin mặc định khi chạy trên máy là `thietkekythuat2026` (mật khẩu này **không** dùng được trên Vercel).
