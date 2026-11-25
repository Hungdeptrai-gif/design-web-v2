"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { StudioVerifiedStats } from "@/kieu-du-lieu";

interface CauHinhSoLieuStudioProps {
  verifiedStats: StudioVerifiedStats;
  liveProjectCount: number;
  liveCadSheetCount: number;
  liveCategoryCount: number;
  liveQuoteCount: number;
  onSaveStats: (next: StudioVerifiedStats) => void;
}

export default function CauHinhSoLieuStudio({
  verifiedStats,
  liveProjectCount,
  liveCadSheetCount,
  liveCategoryCount,
  liveQuoteCount,
  onSaveStats,
}: CauHinhSoLieuStudioProps) {
  const [useLive, setUseLive] = useState<boolean>(verifiedStats.useLiveProjectCount);
  const [completedProjects, setCompletedProjects] = useState<number>(
    verifiedStats.completedProjects
  );
  const [partnersCount, setPartnersCount] = useState<number>(verifiedStats.partnersCount);
  const [onTimeRate, setOnTimeRate] = useState<number>(verifiedStats.onTimeRate);
  const [confidentialityRate, setConfidentialityRate] = useState<number>(
    verifiedStats.confidentialityRate
  );
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    setUseLive(verifiedStats.useLiveProjectCount);
    setCompletedProjects(verifiedStats.completedProjects);
    setPartnersCount(verifiedStats.partnersCount);
    setOnTimeRate(verifiedStats.onTimeRate);
    setConfidentialityRate(verifiedStats.confidentialityRate);
  }, [verifiedStats]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStats({
      useLiveProjectCount: useLive,
      completedProjects: Math.max(0, Number(completedProjects) || 0),
      partnersCount: Math.max(0, Number(partnersCount) || 0),
      onTimeRate: Math.min(100, Math.max(0, Number(onTimeRate) || 0)),
      confidentialityRate: Math.min(100, Math.max(0, Number(confidentialityRate) || 0)),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-[#dfd9cd] shadow-sm space-y-5"
      >
        <div className="border-b border-[#ebe6dc] pb-4">
          <h1 className="text-xl font-extrabold text-slate-900">
            Module Cấu Hình Số Liệu Xác Thực Của Studio
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Kiểm soát toàn bộ các chỉ số năng lực thực tế hiển thị ngoài Trang chủ khách hàng.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Đã cập nhật số liệu thực tế lên Trang chủ!</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#dfd9cd] space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useLive}
              onChange={(e) => setUseLive(e.target.checked)}
              className="mt-0.5 rounded accent-[#1e293b]"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Đồng bộ tự động ô &ldquo;Dự Án Đã Hoàn Thành&rdquo; theo đúng số bài thực tế trên web ({liveProjectCount} dự án)
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Khi bật chế độ này, đăng thêm hoặc gỡ dự án thì con số thống kê ngoài Trang chủ tự động tăng/giảm khớp 100%. Bỏ tích nếu muốn nhập tổng số hồ sơ thực tế của Studio.
              </div>
            </div>
          </label>

          {!useLive && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tổng số dự án thực tế Studio đã triển khai
              </label>
              <input
                type="number"
                min={0}
                value={completedProjects}
                onChange={(e) => setCompletedProjects(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#dfd9cd] text-sm font-mono font-bold text-slate-900"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Số đối tác &amp; xưởng thực tế
            </label>
            <input
              type="number"
              min={0}
              value={partnersCount}
              onChange={(e) => setPartnersCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm font-mono font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tỷ lệ nghiệm thu đúng hạn (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={onTimeRate}
              onChange={(e) => setOnTimeRate(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm font-mono font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cam kết bảo mật hồ sơ (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={confidentialityRate}
              onChange={(e) => setConfidentialityRate(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm font-mono font-bold text-slate-900"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer shadow-md"
        >
          LƯU SỐ LIỆU XÁC THỰC LÊN HỆ THỐNG
        </button>
      </form>

      <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#dfd9cd] space-y-4">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Bảng Kiểm Đếm Trực Tiếp Trên Máy Chủ</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          Toàn bộ các con số dưới đây được tính trực tiếp theo thời gian thực từ cơ sở dữ liệu máy chủ, không chứa bản ghi mẫu ảo:
        </p>

        <div className="space-y-2.5 text-sm">
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] flex justify-between items-center">
            <span className="text-stone-600">Hồ sơ dự án đang lưu trữ:</span>
            <strong className="font-mono text-slate-900">{liveProjectCount} dự án</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] flex justify-between items-center">
            <span className="text-stone-600">Tổng số tờ bản vẽ CAD đính kèm:</span>
            <strong className="font-mono text-slate-900">{liveCadSheetCount} tờ bản vẽ</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] flex justify-between items-center">
            <span className="text-stone-600">Danh mục ngành nghề hoạt động:</span>
            <strong className="font-mono text-slate-900">{liveCategoryCount} ngành</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] flex justify-between items-center">
            <span className="text-stone-600">Phiếu khách đăng ký báo giá thực:</span>
            <strong className="font-mono text-[#b45309]">{liveQuoteCount} phiếu</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
