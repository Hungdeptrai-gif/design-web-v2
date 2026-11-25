"use client";

import React from "react";
import {
  AlertCircle,
  Building,
  Layers,
  PlusCircle,
  Settings2,
  Sparkles,
  Wrench,
} from "lucide-react";
import { OTHER_CATEGORY_KEY } from "./xac-thuc-bieu-mau";

interface FormDangKyBaoGiaProps {
  selectableCategories: string[];
  name: string;
  phone: string;
  email: string;
  selectedCat: string;
  customCat: string;
  note: string;
  errorMsg: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onSelectCat: (v: string) => void;
  onCustomCatChange: (v: string) => void;
  onNoteChange: (v: string) => void;
}

function getCategoryIcon(cat: string) {
  if (cat === OTHER_CATEGORY_KEY) return PlusCircle;
  if (cat.includes("Thang máy")) return Settings2;
  if (cat.includes("Đường ống")) return Wrench;
  if (cat.includes("Nhà ở") || cat.includes("Nội thất")) return Building;
  if (cat.includes("2D/3D")) return Layers;
  return Sparkles;
}

export default function FormDangKyBaoGia({
  selectableCategories,
  name,
  phone,
  email,
  selectedCat,
  customCat,
  note,
  errorMsg,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onSelectCat,
  onCustomCatChange,
  onNoteChange,
}: FormDangKyBaoGiaProps) {
  return (
    <div className="lg:col-span-8 space-y-7">
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="rounded-3xl bg-white border border-[#e2ddd2] p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#1e293b] text-white text-xs font-mono font-bold flex items-center justify-center">
            01
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Thông tin liên hệ nhận báo giá (*)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Họ tên / Tên đơn vị (*)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nhập họ tên hoặc đơn vị..."
              className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1e293b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Số điện thoại / Zalo thực tế (*)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="Nhập số điện thoại..."
              className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1e293b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email (không bắt buộc)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Nhập email..."
              className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1e293b]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-[#e2ddd2] p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#1e293b] text-white text-xs font-mono font-bold flex items-center justify-center">
            02
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Chọn lĩnh vực bạn cần thiết kế (*)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {selectableCategories.map((cat) => {
            const IconComp = getCategoryIcon(cat);
            const active = selectedCat === cat;
            const isOther = cat === OTHER_CATEGORY_KEY;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => onSelectCat(cat)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                  active
                    ? "bg-[#1e293b] text-white border-[#1e293b] shadow-md"
                    : isOther
                    ? "bg-amber-50/60 hover:bg-amber-50 text-slate-900 border-dashed border-[#c8a97e]"
                    : "bg-[#faf8f5] hover:bg-[#f3efe8] text-slate-800 border-[#e2ddd2]"
                }`}
              >
                <IconComp className={`w-5 h-5 ${active ? "text-amber-300" : "text-[#b45309]"}`} />
                <div>
                  <div className="text-sm font-bold leading-snug">
                    {isOther ? "Lĩnh vực / Sản phẩm khác" : cat}
                  </div>
                  {isOther && (
                    <div
                      className={`text-[11px] mt-0.5 ${
                        active ? "text-slate-300" : "text-stone-500"
                      }`}
                    >
                      Tự nhập nhu cầu riêng
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedCat === OTHER_CATEGORY_KEY && (
          <div className="pt-1">
            <label className="block text-xs font-bold text-[#b45309] mb-1.5">
              Lĩnh vực hoặc sản phẩm bạn cần thiết kế (*)
            </label>
            <input
              type="text"
              required
              value={customCat}
              onChange={(e) => onCustomCatChange(e.target.value)}
              placeholder="Nhập tên lĩnh vực hoặc sản phẩm..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#faf8f5] border-2 border-[#1e293b] text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        )}

        <div className="pt-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Ghi chú yêu cầu thiết kế (không bắt buộc)
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Nhập nội dung cần trao đổi thêm..."
            className="w-full px-4 py-3 rounded-2xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1e293b]"
          />
        </div>
      </div>
    </div>
  );
}
