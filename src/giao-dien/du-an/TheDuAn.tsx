"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Star, FileCode2 } from "lucide-react";
import { ProjectItem } from "@/kieu-du-lieu";

interface TheDuAnProps {
  project: ProjectItem;
  compact?: boolean;
  showFeaturedBadge?: boolean;
  onSelect: (project: ProjectItem) => void;
}

export default function TheDuAn({
  project,
  compact = false,
  showFeaturedBadge = false,
  onSelect,
}: TheDuAnProps) {
  const cadCount = project.cadSheets?.length || 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      onClick={() => onSelect(project)}
      className="group rounded-3xl overflow-hidden bg-white border border-[#e2ddd2] hover:border-[#1e293b]/50 transition cursor-pointer flex flex-col shadow-sm hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          {showFeaturedBadge && project.featured && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#1e293b]/90 text-amber-300 text-[11px] font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300" /> Tiêu biểu
            </span>
          )}
          {project.categories.slice(0, compact ? 2 : 3).map((c) => (
            <span
              key={c}
              className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-[11px] sm:text-xs font-semibold text-slate-900 shadow-2xs"
            >
              {c}
            </span>
          ))}
        </div>

        {(cadCount > 0 || project.pdfUrl) && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#1e293b]/90 backdrop-blur-md text-white text-[11px] font-mono font-semibold flex items-center gap-1.5 shadow-sm">
            <FileCode2 className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {cadCount > 0 ? `${cadCount} tờ bản vẽ CAD` : "Kèm hồ sơ PDF"}
            </span>
          </div>
        )}

        {!compact && (
          <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-full bg-[#b45309] text-white font-semibold text-xs opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shadow-md">
            Soi bản vẽ &amp; 3D <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className={`${compact ? "p-5" : "p-6"} flex-1 flex flex-col justify-between`}>
        <div>
          <div className="text-[11px] sm:text-xs font-mono text-stone-500 mb-1.5 truncate">
            {project.clientType}
          </div>
          <h3
            className={`${
              compact ? "text-base sm:text-lg line-clamp-2" : "text-xl"
            } font-bold text-slate-900 group-hover:text-[#b45309] transition leading-snug`}
          >
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2">{project.summary}</p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#ebe6dc] flex items-center justify-between text-xs font-mono text-stone-500">
          <span>Năm {project.year}</span>
          <span className="text-slate-900 font-semibold group-hover:text-[#b45309]">
            {compact ? "Xem bản vẽ →" : "Xem chi tiết & bản vẽ →"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
