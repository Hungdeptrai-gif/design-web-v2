"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  FileText,
  ExternalLink,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CadSheetItem } from "@/kieu-du-lieu";

interface TrinhXemBanVeCADProps {
  projectTitle: string;
  sheets: CadSheetItem[];
  initialIndex?: number;
  pdfUrl?: string;
  pdfName?: string;
  onClose: () => void;
}

export default function TrinhXemBanVeCAD({
  projectTitle,
  sheets,
  initialIndex = 0,
  pdfUrl,
  pdfName,
  onClose,
}: TrinhXemBanVeCADProps) {
  const [activeIdx, setActiveIdx] = useState<number>(initialIndex);
  const [viewMode, setViewMode] = useState<"sheet" | "pdf">("sheet");
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [darkCanvas, setDarkCanvas] = useState<boolean>(true);
  const [dragging, setDragging] = useState<boolean>(false);

  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  const currentSheet = sheets[activeIdx] || sheets[0];

  const resetTransform = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetTransform();
  }, [activeIdx, viewMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (viewMode === "sheet" && sheets.length > 1) {
        if (e.key === "ArrowRight") {
          setActiveIdx((prev) => (prev + 1) % sheets.length);
        } else if (e.key === "ArrowLeft") {
          setActiveIdx((prev) => (prev - 1 + sheets.length) % sheets.length);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, sheets.length, viewMode]);

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode === "pdf") return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoom((prev) => Math.min(5, Math.max(0.6, Number((prev + delta).toFixed(2)))));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode === "pdf") return;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || viewMode === "pdf") return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: dragStart.current.panX + dx,
      y: dragStart.current.panY + dy,
    });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#0f172a] text-white select-none">
      {/* Top CAD Toolbar */}
      <div className="px-4 sm:px-6 py-3 bg-[#1e293b] border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300">
            <span>TRÌNH SOI BẢN VẼ KỸ THUẬT (CAD INSPECTOR)</span>
            {viewMode === "sheet" && sheets.length > 0 && (
              <span>
                • TỜ {activeIdx + 1}/{sheets.length}
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white truncate">{projectTitle}</h3>
        </div>

        {/* Zoom & Canvas Controls */}
        {viewMode === "sheet" && (
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.35).toFixed(2))))}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 transition cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {[1, 2, 4].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setZoom(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  Math.round(zoom * 10) === preset * 10
                    ? "bg-[#b45309] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {preset * 100}%
              </button>
            ))}

            <span className="px-2 text-xs font-mono text-amber-300 font-bold min-w-[54px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(5, Number((z + 0.35).toFixed(2))))}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 transition cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={resetTransform}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1 transition cursor-pointer"
              title="Đặt lại khung nhìn"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Đặt lại
            </button>

            <button
              type="button"
              onClick={() => setDarkCanvas(!darkCanvas)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 transition cursor-pointer"
              title="Đổi màu nền bàn vẽ"
            >
              {darkCanvas ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {currentSheet?.url && viewMode === "sheet" && (
            <a
              href={currentSheet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-100 items-center gap-1.5 transition"
            >
              <span>Mở file gốc</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            </a>
          )}
          {pdfUrl && viewMode === "pdf" && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#b45309] hover:bg-amber-600 text-xs font-bold text-white inline-flex items-center gap-1.5 transition"
            >
              <span>Tải / Mở PDF tab mới</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/30 text-rose-100 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <X className="w-4 h-4" /> Đóng (ESC)
          </button>
        </div>
      </div>

      {/* Main Interactive Viewport */}
      {viewMode === "pdf" && pdfUrl ? (
        <div className="flex-1 bg-slate-900">
          <iframe src={pdfUrl} title={pdfName || "Hồ sơ PDF"} className="w-full h-full border-0" />
        </div>
      ) : (
        <div
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`flex-1 relative overflow-hidden flex items-center justify-center touch-none ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          } ${darkCanvas ? "bg-[#0b1120]" : "bg-[#e8e3d9]"}`}
        >
          {currentSheet && (
            <div
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transformOrigin: "center center",
                transition: dragging ? "none" : "transform 0.12s ease-out",
              }}
              className="max-w-[92vw] max-h-[78vh] flex items-center justify-center shadow-2xl"
            >
              <img
                src={currentSheet.url}
                alt={currentSheet.title}
                draggable={false}
                className="max-w-[92vw] max-h-[78vh] w-auto h-auto object-contain bg-white rounded-sm"
              />
            </div>
          )}

          {/* Left/Right Quick Sheet Arrows */}
          {sheets.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev - 1 + sheets.length) % sheets.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-[#b45309] border border-slate-600 text-white shadow-lg transition cursor-pointer"
                title="Tờ trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev + 1) % sheets.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-[#b45309] border border-slate-600 text-white shadow-lg transition cursor-pointer"
                title="Tờ tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Floating Hint Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-2 pointer-events-none">
            <Move className="w-3.5 h-3.5 text-amber-300" />
            <span>Lăn chuột để phóng to tới 500% • Nhấn giữ chuột để kéo dịch chuyển bản vẽ</span>
          </div>
        </div>
      )}

      {/* Bottom Sheet Tabs Strip (Like AutoCAD Model / Layout1 / Layout2 Tabs) */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#1e293b] border-t border-slate-700 flex items-center gap-2 overflow-x-auto">
        {sheets.map((sheet, idx) => {
          const active = viewMode === "sheet" && activeIdx === idx;
          return (
            <button
              type="button"
              key={sheet.id}
              onClick={() => {
                setViewMode("sheet");
                setActiveIdx(idx);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                active
                  ? "bg-[#b45309] text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span className="font-mono text-[10px] opacity-80">#{idx + 1}</span>
              <span>{sheet.title}</span>
            </button>
          );
        })}

        {pdfUrl && (
          <button
            type="button"
            onClick={() => setViewMode("pdf")}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === "pdf"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/25"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Hồ sơ PDF đầy đủ {pdfName ? `(${pdfName})` : ""}</span>
          </button>
        )}
      </div>
    </div>
  );
}
