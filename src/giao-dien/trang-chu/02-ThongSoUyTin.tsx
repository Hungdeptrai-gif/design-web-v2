"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Building2, FolderCheck, ShieldCheck } from "lucide-react";
import { INITIAL_VERIFIED_STATS, MARQUEE_CAPABILITIES } from "@/du-lieu-mau";
import { StudioVerifiedStats } from "@/kieu-du-lieu";

function CountUpNumber({
  target,
  suffix = "",
  duration = 1300,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

interface ThongSoUyTinProps {
  verifiedStats?: StudioVerifiedStats;
  liveProjectCount?: number;
}

export default function ThongSoUyTin({
  verifiedStats,
  liveProjectCount,
}: ThongSoUyTinProps) {
  const stats = verifiedStats ?? INITIAL_VERIFIED_STATS;
  const projectNumber = stats.useLiveProjectCount
    ? liveProjectCount ?? stats.completedProjects
    : stats.completedProjects;
  const projectSuffix = stats.useLiveProjectCount ? "" : "+";

  return (
    <div className="mt-12 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Ô 1: DỰ ÁN HOÀN THÀNH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="lg:col-span-3 group relative rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#1e293b]/60 p-6 shadow-[0_10px_35px_rgba(28,25,23,0.045)] hover:shadow-[0_20px_45px_rgba(28,25,23,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[190px]"
        >
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3 relative">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#faf8f5] border border-[#e5dfd3] text-[11px] font-semibold text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Dự án đã triển khai
              </span>
              <div className="text-4xl sm:text-[42px] font-extrabold text-slate-900 font-mono tracking-tight mt-3">
                <CountUpNumber target={projectNumber} suffix={projectSuffix} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f5f1e9] border border-[#e5dfd3] text-[#1e293b] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FolderCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="relative mt-4 pt-3.5 border-t border-[#efeae0]">
            <div className="text-sm font-bold text-slate-900">Dự Án Đã Hoàn Thành</div>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Hồ sơ Thang máy, Đường ống, Cơ khí &amp; Nội thất đã bàn giao sản xuất.
            </p>
          </div>
        </motion.div>

        {/* Ô 2: ĐỐI TÁC & XƯỞNG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="lg:col-span-3 group relative rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#b45309]/60 p-6 shadow-[0_10px_35px_rgba(28,25,23,0.045)] hover:shadow-[0_20px_45px_rgba(28,25,23,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[190px]"
        >
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-600/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3 relative">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-[#b45309]">
                Hợp tác toàn quốc
              </span>
              <div className="text-4xl sm:text-[42px] font-extrabold text-[#b45309] font-mono tracking-tight mt-3">
                <CountUpNumber target={stats.partnersCount} suffix="+" duration={1400} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/70 text-[#b45309] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="relative mt-4 pt-3.5 border-t border-[#efeae0]">
            <div className="text-sm font-bold text-slate-900">Đối Tác &amp; Xưởng Sản Xuất</div>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Nhà thầu cơ điện M&amp;E, đơn vị thang máy &amp; chủ đầu tư tin tưởng đồng hành.
            </p>
          </div>
        </motion.div>

        {/* Ô 3: NGHIỆM THU ĐÚNG TIẾN ĐỘ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.23 }}
          className="lg:col-span-3 group relative rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#1e293b]/60 p-6 shadow-[0_10px_35px_rgba(28,25,23,0.045)] hover:shadow-[0_20px_45px_rgba(28,25,23,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[190px]"
        >
          <div className="flex items-start justify-between gap-3 relative">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#faf8f5] border border-[#e5dfd3] text-[11px] font-semibold text-stone-600">
                Cam kết chất lượng
              </span>
              <div className="text-4xl sm:text-[42px] font-extrabold text-slate-900 font-mono tracking-tight mt-3">
                <CountUpNumber target={stats.onTimeRate} suffix="%" duration={1500} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f5f1e9] border border-[#e5dfd3] text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="relative mt-4 pt-3.5 border-t border-[#efeae0]">
            <div className="text-sm font-bold text-slate-900">Nghiệm Thu Đúng Tiến Độ</div>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Bản vẽ chuẩn xác thông số gia công CNC, lắp đặt khớp ngay tại công trình.
            </p>
          </div>
        </motion.div>

        {/* Ô 4: BẢO MẬT HỒ SƠ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
          className="lg:col-span-3 group relative rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#b45309]/60 p-6 shadow-[0_10px_35px_rgba(28,25,23,0.045)] hover:shadow-[0_20px_45px_rgba(28,25,23,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[190px]"
        >
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-600/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3 relative">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-[#b45309]">
                An toàn bảo mật
              </span>
              <div className="text-4xl sm:text-[42px] font-extrabold text-[#b45309] font-mono tracking-tight mt-3">
                <CountUpNumber target={stats.confidentialityRate} suffix="%" duration={1550} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/70 text-[#b45309] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="relative mt-4 pt-3.5 border-t border-[#efeae0]">
            <div className="text-sm font-bold text-slate-900">Bảo Mật Bản Vẽ &amp; Mẫu Mã</div>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Giữ kín toàn bộ thông số công nghệ, kiểu dáng sản phẩm &amp; dữ liệu khách hàng.
            </p>
          </div>
        </motion.div>
      </div>

      {/* DẢI BĂNG CHỮ CHẠY NGANG */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-[#e5dfd3] py-3 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee">
          {[...MARQUEE_CAPABILITIES, ...MARQUEE_CAPABILITIES].map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-6 px-3 text-[11.5px] font-mono font-semibold tracking-wider text-stone-600 whitespace-nowrap"
            >
              <span>{item}</span>
              <span className="text-[#b45309]">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
