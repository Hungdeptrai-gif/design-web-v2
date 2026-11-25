"use client";

import React, { useState } from "react";
import {
  Search,
  Star,
  Pencil,
  Trash2,
  FileCode2,
  FileText,
  FilePlus2,
  Copy,
  Check,
} from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { ProjectItem } from "@/kieu-du-lieu";

interface QuanLyKhoDuAnProps {
  categories: string[];
  projects: ProjectItem[];
  pinnedCount: number;
  pinNotice: string;
  onTogglePin: (id: string) => void;
  onSelectEdit: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onCreateNewClick: () => void;
}

export default function QuanLyKhoDuAn({
  categories,
  projects,
  pinnedCount,
  pinNotice,
  onTogglePin,
  onSelectEdit,
  onDeleteProject,
  onCreateNewClick,
}: QuanLyKhoDuAnProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCat, setFilterCat] = useState<string>("Tất cả");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const maxPinned = SITE_CONFIG.stats.maxPinnedOnHome;

  const filtered = projects.filter((p) => {
    const matchCat = filterCat === "Tất cả" || p.categories.includes(filterCat);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchCat;
    return (
      matchCat &&
      (p.title.toLowerCase().includes(q) || p.clientType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5">
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#dfd9cd] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900">
              Module Quản Lý Kho Dự Án &amp; Vị Trí Ghim ({projects.length})
            </h1>
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-[#b45309]">
              Đang ghim Trang chủ: {pinnedCount}/{maxPinned}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Bấm nút <strong>Ghim</strong> để đưa dự án lên vị trí số 1 ngoài Trang chủ, hoặc bấm <strong>Sửa / Bản vẽ</strong> để bổ sung tờ bản vẽ CAD &amp; PDF.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNewClick}
          className="px-5 py-3 rounded-full bg-[#b45309] hover:bg-amber-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" /> + Đăng dự án mới
        </button>
      </div>

      {pinNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 font-semibold">
          {pinNotice}
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="p-5 rounded-3xl bg-white border border-[#dfd9cd] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên dự án, khách hàng..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 focus:outline-none focus:border-[#1e293b]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["Tất cả", ...categories].map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  filterCat === cat
                    ? "bg-[#1e293b] text-white"
                    : "bg-[#faf8f5] text-stone-700 border border-[#dfd9cd] hover:border-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Rows */}
        <div className="space-y-3 pt-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">
              Không có dự án nào khớp điều kiện lọc hiện tại.
            </div>
          ) : (
            filtered.map((p) => {
              const cadCount = p.cadSheets?.length || 0;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    p.featured
                      ? "bg-amber-50/40 border-amber-300"
                      : "bg-[#faf8f5] border-[#e5e0d5]"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-20 h-14 rounded-xl object-cover shrink-0 border border-stone-300 bg-white"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {p.featured && (
                          <span className="px-2 py-0.5 rounded-md bg-[#1e293b] text-amber-300 text-[10px] font-mono font-bold">
                            TRANG CHỦ
                          </span>
                        )}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {p.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span>{p.categories.join(" • ")}</span>
                        <span>|</span>
                        <span>{p.clientType}</span>
                        {cadCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#dfd9cd] text-[11px] font-mono font-semibold text-[#b45309]">
                            <FileCode2 className="w-3 h-3" /> {cadCount} tờ CAD
                          </span>
                        )}
                        {p.pdfUrl && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-semibold text-emerald-800">
                            <FileText className="w-3 h-3" /> Có PDF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            `${window.location.origin}/du-an/${p.id}`
                          );
                          setCopiedId(p.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        } catch {}
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                        copiedId === p.id
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-white hover:bg-stone-100 text-slate-700 border-[#dfd9cd]"
                      }`}
                      title="Sao chép đường dẫn riêng để gửi Zalo cho khách"
                    >
                      {copiedId === p.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Đã chép
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#b45309]" /> Copy link
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onTogglePin(p.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                        p.featured
                          ? "bg-[#1e293b] text-amber-300 border-[#1e293b]"
                          : "bg-white text-slate-700 border-[#dfd9cd] hover:border-slate-500"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${p.featured ? "fill-amber-300" : ""}`} />
                      <span>{p.featured ? "Đang ghim" : "Ghim Trang chủ"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectEdit(p)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 border border-[#dfd9cd] text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>Sửa / Bản vẽ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteProject(p.id)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-[#dfd9cd] text-stone-400 hover:text-rose-600 transition cursor-pointer"
                      title="Xóa dự án"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
