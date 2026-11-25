"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

interface ThanhTieuDeAdminProps {
  syncing: boolean;
  onLogout: () => void;
}

export default function ThanhTieuDeAdmin({ syncing, onLogout }: ThanhTieuDeAdminProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#1e293b] text-white border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-1 rounded-md bg-[#b45309] text-white text-xs font-mono font-bold shrink-0">
            ADMIN CMS
          </span>
          <span className="font-bold text-sm sm:text-base tracking-tight truncate">
            Hệ Thống Quản Trị {SITE_CONFIG.name}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border ${
              syncing
                ? "bg-amber-500/20 border-amber-400/40 text-amber-200"
                : "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                syncing ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            {syncing ? "Đang đồng bộ..." : "Dữ liệu thực — Đã đồng bộ"}
          </span>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-100 flex items-center gap-1.5 transition"
          >
            <span className="hidden sm:inline">Xem trang khách</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-xs font-semibold text-rose-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
}
