"use client";

import React from "react";
import { Search } from "lucide-react";

interface BoLocVaTimKiemDuAnProps {
  totalCount: number;
  categories: string[];
  activeCat: string;
  searchQuery: string;
  onSelectCat: (cat: string) => void;
  onSearchChange: (q: string) => void;
}

export default function BoLocVaTimKiemDuAn({
  totalCount,
  categories,
  activeCat,
  searchQuery,
  onSelectCat,
  onSearchChange,
}: BoLocVaTimKiemDuAnProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kho Dự Án Thiết Kế &amp; Triển Khai
          </h1>
          <p className="text-stone-600 mt-2 text-sm sm:text-base">
            Tổng hợp {totalCount} hồ sơ dự án thực tế trên các lĩnh vực Thang máy, Đường ống công nghiệp, Thiết bị cơ khí và Kiến trúc 3D.
          </p>
        </div>

        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm tên dự án, hạng mục..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-[#dfd9cd] text-sm text-slate-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#1e293b]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["Tất cả", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCat(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeCat === cat
                ? "bg-[#1e293b] text-white font-semibold shadow-sm"
                : "bg-white text-stone-700 border border-[#dfd9cd] hover:border-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
