"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Maximize2,
  CheckCircle2,
  Building2,
  ArrowRight,
  FileCode2,
  FileText,
  Eye,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { CadSheetItem, ProjectItem } from "@/kieu-du-lieu";
import TrinhXemBanVeCAD from "@/giao-dien/du-an/TrinhXemBanVeCAD";

interface ChiTietDuAnModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onRequestSimilar: (project: ProjectItem) => void;
}

export default function ChiTietDuAnModal({
  project,
  onClose,
  onRequestSimilar,
}: ChiTietDuAnModalProps) {
  const [activeSheetIdx, setActiveSheetIdx] = useState<number>(0);
  const [openCadViewer, setOpenCadViewer] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    setActiveSheetIdx(0);
    setOpenCadViewer(false);
    setCopiedLink(false);
  }, [project?.id]);

  const allSheets: CadSheetItem[] = useMemo(() => {
    if (!project) return [];
    const mainRender: CadSheetItem = {
      id: `${project.id}-3d`,
      title: "Phối cảnh 3D hoàn thiện",
      url: project.image,
    };
    return [mainRender, ...(project.cadSheets || [])];
  }, [project]);

  if (!project) return null;

  const activeSheet = allSheets[activeSheetIdx] || allSheets[0];
  const hasCadDrawings = (project.cadSheets && project.cadSheets.length > 0) || Boolean(project.pdfUrl);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-5xl bg-[#faf8f5] border border-[#dfd9cd] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e5e0d5]">
            <div className="flex flex-wrap items-center gap-2">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                >
                  {cat}
                </span>
              ))}
              <span className="text-xs font-mono text-stone-500 ml-1">NĂM {project.year}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/du-an/${project.id}`
                    );
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2200);
                  } catch {}
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                  copiedLink
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-[#faf8f5] hover:bg-stone-200 text-slate-800 border-[#dfd9cd]"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Đã chép link
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#b45309]" /> Copy link gửi Zalo
                  </>
                )}
              </button>

              <Link
                href={`/du-an/${project.id}`}
                onClick={onClose}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-[#faf8f5] hover:bg-stone-200 border border-[#dfd9cd] text-xs font-semibold text-slate-800 items-center gap-1 transition"
              >
                <span>Trang riêng</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#b45309]" />
              </Link>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-stone-500 hover:text-slate-900 hover:bg-stone-100 transition cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-7">
            {/* Sheet Selector Tabs + Fullscreen CAD Inspector Trigger */}
            <div className="space-y-3">
              {allSheets.length > 1 || project.pdfUrl ? (
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {allSheets.map((sh, idx) => {
                      const active = activeSheetIdx === idx;
                      const is3d = idx === 0;
                      return (
                        <button
                          type="button"
                          key={sh.id}
                          onClick={() => setActiveSheetIdx(idx)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                            active
                              ? "bg-[#1e293b] text-white border-[#1e293b] shadow-sm"
                              : "bg-white text-slate-700 border-[#dfd9cd] hover:border-slate-400"
                          }`}
                        >
                          {is3d ? (
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <FileCode2 className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span>{sh.title}</span>
                        </button>
                      );
                    })}

                    {project.pdfUrl && (
                      <a
                        href={project.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Mở hồ sơ PDF đầy đủ</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenCadViewer(true)}
                    className="px-4 py-2 rounded-xl bg-[#b45309] hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Soi bản vẽ toàn màn hình (Zoom 500%)</span>
                  </button>
                </div>
              ) : null}

              {/* Main Preview Stage */}
              <div
                onClick={() => setOpenCadViewer(true)}
                className="relative rounded-2xl overflow-hidden border border-[#dfd9cd] bg-white group shadow-sm cursor-zoom-in"
              >
                <div className="max-h-[480px] min-h-[280px] flex items-center justify-center bg-[#f5f2eb] overflow-hidden">
                  <img
                    src={activeSheet?.url || project.image}
                    alt={activeSheet?.title || project.title}
                    className="w-full max-h-[480px] object-contain transition duration-300 group-hover:scale-[1.01]"
                  />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCadViewer(true);
                  }}
                  className="absolute bottom-4 right-4 px-4 py-2.5 rounded-xl bg-[#1e293b]/95 hover:bg-[#b45309] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-amber-300" />
                  <span>
                    {hasCadDrawings
                      ? "Bấm để mở bàn vẽ CAD (Phóng to & Kéo thả)"
                      : "Phóng to toàn màn hình"}
                  </span>
                </button>
              </div>
            </div>

            {/* Project Title & Summary */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {project.title}
              </h3>
              <p className="text-stone-600 mt-3 text-base leading-relaxed">{project.summary}</p>

              <div className="mt-5 p-4 rounded-xl bg-white border border-[#e5e0d5] inline-flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                  <Building2 className="w-4 h-4 text-slate-700" /> ĐỐI TƯỢNG KHÁCH HÀNG:
                </div>
                <div className="text-sm font-semibold text-slate-900">{project.clientType}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-white border border-[#e5e0d5]">
                <h4 className="text-sm uppercase tracking-wider text-amber-800 font-bold mb-2">
                  Bài toán &amp; Yêu cầu thực tế
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">{project.challenge}</p>
              </div>
              <div className="p-5 rounded-xl bg-white border border-slate-300">
                <h4 className="text-sm uppercase tracking-wider text-slate-800 font-bold mb-2">
                  Giải pháp Kỹ thuật của Studio
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">{project.solution}</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e5e0d5]">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Bộ hồ sơ kỹ thuật bàn giao đầy đủ cho khách hàng:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 bg-white border-t border-[#e5e0d5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-stone-600">
              Bạn đang cần triển khai bản vẽ hoặc thiết kế hạng mục tương tự dự án này?
            </p>
            <button
              onClick={() => onRequestSimilar(project)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Đặt thiết kế hạng mục tương tự <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AutoCAD-style Fullscreen Pan & Zoom Blueprint Inspector */}
      {openCadViewer && (
        <TrinhXemBanVeCAD
          projectTitle={project.title}
          sheets={allSheets}
          initialIndex={activeSheetIdx}
          pdfUrl={project.pdfUrl}
          pdfName={project.pdfName}
          onClose={() => setOpenCadViewer(false)}
        />
      )}
    </>
  );
}
