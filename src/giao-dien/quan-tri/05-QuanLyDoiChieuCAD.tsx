"use client";

import React, { useState } from "react";
import { Upload, Trash2, CheckCircle2, RotateCcw, Columns2, Loader2 } from "lucide-react";
import { INITIAL_COMPARISONS } from "@/du-lieu-mau";
import { uploadStudioFile } from "@/dich-vu-du-lieu/luu-tru";
import { ComparisonPair } from "@/kieu-du-lieu";

interface QuanLyDoiChieuCADProps {
  comparisons: ComparisonPair[];
  onUpdateComparisons: (next: ComparisonPair[]) => void;
}

export default function QuanLyDoiChieuCAD({
  comparisons,
  onUpdateComparisons,
}: QuanLyDoiChieuCADProps) {
  const [label, setLabel] = useState<string>("");
  const [dwgCode, setDwgCode] = useState<string>("");
  const [scale, setScale] = useState<string>("TỶ LỆ 1:20");
  const [specsText, setSpecsText] = useState<string>("");
  const [cadImage, setCadImage] = useState<string>("/cad-samples/ban-ve-thang-may-tong-the.svg");
  const [renderImage, setRenderImage] = useState<string>("/images/elevator-clean-3d.jpg");
  const [uploading, setUploading] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleUploadSide = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "cad" | "render"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadStudioFile(file);
      if (side === "cad") setCadImage(uploaded.url);
      else setRenderImage(uploaded.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCreatePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const dims = specsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newPair: ComparisonPair = {
      id: `cmp-${Date.now()}`,
      label: label.trim(),
      cadImage,
      renderImage,
      dwgCode: dwgCode.trim() || "DWG-TKKT-2026",
      scale: scale.trim() || "TỶ LỆ 1:20",
      dimensions: dims.length > 0 ? dims : ["Chuẩn kích thước thực tế", "Khớp mô hình 3D"],
    };

    onUpdateComparisons([newPair, ...comparisons]);
    setLabel("");
    setDwgCode("");
    setSpecsText("");
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handleDeletePair = (id: string) => {
    if (comparisons.length <= 1) return;
    onUpdateComparisons(comparisons.filter((c) => c.id !== id));
  };

  const handleRestoreDefaults = () => {
    onUpdateComparisons(INITIAL_COMPARISONS);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleCreatePair}
        className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-[#dfd9cd] shadow-sm space-y-5"
      >
        <div className="border-b border-[#ebe6dc] pb-4">
          <h1 className="text-xl font-extrabold text-slate-900">
            Module Đối Chiếu Bản Vẽ CAD 2D ↔ Phối Cảnh 3D
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tải lên ảnh tờ bản vẽ AutoCAD thật ở bên trái và ảnh Render 3D (hoặc ảnh chụp thi công) ở bên phải cho khung kéo so sánh ngoài Trang chủ.
          </p>
        </div>

        {savedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Đã thêm cặp đối chiếu CAD ↔ 3D lên Trang chủ!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tên nút hạng mục (*)
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Nhập tên hạng mục..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mã hiệu bản vẽ
            </label>
            <input
              type="text"
              value={dwgCode}
              onChange={(e) => setDwgCode(e.target.value)}
              placeholder="Nhập mã bản vẽ..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tỷ lệ bản vẽ
            </label>
            <input
              type="text"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              placeholder="Nhập tỷ lệ..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Thông số kỹ thuật hiển thị bên dưới (ngăn cách bằng dấu phẩy)
          </label>
          <input
            type="text"
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
            placeholder="Nhập các thông số kỹ thuật..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#dfd9cd] space-y-3">
            <div className="text-xs font-bold text-slate-900">
              Nửa trái: Ảnh Bản vẽ CAD 2D (.PNG, .JPG, .SVG)
            </div>
            <img
              src={cadImage}
              alt="CAD Preview"
              className="w-full h-36 object-contain rounded-xl border border-stone-300 bg-white"
            />
            <label className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 border border-[#dfd9cd] text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 cursor-pointer">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#b45309]" />
              ) : (
                <Upload className="w-4 h-4 text-[#b45309]" />
              )}
              <span>Tải ảnh bản vẽ CAD 2D</span>
              <input
                type="file"
                accept="image/*,.svg"
                onChange={(e) => handleUploadSide(e, "cad")}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#dfd9cd] space-y-3">
            <div className="text-xs font-bold text-slate-900">
              Nửa phải: Ảnh Phối cảnh 3D / Thực tế
            </div>
            <img
              src={renderImage}
              alt="3D Preview"
              className="w-full h-36 object-cover rounded-xl border border-stone-300 bg-stone-900"
            />
            <label className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 border border-[#dfd9cd] text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 cursor-pointer">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#b45309]" />
              ) : (
                <Upload className="w-4 h-4 text-[#b45309]" />
              )}
              <span>Tải ảnh phối cảnh 3D</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadSide(e, "render")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-4 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer shadow-md"
        >
          + THÊM VÀO KHUNG ĐỐI CHIẾU TRANG CHỦ
        </button>
      </form>

      <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#dfd9cd] space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Các Cặp Đang Hiển Thị ({comparisons.length})
            </h2>
            <p className="text-xs text-stone-500">
              Hiển thị trực tiếp tại mục Đối chiếu CAD ↔ 3D trên Trang chủ.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3 py-1.5 rounded-full bg-[#faf8f5] hover:bg-stone-200 border border-[#dfd9cd] text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" /> Mặc định
          </button>
        </div>

        <div className="space-y-3">
          {comparisons.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex -space-x-2 shrink-0">
                  <img
                    src={item.cadImage}
                    alt="CAD"
                    className="w-12 h-10 rounded-lg object-contain bg-white border border-stone-300"
                  />
                  <img
                    src={item.renderImage}
                    alt="3D"
                    className="w-12 h-10 rounded-lg object-cover border border-white shadow-xs"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <Columns2 className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="text-xs font-mono text-stone-500 truncate">
                    {item.dwgCode} • {item.scale}
                  </div>
                </div>
              </div>

              {comparisons.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeletePair(item.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 cursor-pointer shrink-0"
                  title="Xóa cặp này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
