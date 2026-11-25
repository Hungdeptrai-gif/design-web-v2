"use client";

import React from "react";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

interface TheXacNhanYeuCauProps {
  name: string;
  phone: string;
  effectiveCategory: string;
  submitting?: boolean;
  errorMsg?: string;
}

export default function TheXacNhanYeuCau({
  name,
  phone,
  effectiveCategory,
  submitting = false,
  errorMsg = "",
}: TheXacNhanYeuCauProps) {
  return (
    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
      <div className="rounded-3xl bg-[#1e293b] text-white p-7 shadow-xl space-y-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
            PHIẾU ĐĂNG KÝ DỊCH VỤ
          </span>
          <h3 className="text-xl font-bold mt-1">Xác Nhận Yêu Cầu</h3>
        </div>

        <div className="space-y-3.5 text-sm border-y border-slate-700/80 py-5">
          <div>
            <div className="text-xs text-slate-400">Người đăng ký:</div>
            <div className="font-semibold text-white mt-0.5">{name.trim() || "..."}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Số điện thoại / Zalo:</div>
            <div className="font-semibold text-white mt-0.5">{phone.trim() || "..."}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Lĩnh vực cần thiết kế:</div>
            <div className="font-bold text-amber-300 mt-0.5">{effectiveCategory}</div>
          </div>
        </div>

        {errorMsg ? (
          <p role="alert" className="rounded-xl bg-rose-500/15 border border-rose-400/40 px-3 py-2.5 text-xs text-rose-100">
            {errorMsg}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-full bg-[#b45309] hover:bg-amber-600 disabled:opacity-60 disabled:cursor-wait text-white font-bold text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          {submitting ? "ĐANG GỬI..." : "GỬI ĐĂNG KÝ BÁO GIÁ"}
        </button>

        <div className="space-y-2 text-xs text-slate-300 pt-1">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Bảo mật tuyệt đối thông tin khách hàng &amp; dự án.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>Kỹ sư liên hệ tư vấn trực tiếp và gửi báo giá nhanh chóng.</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-[#f3efe8] border border-[#e2dcd0] p-5 text-xs text-stone-700 space-y-1.5">
        <div className="font-bold text-slate-900">Liên hệ trực tiếp qua Zalo</div>
        <p className="leading-relaxed">
          Zalo Kỹ thuật: <strong>{SITE_CONFIG.contact.phoneDisplay}</strong> • Email:{" "}
          <strong>{SITE_CONFIG.contact.email}</strong>
        </p>
      </div>
    </div>
  );
}
