"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  MoveHorizontal,
  CheckCircle2,
  FileCode2,
  Eye,
  Columns2,
  Maximize2,
} from "lucide-react";
import { INITIAL_COMPARISONS } from "@/du-lieu-mau";
import { ComparisonPair } from "@/kieu-du-lieu";
import TrinhXemBanVeCAD from "@/giao-dien/du-an/TrinhXemBanVeCAD";

interface SoSanhBanVe3DProps {
  comparisons?: ComparisonPair[];
}

export default function SoSanhBanVe3D({ comparisons }: SoSanhBanVe3DProps) {
  const items = comparisons && comparisons.length > 0 ? comparisons : INITIAL_COMPARISONS;
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(52);
  const [hasAnimatedIntro, setHasAnimatedIntro] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const safeIdx = activeIdx < items.length ? activeIdx : 0;
  const current = items[safeIdx];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasAnimatedIntro) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedIntro) {
          setHasAnimatedIntro(true);
          let start: number | null = null;
          const duration = 1350;

          const animateSweep = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min(1, (ts - start) / duration);
            const wave = 52 - Math.sin(p * Math.PI * 2) * 20 * (1 - p * 0.45);
            if (!isDragging.current) {
              setSliderPos(wave);
            }
            if (p < 1 && !isDragging.current) {
              requestAnimationFrame(animateSweep);
            } else if (!isDragging.current) {
              setSliderPos(52);
            }
          };
          requestAnimationFrame(animateSweep);
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimatedIntro]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(x);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  if (!current) return null;

  return (
    <>
      <section ref={sectionRef} id="cad-compare" className="py-10 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[#f3efe8]/85 border border-[#e5dfd3] p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(28,25,23,0.04)]">
            {/* Header & Category Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Đối Chiếu Trực Quan: Bản Vẽ Kỹ Thuật CAD ↔ Sản Phẩm 3D
                </h2>
                <p className="text-stone-600 mt-2 max-w-2xl text-sm sm:text-base">
                  Kéo thanh gạt qua lại (hoặc bấm nút chuyển chế độ) để xem trọn tờ bản vẽ kỹ thuật 2D bóc tách kích thước, mặt cắt, bảng vật tư và phối cảnh 3D hoàn thiện.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {items.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      safeIdx === idx
                        ? "bg-[#1e293b] text-white shadow-md"
                        : "bg-white text-slate-700 border border-[#dfd9cd] hover:border-slate-400"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick View Preset Buttons + Fullscreen CAD Zoom Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-white border border-[#dfd9cd]">
                <button
                  type="button"
                  onClick={() => setSliderPos(98)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    sliderPos > 80
                      ? "bg-[#1e293b] text-white"
                      : "text-stone-600 hover:text-slate-900"
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" /> Xem trọn Bản vẽ CAD 2D
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPos(52)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    sliderPos >= 22 && sliderPos <= 80
                      ? "bg-[#b45309] text-white"
                      : "text-stone-600 hover:text-slate-900"
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" /> Chia đôi đối chiếu 50/50
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPos(2)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    sliderPos < 22
                      ? "bg-[#1e293b] text-white"
                      : "text-stone-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Xem trọn Phối cảnh 3D
                </button>
              </div>

              <button
                type="button"
                onClick={() => setInspectOpen(true)}
                className="px-4 py-2 rounded-full bg-[#1e293b] hover:bg-[#b45309] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Phóng to soi chi tiết bản vẽ CAD (Zoom 500%)</span>
              </button>
            </div>

            {/* Interactive Comparison Frame */}
            <div className="p-3 rounded-3xl bg-white border border-[#dfd9cd] shadow-lg">
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-stone-300 select-none touch-none cursor-ew-resize bg-stone-900"
              >
                {/* LAYER 1 (RIGHT): FULL PHOTOREALISTIC 3D RENDER */}
                <img
                  src={current.renderImage}
                  alt={`${current.label} 3D`}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-mono font-semibold shadow-sm pointer-events-none">
                  PHỐI CẢNH 3D HOÀN THIỆN
                </div>

                {/* LAYER 2 (LEFT): FULL REAL 2D CAD TECHNICAL SHEET */}
                <div
                  className="absolute inset-0 overflow-hidden bg-[#fcfbf8]"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  <img
                    src={current.cadImage}
                    alt={`${current.label} Bản vẽ kỹ thuật CAD`}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-contain bg-[#fcfbf8]"
                  />

                  <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-[#1e293b] text-white text-xs font-mono font-semibold shadow-sm pointer-events-none">
                    BẢN VẼ KỸ THUẬT CAD CHI TIẾT
                  </div>
                </div>

                {/* VERTICAL DIVIDER LINE & CLEAR DRAGGABLE HANDLE */}
                <div
                  className="absolute top-0 bottom-0 z-20 w-0.5 bg-[#b45309] shadow-[0_0_12px_rgba(180,83,9,0.6)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 px-3.5 py-2 rounded-full bg-[#1e293b] text-white flex items-center gap-1.5 shadow-2xl border-2 border-white whitespace-nowrap">
                    <MoveHorizontal className="w-4 h-4 text-amber-300" />
                    <span className="text-[11px] font-bold tracking-wide hidden sm:inline">
                      Kéo qua lại
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Technical Spec Bar */}
              <div className="mt-3 px-3 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-600">
                <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#b45309]" />
                  <span>
                    MÃ BẢN VẼ: {current.dwgCode} ({current.scale})
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {current.dimensions.map((d) => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded-full bg-[#faf8f5] border border-[#e5e0d5] text-slate-700"
                    >
                      {d}
                    </span>
                  ))}
                  <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700 font-semibold ml-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Khớp thông số xuất xưởng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {inspectOpen && (
        <TrinhXemBanVeCAD
          projectTitle={`Hồ sơ đối chiếu: ${current.label} (${current.dwgCode})`}
          sheets={[
            {
              id: `${current.id}-cad`,
              title: `Bản vẽ kỹ thuật CAD (${current.scale})`,
              url: current.cadImage,
            },
            {
              id: `${current.id}-3d`,
              title: "Phối cảnh 3D hoàn thiện",
              url: current.renderImage,
            },
          ]}
          initialIndex={0}
          onClose={() => setInspectOpen(false)}
        />
      )}
    </>
  );
}
