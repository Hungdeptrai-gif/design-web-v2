"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ThanhPhanTrangProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function ThanhPhanTrang({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: ThanhPhanTrangProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e5e0d5]">
      <div className="text-xs sm:text-sm text-stone-500">
        Đang hiển thị{" "}
        <strong className="text-slate-800">
          {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </strong>{" "}
        trên tổng số <strong className="text-slate-800">{totalItems}</strong> dự án
      </div>

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-full bg-white border border-[#dfd9cd] text-slate-700 disabled:opacity-40 hover:bg-stone-100 transition cursor-pointer disabled:cursor-not-allowed"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-full text-xs font-mono font-bold border transition cursor-pointer ${
              currentPage === p
                ? "bg-[#1e293b] text-white border-[#1e293b] shadow-sm"
                : "bg-white text-slate-700 border-[#dfd9cd] hover:border-slate-400"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-full bg-white border border-[#dfd9cd] text-slate-700 disabled:opacity-40 hover:bg-stone-100 transition cursor-pointer disabled:cursor-not-allowed"
          aria-label="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
