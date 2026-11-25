import React from "react";
import { MapPin, PhoneCall, Mail, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

export default function ChanTrangLienHe() {
  return (
    <footer id="lien-he" className="mt-8 border-t border-[#e5dfd3] bg-[#f3efe8]/90 text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#dfd9cd]">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={SITE_CONFIG.logoPath}
                alt={SITE_CONFIG.name}
                className="h-12 w-auto object-contain"
              />
              <div className="pl-3 border-l border-[#d5cfc2]">
                <div className="text-xs font-extrabold tracking-widest text-slate-900">
                  {SITE_CONFIG.brandUpper}
                </div>
                <div className="text-[10px] font-mono text-stone-500">
                  {SITE_CONFIG.tagline}
                </div>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Thông Tin Liên Hệ &amp; Văn Phòng
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#b45309] shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-slate-900">Địa chỉ Studio: </span>
                  <span className="text-stone-600">{SITE_CONFIG.contact.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneCall className="w-4 h-4 text-[#b45309] shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-slate-900">Điện thoại / Zalo Kỹ thuật: </span>
                  <a
                    href={SITE_CONFIG.contact.phoneHref}
                    className="font-bold text-[#1e293b] hover:text-[#b45309] transition"
                  >
                    {SITE_CONFIG.contact.phoneDisplay} (Zalo Kỹ thuật)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#b45309] shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-slate-900">Email tiếp nhận bản vẽ: </span>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    className="text-stone-700 hover:text-slate-900 underline underline-offset-2"
                  >
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#b45309] shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-slate-900">Giờ làm việc: </span>
                  <span className="text-stone-600">{SITE_CONFIG.contact.workingHours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Lĩnh Vực Chủ Lực
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li>
                <a href="#linh-vuc" className="hover:text-slate-900 transition">
                  • Thiết kế Cơ khí &amp; Cabin Thang máy
                </a>
              </li>
              <li>
                <a href="#linh-vuc" className="hover:text-slate-900 transition">
                  • Thiết kế Đường ống Nhà máy (Piping)
                </a>
              </li>
              <li>
                <a href="#linh-vuc" className="hover:text-slate-900 transition">
                  • Thiết bị Công nghiệp &amp; Chế tạo máy
                </a>
              </li>
              <li>
                <a href="#linh-vuc" className="hover:text-slate-900 transition">
                  • Phối cảnh Nhà ở, Nội thất &amp; Vẽ 2D/3D
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-800">{SITE_CONFIG.name}</strong>. Bảo lưu mọi quyền sở hữu trí tuệ &amp; hồ sơ thiết kế.
          </div>
          <div className="flex items-center gap-5 font-medium">
            <a href="#linh-vuc" className="hover:text-slate-900 transition">
              Lĩnh vực thiết kế
            </a>
            <a href="#du-an" className="hover:text-slate-900 transition">
              Hồ sơ dự án
            </a>
            <a href="#doi-ngu" className="hover:text-slate-900 transition">
              Đội ngũ kỹ sư
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
