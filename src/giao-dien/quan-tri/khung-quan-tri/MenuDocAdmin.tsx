"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FilePlus2,
  Tags,
  Columns2,
  Inbox,
  BarChart3,
  Bot,
} from "lucide-react";

interface MenuDocAdminProps {
  counts: {
    projects: number;
    categories: number;
    comparisons: number;
    quotesTotal: number;
    quotesPending: number;
  };
}

export default function MenuDocAdmin({ counts }: MenuDocAdminProps) {
  const pathname = usePathname();

  const navItems: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    highlightBadge?: boolean;
  }[] = [
    {
      href: "/admin",
      label: "Tổng Quan Hệ Thống",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/kho-du-an",
      label: "Kho Dự Án & Ghim",
      icon: FolderKanban,
      badge: counts.projects,
    },
    {
      href: "/admin/dang-du-an",
      label: "Đăng Dự Án & CAD",
      icon: FilePlus2,
    },
    {
      href: "/admin/danh-muc",
      label: "Danh Mục Lĩnh Vực",
      icon: Tags,
      badge: counts.categories,
    },
    {
      href: "/admin/doi-chieu-cad",
      label: "Đối Chiếu CAD ↔ 3D",
      icon: Columns2,
      badge: counts.comparisons,
    },
    {
      href: "/admin/phieu-bao-gia",
      label: "Phiếu Báo Giá Khách",
      icon: Inbox,
      badge: counts.quotesPending > 0 ? `${counts.quotesPending} mới` : counts.quotesTotal,
      highlightBadge: counts.quotesPending > 0,
    },
    {
      href: "/admin/bot-zalo",
      label: "Kết Nối Bot Zalo",
      icon: Bot,
    },
    {
      href: "/admin/so-lieu",
      label: "Số Liệu Xác Thực",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="lg:w-68 shrink-0">
      <nav className="p-3 rounded-3xl bg-white border border-[#dfd9cd] shadow-2xs flex lg:flex-col gap-1.5 overflow-x-auto lg:sticky lg:top-24">
        <div className="hidden lg:block px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold">
          Phân Hệ Quản Trị Độc Lập
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-2.5 transition whitespace-nowrap ${
                active
                  ? "bg-[#1e293b] text-white shadow-sm"
                  : "text-slate-700 hover:bg-[#faf8f5]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 shrink-0 ${active ? "text-amber-300" : "text-[#b45309]"}`}
                />
                <span>{item.label}</span>
              </span>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    item.highlightBadge
                      ? "bg-[#b45309] text-white"
                      : active
                      ? "bg-slate-700 text-slate-200"
                      : "bg-[#f3efe8] text-stone-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
