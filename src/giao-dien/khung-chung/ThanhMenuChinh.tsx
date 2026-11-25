"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

const NAV_LINKS = [
  { href: "#linh-vuc", label: "Lĩnh vực" },
  { href: "#du-an", label: "Dự án tiêu biểu" },
  { href: "#cad-compare", label: "Bản vẽ ↔ 3D" },
  { href: "#doi-ngu", label: "Đội ngũ & Quy trình" },
  { href: "#lien-he", label: "Liên hệ" },
];

export default function ThanhMenuChinh() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-xl border-b border-[#e6e1d6]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <img
            src={SITE_CONFIG.logoPath}
            alt={`${SITE_CONFIG.name} Logo`}
            className="h-11 w-auto object-contain shrink-0 group-hover:scale-[1.03] transition"
          />
        </a>

        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/95 border border-[#e3ded3] shadow-[0_2px_12px_rgba(28,25,23,0.04)]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-[13.5px] font-medium text-stone-600 hover:text-slate-950 hover:bg-[#f4f0e8] transition whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link
            href="/bao-gia"
            className="px-5 py-2.5 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-semibold text-[13.5px] whitespace-nowrap shadow-md shadow-slate-900/10 transition flex items-center gap-1.5"
          >
            <span>Đăng ký / Báo giá</span>
            <ArrowUpRight className="w-4 h-4 text-amber-300 shrink-0" />
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-full bg-white border border-[#dfd9cd] text-slate-800 shrink-0"
          aria-label="Mở menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e5e0d5] px-4 py-4 space-y-2.5 text-sm shadow-lg">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-stone-50 text-slate-800 font-medium"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <Link
              href="/bao-gia"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#1e293b] text-white font-bold text-center text-xs flex items-center justify-center"
            >
              Đăng ký báo giá
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
