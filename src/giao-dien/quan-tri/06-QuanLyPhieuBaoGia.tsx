"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  Trash2,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { QuoteLead } from "@/kieu-du-lieu";

interface QuanLyPhieuBaoGiaProps {
  quotes: QuoteLead[];
  onToggleQuoteStatus: (id: string) => void;
  onDeleteQuote: (id: string) => void;
}

export default function QuanLyPhieuBaoGia({
  quotes,
  onToggleQuoteStatus,
  onDeleteQuote,
}: QuanLyPhieuBaoGiaProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "contacted">("all");

  const pendingCount = quotes.filter((q) => q.status !== "contacted").length;
  const contactedCount = quotes.filter((q) => q.status === "contacted").length;

  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter === "pending") return q.status !== "contacted";
    if (statusFilter === "contacted") return q.status === "contacted";
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Real Verified Quote Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`p-5 rounded-3xl border text-left transition cursor-pointer ${
            statusFilter === "all"
              ? "bg-[#1e293b] text-white border-[#1e293b]"
              : "bg-white border-[#dfd9cd] text-slate-900"
          }`}
        >
          <div className={`text-xs font-mono ${statusFilter === "all" ? "text-slate-300" : "text-stone-500"}`}>
            TỔNG PHIẾU ĐĂNG KÝ THỰC TẾ
          </div>
          <div className="text-2xl font-extrabold font-mono mt-1">{quotes.length} phiếu</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`p-5 rounded-3xl border text-left transition cursor-pointer ${
            statusFilter === "pending"
              ? "bg-[#b45309] text-white border-[#b45309]"
              : "bg-white border-[#dfd9cd] text-[#b45309]"
          }`}
        >
          <div className={`text-xs font-mono ${statusFilter === "pending" ? "text-amber-100" : "text-[#b45309]"}`}>
            CHỜ KỸ SƯ LIÊN HỆ
          </div>
          <div className="text-2xl font-extrabold font-mono mt-1">{pendingCount} phiếu</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("contacted")}
          className={`p-5 rounded-3xl border text-left transition cursor-pointer ${
            statusFilter === "contacted"
              ? "bg-emerald-700 text-white border-emerald-700"
              : "bg-white border-[#dfd9cd] text-emerald-700"
          }`}
        >
          <div className={`text-xs font-mono ${statusFilter === "contacted" ? "text-emerald-100" : "text-emerald-700"}`}>
            ĐÃ LIÊN HỆ / BÁO GIÁ
          </div>
          <div className="text-2xl font-extrabold font-mono mt-1">{contactedCount} phiếu</div>
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-[#dfd9cd] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebe6dc] pb-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Module Quản Lý Phiếu Đăng Ký Báo Giá Thực Tế
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Chỉ ghi nhận dữ liệu thực gửi trực tiếp từ cổng /bao-gia kèm kiểm tra định dạng số điện thoại thực tế và dấu thời gian chính xác.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> Dữ liệu xác thực 100%
          </span>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <p className="text-sm font-bold text-slate-800">
              {quotes.length === 0
                ? "Hiện đang có 0 phiếu đăng ký báo giá."
                : "Không có phiếu nào thuộc nhóm trạng thái đang lọc."}
            </p>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Hệ thống không dùng dữ liệu mẫu ảo. Ngay khi khách hàng gửi thông tin thực từ trang /bao-gia, phiếu sẽ hiển thị tức thì tại đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuotes.map((q) => {
              const isContacted = q.status === "contacted";
              const zaloDigits = q.phone.replace(/^\+84/, "0").replace(/[^0-9]/g, "");
              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition ${
                    isContacted
                      ? "bg-stone-50 border-stone-200"
                      : "bg-[#faf8f5] border-[#d8cfc0] shadow-2xs"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {q.code && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 text-[11px] font-mono font-bold">
                            #{q.code}
                          </span>
                        )}
                        <span className="font-bold text-slate-900 text-base">{q.name}</span>
                      </div>
                      <span className="text-xs font-mono text-stone-500">{q.createdAt}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <a
                        href={`tel:${q.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-mono font-semibold"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-300" /> {q.phone}
                      </a>
                      <a
                        href={`https://zalo.me/${zaloDigits}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-semibold"
                      >
                        <MessageSquare className="w-3 h-3" /> Mở Zalo SĐT này
                      </a>
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] font-semibold">
                        {q.category}
                      </span>
                      {q.email && <span className="text-stone-600 font-mono">{q.email}</span>}
                    </div>

                    <p className="text-sm text-stone-700 pt-1 leading-relaxed">{q.note}</p>
                  </div>

                  <div className="pt-3 border-t border-[#ebe6dc] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleQuoteStatus(q.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                        isContacted
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-white border-amber-300 text-[#b45309] hover:bg-amber-50"
                      }`}
                    >
                      {isContacted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã liên hệ báo giá
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" /> Đánh dấu đã liên hệ
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteQuote(q.id)}
                      className="text-xs text-stone-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa phiếu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
