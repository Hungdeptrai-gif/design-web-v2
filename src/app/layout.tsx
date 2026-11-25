import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "THIETKEKYTHUAT | Đội Ngũ Kỹ Sư Thiết Kế Thang Máy, Đường Ống, Cơ Khí & Kiến Trúc 3D",
  description:
    "Thietkekythuat — Đơn vị Tư vấn & Thiết kế Kỹ thuật đa lĩnh vực: Thang máy, Hệ thống đường ống nhà máy (Piping), Thiết bị công nghiệp, Kiến trúc – Nội thất và Dựng hình 2D/3D theo mẫu chuẩn sản xuất.",
  openGraph: {
    title: "THIETKEKYTHUAT — Kỹ Sư Thiết Kế Thang Máy, Đường Ống & Kiến Trúc 3D",
    description:
      "Giải pháp thiết kế hồ sơ kỹ thuật 2D/3D chuẩn sản xuất: Thang máy, Đường ống nhà máy (Piping), Thiết bị cơ khí và Kiến trúc – Nội thất.",
    images: ["/images/elevator-clean-3d.jpg"],
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${jetbrainsMono.variable}`}>
      <body className="font-[family-name:var(--font-sans)] antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
