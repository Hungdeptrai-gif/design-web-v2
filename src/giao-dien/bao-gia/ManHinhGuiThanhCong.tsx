"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

interface ManHinhGuiThanhCongProps {
  submittedCode: string;
  submittedAt: string;
  name: string;
  phone: string;
  effectiveCategory: string;
  onReset: () => void;
}

export default function ManHinhGuiThanhCong({
  submittedCode,
  submittedAt,
  name,
  phone,
  effectiveCategory,
  onReset,
}: ManHinhGuiThanhCongProps) {
  return (
    <div className="max-w-2xl mx-auto rounded-[32px] bg-white border border-[#dfd9cd] p-8 sm:p-12 shadow-xl text-center space-y-6 my-8">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-9 h-9" />
      </div>
      <div className="space-y-2">
        <span className="inline-block px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-[#b45309]">
          MÃ PHIẾU ĐĂNG KÝ: #{submittedCode}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Đã Ghi Nhận Phiếu Đăng Ký Thành Công!
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Yêu cầu tư vấn mảng <strong className="text-slate-900">{effectiveCategory}</strong> đã được lưu vào hệ thống điều phối kỹ thuật của <strong>{SITE_CONFIG.name}</strong>.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] text-left text-xs sm:text-sm space-y-2 text-stone-700">
        <div className="flex justify-between gap-4">
          <span className="text-stone-500">Thời gian ghi nhận:</span>
          <span className="font-mono font-semibold text-slate-900">{submittedAt}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-500">Người liên hệ:</span>
          <span className="font-semibold text-slate-900">{name}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-500">Số điện thoại / Zalo xác thực:</span>
          <span className="font-mono font-semibold text-slate-900">{phone}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-500">Lĩnh vực đăng ký:</span>
          <span className="font-semibold text-[#b45309] text-right">{effectiveCategory}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm transition"
        >
          ← Quay về Trang chủ
        </Link>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 border border-[#dfd9cd] text-slate-800 font-semibold text-sm transition cursor-pointer"
        >
          Đăng ký thêm yêu cầu khác
        </button>
      </div>
    </div>
  );
}
