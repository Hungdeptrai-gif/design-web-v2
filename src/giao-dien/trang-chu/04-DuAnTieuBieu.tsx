"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { ProjectItem } from "@/kieu-du-lieu";
import TheDuAn from "@/giao-dien/du-an/TheDuAn";

interface DuAnTieuBieuProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

export default function DuAnTieuBieu({
  projects,
  onSelectProject,
}: DuAnTieuBieuProps) {
  const pinnedList = projects.filter((p) => p.featured);
  const featuredProjects = (pinnedList.length > 0 ? pinnedList : projects).slice(
    0,
    SITE_CONFIG.stats.maxPinnedOnHome
  );

  return (
    <section id="du-an" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Dự Án Tiêu Biểu</h2>
            <p className="text-stone-600 mt-1.5 text-sm sm:text-base">
              Các công trình &amp; hồ sơ thiết kế nổi bật được chọn lọc từ kho {projects.length} dự án của Studio.
            </p>
          </div>

          <Link
            href="/du-an"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b45309] hover:text-slate-900 underline-offset-4 hover:underline transition whitespace-nowrap self-start sm:self-auto"
          >
            <span>Xem thêm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {featuredProjects.map((proj) => (
              <TheDuAn key={proj.id} project={proj} onSelect={onSelectProject} />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/du-an"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-[#b45309] underline-offset-4 hover:underline transition"
          >
            <span>Xem thêm toàn bộ {projects.length} dự án đã thực hiện</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
