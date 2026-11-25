import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileCheck2 } from "lucide-react";
import { INITIAL_CATEGORIES, SERVICE_PILLARS } from "@/du-lieu-mau";

interface LinhVucThietKeProps {
  categories?: string[];
}

export default function LinhVucThietKe({ categories }: LinhVucThietKeProps) {
  const activeCategories = categories && categories.length > 0 ? categories : INITIAL_CATEGORIES;

  return (
    <section id="linh-vuc" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-[#f3efe8]/85 border border-[#e5dfd3] p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(28,25,23,0.03)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-9">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Nhận Trọn Đề Bài Thiết Kế — Giao Đủ Hồ Sơ Thi Công
              </h2>
              <p className="text-stone-600 mt-2.5">
                Mỗi dự án được phân bổ đúng nhóm Kỹ sư cơ khí, Kỹ sư đường ống hoặc Kiến trúc sư chuyên trách nhằm đảm bảo cả thẩm mỹ 3D lẫn độ chính xác kỹ thuật.
              </p>
            </div>
          </div>

          {/* Dynamic Category Filter Pills synced live from /admin */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-mono font-semibold text-stone-500 mr-1">
              DANH MỤC TRIỂN KHAI:
            </span>
            {activeCategories.map((cat) => (
              <Link
                key={cat}
                href={`/du-an?category=${encodeURIComponent(cat)}`}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#1e293b] text-slate-800 hover:text-white border border-[#dfd9cd] text-xs font-semibold transition shadow-2xs"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICE_PILLARS.map((srv) => {
              const targetCat = encodeURIComponent(srv.targetCategory);
              return (
                <div
                  key={srv.id}
                  className="group rounded-2xl bg-white border border-[#e2ddd2] hover:border-[#1e293b]/50 p-7 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#faf8f5] text-[#b45309] border border-[#e5dfd3]">
                        {srv.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#b45309] transition">
                      {srv.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed mt-3">{srv.description}</p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#ebe6dc] space-y-4">
                    <div>
                      <div className="text-xs font-mono font-semibold text-stone-500 mb-2.5">
                        HỒ SƠ BÀN GIAO TIÊU CHUẨN:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {srv.deliverables.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#e5e0d5] text-xs font-medium text-slate-700"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <Link
                        href={`/bao-gia?category=${targetCat}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e293b] hover:text-[#b45309] transition"
                      >
                        Đăng ký tư vấn hạng mục này <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-dashed border-[#c8bfae] hover:border-[#1e293b] p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition">
            <div className="space-y-1.5 max-w-3xl">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#b45309] border border-amber-200">
                Mở rộng mọi ngành
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Cần Thiết Kế Lĩnh Vực Hoặc Sản Phẩm Đặc Thù Khác?
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Không giới hạn trong 4 nhóm trên — dù bạn cần thiết kế đồ gia dụng, khuôn mẫu, vỏ thiết bị, kết cấu thép, gian hàng hay bất kỳ hạng mục mới nào khác, hãy gửi đề bài để đội ngũ kỹ sư tiếp nhận triển khai.
              </p>
            </div>

            <Link
              href="/bao-gia?category=other"
              className="self-start lg:self-center px-6 py-3.5 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold whitespace-nowrap shadow-md transition flex items-center gap-2 shrink-0"
            >
              <span>Đăng ký lĩnh vực khác</span>
              <ArrowUpRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
