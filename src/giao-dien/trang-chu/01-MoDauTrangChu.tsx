"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HERO_SHOWCASE } from "@/du-lieu-mau";
import { StudioVerifiedStats } from "@/kieu-du-lieu";
import ThongSoUyTin from "@/giao-dien/trang-chu/02-ThongSoUyTin";

interface MoDauTrangChuProps {
  verifiedStats?: StudioVerifiedStats;
  liveProjectCount?: number;
}

export default function MoDauTrangChu({
  verifiedStats,
  liveProjectCount,
}: MoDauTrangChuProps) {
  const [heroIdx, setHeroIdx] = useState<number>(0);

  return (
    <section className="relative pt-12 pb-10 lg:pt-18 lg:pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-cad-grid mask-grid-fade pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-amber-500/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#e3ddd0] shadow-2xs text-xs font-mono font-semibold text-[#b45309]">
              <span className="w-2 h-2 rounded-full bg-[#b45309]" />
              ĐỘI NGŨ KỸ SƯ CƠ KHÍ • ĐƯỜNG ỐNG • KIẾN TRÚC 3D
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[49px] font-extrabold text-slate-900 tracking-tight leading-[1.16]">
              Giải Pháp Thiết Kế{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b45309] via-[#92400e] to-[#1e293b]">
                Kỹ Thuật &amp; Không Gian
              </span>{" "}
              Chuẩn Sản Xuất
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Từ kết cấu <strong className="text-slate-900">Thang máy</strong>, hệ thống{" "}
              <strong className="text-slate-900">Đường ống nhà máy (Piping)</strong>,{" "}
              <strong className="text-slate-900">Thiết bị công nghiệp</strong> đến phối cảnh{" "}
              <strong className="text-slate-900">Nhà ở – Nội thất</strong> và dựng bản vẽ 2D/3D theo mọi mẫu yêu cầu.
              Chuẩn xác thông số để đưa thẳng vào xưởng gia công &amp; thi công thực tế.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/bao-gia"
                className="px-7 py-4 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-slate-900/15 transition flex items-center gap-2"
              >
                Gửi mẫu / Nhận báo giá ngay <ArrowUpRight className="w-5 h-5 text-amber-300" />
              </Link>
              <Link
                href="/du-an"
                className="px-6 py-4 rounded-full bg-white hover:bg-stone-100 border border-[#dfd9cd] text-slate-800 font-semibold text-sm sm:text-base shadow-2xs transition"
              >
                Xem kho dự án thực tế
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-[28px] bg-white border border-[#dfd9cd] p-3.5 shadow-[0_16px_45px_rgba(28,25,23,0.07)]">
              <div className="grid grid-cols-4 gap-1.5 mb-3 p-1 rounded-2xl bg-[#f5f2eb]">
                {HERO_SHOWCASE.map((item, idx) => (
                  <button
                    key={item.label}
                    onClick={() => setHeroIdx(idx)}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold transition text-center whitespace-nowrap cursor-pointer ${
                      heroIdx === idx
                        ? "bg-[#1e293b] text-white shadow-sm"
                        : "text-stone-600 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={HERO_SHOWCASE[heroIdx].image}
                    src={HERO_SHOWCASE[heroIdx].image}
                    alt={HERO_SHOWCASE[heroIdx].title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-5">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {HERO_SHOWCASE[heroIdx].title}
                  </div>
                  <div className="text-xs text-stone-200 mt-1 font-mono">
                    {HERO_SHOWCASE[heroIdx].spec}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ThongSoUyTin verifiedStats={verifiedStats} liveProjectCount={liveProjectCount} />
      </div>
    </section>
  );
}
