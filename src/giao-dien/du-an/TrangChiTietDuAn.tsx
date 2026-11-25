"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  FileCode2,
  FileText,
  Maximize2,
} from "lucide-react";
import { CadSheetItem, ProjectItem } from "@/kieu-du-lieu";
import ThanhMenuTrangCon from "@/giao-dien/khung-chung/ThanhMenuTrangCon";
import ChanTrangLienHe from "@/giao-dien/khung-chung/ChanTrangLienHe";
import NutLienHeNoi from "@/giao-dien/khung-chung/NutLienHeNoi";
import TrinhXemBanVeCAD from "@/giao-dien/du-an/TrinhXemBanVeCAD";

interface TrangChiTietDuAnProps {
  project: ProjectItem;
}

export default function TrangChiTietDuAn({ project }: TrangChiTietDuAnProps) {
  const router = useRouter();
  const [activeSheetIdx, setActiveSheetIdx] = useState<number>(0);
  const [openCadViewer, setOpenCadViewer] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const allSheets: CadSheetItem[] = useMemo(() => {
    const mainRender: CadSheetItem = {
      id: `${project.id}-3d`,
      title: "Phối cảnh 3D hoàn thiện",
      url: project.image,
    };
    return [mainRender, ...(project.cadSheets || [])];
  }, [project]);

  const activeSheet = allSheets[activeSheetIdx] || allSheets[0];

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/du-an/${project.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Bỏ qua nếu trình duyệt chặn clipboard
    }
  };

  const handleRequestSimilar = () => {
    const catParam = encodeURIComponent(project.categories[0] || "Thang máy");
    const projParam = encodeURIComponent(project.title);
    router.push(`/bao-gia?category=${catParam}&project=${projParam}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col">
      <ThanhMenuTrangCon badgeText="HỒ SƠ CHI TIẾT DỰ ÁN & BẢN VẼ" rightMode="quote-cta" />

      <main className="flex-1 py-8 sm:py-12 relative">
        <div className="absolute inset-x-0 top-0 h-72 bg-cad-grid mask-grid-fade pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8">
          {/* Top Breadcrumb & Share Link Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/du-an"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại Kho dự án
            </Link>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                copied
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white hover:bg-stone-100 text-slate-800 border-[#dfd9cd]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Đã sao chép link gửi Zalo!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#b45309]" /> Sao chép link dự án này
                </>
              )}
            </button>
          </div>

          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#b45309] border border-amber-200"
                >
                  {cat}
                </span>
              ))}
              <span className="text-xs font-mono text-stone-500 ml-1">NĂM {project.year}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {project.title}
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              {project.summary}
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#e5e0d5] text-xs sm:text-sm">
                <Building2 className="w-4 h-4 text-[#1e293b]" />
                <span className="text-stone-500">Đối tượng khách hàng:</span>
                <strong className="text-slate-900">{project.clientType}</strong>
              </div>
            </div>
          </div>

          {/* Interactive Blueprint & 3D Gallery Stage */}
          <div className="rounded-3xl bg-white border border-[#dfd9cd] p-4 sm:p-6 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
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
                          : "bg-[#faf8f5] text-slate-700 border-[#dfd9cd] hover:border-slate-400"
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
                <span>Soi toàn màn hình (Zoom 500%)</span>
              </button>
            </div>

            <div
              onClick={() => setOpenCadViewer(true)}
              className="relative rounded-2xl overflow-hidden border border-[#e5e0d5] bg-[#f5f2eb] min-h-[320px] max-h-[560px] flex items-center justify-center cursor-zoom-in group"
            >
              <img
                src={activeSheet?.url || project.image}
                alt={activeSheet?.title || project.title}
                className="w-full max-h-[560px] object-contain transition duration-300 group-hover:scale-[1.01]"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCadViewer(true);
                }}
                className="absolute bottom-4 right-4 px-4 py-2.5 rounded-xl bg-[#1e293b]/95 hover:bg-[#b45309] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-amber-300" />
                <span>Mở bàn vẽ phóng to &amp; kéo thả</span>
              </button>
            </div>
          </div>

          {/* Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#dfd9cd] space-y-2">
              <h2 className="text-sm uppercase tracking-wider text-[#b45309] font-bold">
                Bài toán &amp; Yêu cầu thực tế
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-300 space-y-2">
              <h2 className="text-sm uppercase tracking-wider text-slate-900 font-bold">
                Giải pháp Kỹ thuật của Studio
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Deliverables & Quote CTA */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#dfd9cd] space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
                Bộ hồ sơ kỹ thuật bàn giao tiêu chuẩn cho hạng mục này:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-[#ebe6dc] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-stone-600">
                Cần triển khai bản vẽ kỹ thuật hoặc thiết kế 3D hạng mục tương tự dự án này?
              </p>
              <button
                type="button"
                onClick={handleRequestSimilar}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <span>Nhận báo giá hạng mục tương tự</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <ChanTrangLienHe />
      <NutLienHeNoi />

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
    </div>
  );
}
