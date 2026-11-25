/**
 * Tệp cấu hình tập trung toàn bộ thông tin thương hiệu & liên hệ của Studio.
 * Cần đổi SĐT, Zalo, Email, Địa chỉ, Con số thống kê chỉ cần sửa tại đây.
 * Mật khẩu quản trị KHÔNG nằm ở đây: đặt biến môi trường ADMIN_PIN trên Vercel.
 */
export const SITE_CONFIG = {
  name: "Thietkekythuat",
  brandUpper: "THIETKEKYTHUAT",
  tagline: "ENGINEERING & DESIGN",
  logoPath: "/images/thietkekythuat-logo.svg",
  description:
    "Đơn vị tư vấn & triển khai hồ sơ thiết kế kỹ thuật chuyên sâu: Thang máy, Hệ thống đường ống công nghiệp (Piping), Thiết bị cơ khí chế tạo, Kiến trúc – Nội thất và Dựng hình 2D/3D theo yêu cầu trên toàn quốc.",
  contact: {
    phoneDisplay: "0947.147.858",
    phoneHref: "tel:0947147858",
    zaloUrl: "https://zalo.me/0947147858",
    email: "planitupz@gmail.com",
    address: "Khu Đô thị Mới, Quận Cầu Giấy, TP. Hà Nội (Nhận triển khai hồ sơ toàn quốc)",
    workingHours: "Thứ 2 – Thứ 7 (08:00 – 18:00)",
  },
  stats: {
    completedProjects: 120,
    partnersCount: 45,
    onTimeRate: 99,
    confidentialityRate: 100,
    maxPinnedOnHome: 4,
    archiveItemsPerPage: 6,
  },
} as const;
