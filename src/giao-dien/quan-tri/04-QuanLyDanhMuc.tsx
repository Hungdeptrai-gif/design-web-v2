"use client";

import React, { useState } from "react";
import { Plus, Trash2, Tags, FolderCheck } from "lucide-react";
import { ProjectItem } from "@/kieu-du-lieu";

interface QuanLyDanhMucProps {
  categories: string[];
  projects: ProjectItem[];
  onAddCategory: (name: string) => void;
  onRemoveCategory: (name: string) => void;
}

export default function QuanLyDanhMuc({
  categories,
  projects,
  onAddCategory,
  onRemoveCategory,
}: QuanLyDanhMucProps) {
  const [newCat, setNewCat] = useState<string>("");

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCat.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setNewCat("");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#dfd9cd] space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Module Quản Lý Danh Mục Lĩnh Vực ({categories.length} ngành)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Mỗi danh mục thêm hoặc xóa tại đây sẽ tự động cập nhật đồng bộ trên Trang chủ, bộ lọc Kho dự án (/du-an) và thẻ chọn ngành tại trang Đăng ký báo giá (/bao-gia).
          </p>
        </div>

        <form onSubmit={handleCatSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            required
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Nhập tên lĩnh vực thiết kế mới..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 focus:outline-none focus:border-[#1e293b]"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm lĩnh vực
          </button>
        </form>
      </div>

      {/* Independent Category Table with Live Project Counts */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#dfd9cd] space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Danh Sách Lĩnh Vực &amp; Số Dự Án Thực Tế Theo Ngành
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const countInCat = projects.filter((p) => p.categories.includes(cat)).length;
            return (
              <div
                key={cat}
                className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm truncate">
                    <Tags className="w-4 h-4 text-[#b45309] shrink-0" />
                    <span className="truncate">{cat}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500">
                    <FolderCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{countInCat} dự án đang thuộc ngành này</span>
                  </div>
                </div>

                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveCategory(cat)}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-[#dfd9cd] text-stone-400 hover:text-rose-600 transition cursor-pointer shrink-0"
                    title="Xóa danh mục này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
