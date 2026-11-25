import React from "react";
import { Settings2, Wrench, Building, Layers3 } from "lucide-react";
import { SOFTWARE_STACK, WORKFLOW_STEPS } from "@/du-lieu-mau";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

const DEPARTMENTS = [
  {
    icon: Settings2,
    name: "Khối Cơ khí Chế tạo & Thang máy",
    desc: "Chuyên trách kết cấu chịu lực, cabin thang máy, kim loại tấm CNC & thiết bị máy móc.",
  },
  {
    icon: Wrench,
    name: "Khối Hệ thống Đường ống & Nhà máy (Piping / M&E)",
    desc: "Thiết kế tuyến ống công nghiệp, bồn bể, layout dây chuyền và xuất bản vẽ Isometric.",
  },
  {
    icon: Building,
    name: "Khối Kiến trúc Nhà ở & Nội thất",
    desc: "Phối cảnh không gian sống, nội thất đồng bộ thang máy gia đình và đồ dùng theo yêu cầu.",
  },
  {
    icon: Layers3,
    name: "Tổ Số hóa 2D/3D & Thiết kế theo Mẫu",
    desc: "Dựng mô hình 3D nhanh từ ảnh chụp, sản phẩm thực tế hoặc bản phác thảo ý tưởng.",
  },
];

export default function DoiNguVaQuyTrinh() {
  return (
    <section id="doi-ngu" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Đội Ngũ Kỹ Sư &amp; Kiến Trúc Sư Phối Hợp Đa Chuyên Ngành
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Thay vì làm việc đơn lẻ, {SITE_CONFIG.name} vận hành theo mô hình tổ hợp chuyên môn: mỗi hạng mục trong dự án đều do đúng kỹ sư chuyên ngành trực tiếp tính toán và kiểm duyệt bản vẽ trước khi bàn giao.
            </p>

            <div className="space-y-3 pt-2">
              {DEPARTMENTS.map((dept) => (
                <div
                  key={dept.name}
                  className="p-4 rounded-2xl bg-white border border-[#e5e0d5] shadow-2xs flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-xl bg-[#f3efe8] text-[#1e293b] shrink-0">
                    <dept.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{dept.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-7 rounded-3xl bg-white border border-[#e5e0d5] shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-5">
                Làm Chủ Công Cụ Thiết Kế Hàng Đầu Ngành Kỹ Thuật
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SOFTWARE_STACK.map((sw) => (
                  <div
                    key={sw.name}
                    className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] hover:border-slate-400 transition"
                  >
                    <div className="font-mono font-bold text-sm text-slate-900">{sw.name}</div>
                    <div className="text-xs text-stone-600 mt-0.5">{sw.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-[#f3efe8]/90 border border-[#e2ddd2]">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-800 mb-4">
                QUY TRÌNH NHẬN THẦU 4 BƯỚC RÕ RÀNG
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WORKFLOW_STEPS.map((st) => (
                  <div key={st.step} className="p-4 rounded-2xl bg-white border border-[#e5e0d5]">
                    <span className="text-[11px] font-mono font-bold text-[#b45309]">{st.step}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{st.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
