"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, PhoneCall } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

interface ThanhMenuTrangConProps {
  badgeText?: string;
  rightMode?: "quote-cta" | "hotline";
}

export default function ThanhMenuTrangCon({
  badgeText,
  rightMode = "quote-cta",
}: ThanhMenuTrangConProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/92 backdrop-blur-xl border-b border-[#e6e1d6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-stone-100 border border-[#dfd9cd] text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs transition whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 text-[#b45309]" />
            <span>Trang chủ</span>
          </Link>
          <Link href="/" className="hidden sm:flex items-center gap-3 pl-4 border-l border-[#dcd6c8]">
            <img
              src={SITE_CONFIG.logoPath}
              alt={SITE_CONFIG.name}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {badgeText && (
            <span className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3efe8] border border-[#e2dcd0] text-xs font-mono font-semibold text-stone-700">
              {badgeText}
            </span>
          )}

          {rightMode === "hotline" ? (
            <a
              href={SITE_CONFIG.contact.phoneHref}
              className="px-4 py-2.5 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap shadow-sm transition"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>{SITE_CONFIG.contact.phoneDisplay}</span>
            </a>
          ) : (
            <Link
              href="/bao-gia"
              className="px-5 py-2.5 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-semibold text-xs sm:text-[13.5px] whitespace-nowrap shadow-md transition flex items-center gap-1.5"
            >
              <span>Đăng ký / Báo giá</span>
              <ArrowUpRight className="w-4 h-4 text-amber-300 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
