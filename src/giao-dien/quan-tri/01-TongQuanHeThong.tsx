"use client";

import React from "react";
import Link from "next/link";
import {
  FolderKanban,
  FileCode2,
  Tags,
  Inbox,
  ArrowRight,
  FilePlus2,
  Columns2,
  BarChart3,
  Clock,
} from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { ProjectItem, QuoteLead } from "@/kieu-du-lieu";

interface TongQuanHeThongProps {
  projects: ProjectItem[];
  categoriesCount: number;
  comparisonsCount: number;
  quotes: QuoteLead[];
}

export default function TongQuanHeThong({
  projects,
  categoriesCount,
  comparisonsCount,
  quotes,
}: TongQuanHeThongProps) {
  const maxPinned = SITE_CONFIG.stats.maxPinnedOnHome;
  const pinnedProjects = projects.filter((p) => p.featured);
  const totalCadSheets = projects.reduce((sum, p) => sum + (p.cadSheets?.length || 0), 0);
  const totalPdfs = projects.filter((p) => Boolean(p.pdfUrl)).length;
  const pendingQuotes = quotes.filter((q) => q.status !== "contacted");

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#dfd9cd] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Tổng Quan Vận Hành Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Toàn bộ con số dưới đây được kiểm đếm trực tiếp theo thời gian thực từ máy chủ dữ liệu Studio.
          </p>
        </div>

        <Link
          href="/admin/dang-du-an"
          className="px-5 py-3 rounded-full bg-[#b45309] hover:bg-amber-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" /> + Đăng dự án mới
        </Link>
      </div>

      {/* 4 Real Audited Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link
          href="/admin/kho-du-an"
          className="p-5 rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#1e293b] text-left transition space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 uppercase">Kho dự án thực tế</span>
            <FolderKanban className="w-5 h-5 text-[#1e293b]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {projects.length} bài
          </div>
          <div className="text-xs text-stone-600 flex items-center justify-between pt-2 border-t border-[#efeae0]">
            <span>
              Đang ghim: {pinnedProjects.length}/{maxPinned}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b45309]" />
          </div>
        </Link>

        <Link
          href="/admin/doi-chieu-cad"
          className="p-5 rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#1e293b] text-left transition space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 uppercase">Hồ sơ bản vẽ CAD</span>
            <FileCode2 className="w-5 h-5 text-[#b45309]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {totalCadSheets} tờ
          </div>
          <div className="text-xs text-stone-600 flex items-center justify-between pt-2 border-t border-[#efeae0]">
            <span>
              {totalPdfs} file PDF • {comparisonsCount} bộ đối chiếu
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b45309]" />
          </div>
        </Link>

        <Link
          href="/admin/danh-muc"
          className="p-5 rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#1e293b] text-left transition space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 uppercase">Danh mục lĩnh vực</span>
            <Tags className="w-5 h-5 text-slate-700" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {categoriesCount} ngành
          </div>
          <div className="text-xs text-stone-600 flex items-center justify-between pt-2 border-t border-[#efeae0]">
            <span>Quản lý bộ lọc ngành nghề</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b45309]" />
          </div>
        </Link>

        <Link
          href="/admin/phieu-bao-gia"
          className="p-5 rounded-3xl bg-white border border-[#dfd9cd] hover:border-[#1e293b] text-left transition space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 uppercase">Phiếu báo giá thực</span>
            <Inbox className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#b45309]">
            {quotes.length} phiếu
          </div>
          <div className="text-xs text-stone-600 flex items-center justify-between pt-2 border-t border-[#efeae0]">
            <span>Chờ xử lý: {pendingQuotes.length} phiếu</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b45309]" />
          </div>
        </Link>
      </div>

      {/* Two Summary Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#dfd9cd] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              4 Vị Trí Đang Ghim Ngoài Trang Chủ
            </h2>
            <Link
              href="/admin/kho-du-an"
              className="text-xs font-semibold text-[#b45309] hover:underline"
            >
              Đổi bài ghim →
            </Link>
          </div>

          <div className="space-y-2.5">
            {pinnedProjects.slice(0, maxPinned).map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-[#1e293b] text-amber-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-12 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    {p.categories.join(" • ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#dfd9cd] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Phiếu Báo Giá Chờ Liên Hệ ({pendingQuotes.length})
              </h2>
              <Link
                href="/admin/phieu-bao-gia"
                className="text-xs font-semibold text-[#b45309] hover:underline"
              >
                Mở module báo giá →
              </Link>
            </div>

            {pendingQuotes.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] text-center space-y-1">
                <div className="text-sm font-semibold text-slate-800">
                  Không có phiếu tồn đọng chờ liên hệ
                </div>
                <p className="text-xs text-stone-500">
                  Mọi phiếu khách hàng thực tế đăng ký từ /bao-gia sẽ báo trực tiếp tại đây.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingQuotes.slice(0, 3).map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-[#faf8f5] border border-amber-200 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{q.name}</div>
                      <div className="text-xs text-stone-600 font-mono">
                        {q.phone} • {q.category}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b45309] shrink-0">
                      <Clock className="w-3.5 h-3.5" /> Mới
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#ebe6dc] grid grid-cols-2 gap-2.5">
            <Link
              href="/admin/doi-chieu-cad"
              className="p-3 rounded-2xl bg-[#faf8f5] hover:bg-[#f3efe8] border border-[#e5e0d5] text-xs font-semibold text-slate-800 flex items-center gap-2"
            >
              <Columns2 className="w-4 h-4 text-[#b45309]" /> Quản lý Đối chiếu CAD
            </Link>
            <Link
              href="/admin/so-lieu"
              className="p-3 rounded-2xl bg-[#faf8f5] hover:bg-[#f3efe8] border border-[#e5e0d5] text-xs font-semibold text-slate-800 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-[#1e293b]" /> Cấu hình Số liệu thực
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
