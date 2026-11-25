"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Upload,
  FileCode2,
  FileText,
  Trash2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { uploadStudioFile } from "@/dich-vu-du-lieu/luu-tru";
import { CadSheetItem, ProjectItem } from "@/kieu-du-lieu";

interface DangVaSuaDuAnProps {
  categories: string[];
  editingProject?: ProjectItem | null;
  onCancelEdit?: () => void;
  onSaveProject: (project: ProjectItem, isEdit: boolean) => void;
}

export default function DangVaSuaDuAn({
  categories,
  editingProject,
  onCancelEdit,
  onSaveProject,
}: DangVaSuaDuAnProps) {
  const maxPinned = SITE_CONFIG.stats.maxPinnedOnHome;

  const [title, setTitle] = useState<string>("");
  const [selectedCats, setSelectedCats] = useState<string[]>([categories[0] || "Thang máy"]);
  const [clientType, setClientType] = useState<string>("Doanh nghiệp / Chủ đầu tư");
  const [software, setSoftware] = useState<string>("SolidWorks, AutoCAD");
  const [duration, setDuration] = useState<string>("07 ngày");
  const [summary, setSummary] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("/images/elevator-clean-3d.jpg");
  const [cadSheets, setCadSheets] = useState<CadSheetItem[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const [pinOnCreate, setPinOnCreate] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [publishNotice, setPublishNotice] = useState<string>("");

  const resetForm = () => {
    setTitle("");
    setSelectedCats([categories[0] || "Thang máy"]);
    setClientType("Doanh nghiệp / Chủ đầu tư");
    setSoftware("SolidWorks, AutoCAD");
    setDuration("07 ngày");
    setSummary("");
    setChallenge("");
    setSolution("");
    setImagePreview("/images/elevator-clean-3d.jpg");
    setCadSheets([]);
    setPdfUrl("");
    setPdfName("");
    setPinOnCreate(true);
  };

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setSelectedCats(editingProject.categories);
      setClientType(editingProject.clientType);
      setSoftware(editingProject.software.join(", "));
      setDuration(editingProject.duration);
      setSummary(editingProject.summary);
      setChallenge(editingProject.challenge);
      setSolution(editingProject.solution);
      setImagePreview(editingProject.image);
      setCadSheets(editingProject.cadSheets || []);
      setPdfUrl(editingProject.pdfUrl || "");
      setPdfName(editingProject.pdfName || "");
      setPinOnCreate(Boolean(editingProject.featured));
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProject]);

  const toggleCatSelection = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? (prev.length > 1 ? prev.filter((c) => c !== cat) : prev) : [...prev, cat]
    );
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadStudioFile(file);
      setImagePreview(uploaded.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCadSheetsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const added: CadSheetItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const uploaded = await uploadStudioFile(f);
        const cleanTitle = f.name.replace(/\.[^/.]+$/, "");
        added.push({
          id: `cad-${Date.now()}-${i}`,
          title: `Tờ ${String(cadSheets.length + i + 1).padStart(2, "0")}: ${cleanTitle}`,
          url: uploaded.url,
        });
      }
      setCadSheets((prev) => [...prev, ...added]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadStudioFile(file);
      setPdfUrl(uploaded.url);
      setPdfName(uploaded.fileName);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSheetTitleChange = (id: string, nextTitle: string) => {
    setCadSheets((prev) => prev.map((s) => (s.id === id ? { ...s, title: nextTitle } : s)));
  };

  const handleRemoveSheet = (id: string) => {
    setCadSheets((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const isEdit = Boolean(editingProject);

    const deliverablesList = [
      "Mô hình 3D hoàn chỉnh & Bản vẽ gia công 2D (.DWG / .DXF)",
      ...(cadSheets.length > 0
        ? [`Đính kèm trực tiếp ${cadSheets.length} tờ bản vẽ kỹ thuật chi tiết`]
        : []),
      ...(pdfUrl ? ["Trọn bộ hồ sơ bản vẽ xuất bản (.PDF)"] : []),
      "Bảng bóc tách khối lượng vật tư (BOM)",
    ];

    const item: ProjectItem = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: title.trim(),
      categories: selectedCats,
      clientType: clientType.trim() || "Doanh nghiệp / Chủ đầu tư",
      year: editingProject ? editingProject.year : new Date().getFullYear().toString(),
      duration: duration.trim() || "07 ngày",
      software: software
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      deliverables: editingProject ? editingProject.deliverables : deliverablesList,
      image: imagePreview,
      cadSheets: cadSheets.length > 0 ? cadSheets : undefined,
      pdfUrl: pdfUrl || undefined,
      pdfName: pdfName || undefined,
      summary:
        summary.trim() ||
        "Dự án thiết kế triển khai theo yêu cầu kỹ thuật riêng của chủ đầu tư.",
      challenge:
        challenge.trim() ||
        "Đảm bảo tiến độ nhanh, độ chính xác lắp ghép cơ khí và tối ưu chi phí vật tư sản xuất.",
      solution:
        solution.trim() ||
        "Ứng dụng mô hình 3D kiểm tra va chạm trước khi xuất bản vẽ chế tạo chi tiết.",
      featured: pinOnCreate,
    };

    onSaveProject(item, isEdit);
    if (!isEdit) resetForm();
    setPublishNotice(
      isEdit
        ? "Đã lưu cập nhật dự án và bộ bản vẽ CAD thành công!"
        : "Đã đăng tải dự án mới lên hệ thống thành công!"
    );
    setTimeout(() => setPublishNotice(""), 4000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl bg-white border border-[#dfd9cd] shadow-sm space-y-6"
    >
      <div className="border-b border-[#ebe6dc] pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {editingProject
              ? "Module Chỉnh Sửa Dự Án & Cập Nhật Bản Vẽ CAD"
              : "Module Đăng Tải Dự Án Mới & Hồ Sơ Bản Vẽ CAD"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tải lên ảnh phối cảnh 3D, nhiều tờ bản vẽ kỹ thuật CAD (.PNG, .JPG, .SVG) và hồ sơ tổng hợp .PDF không giới hạn dung lượng.
          </p>
        </div>

        {editingProject && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 rounded-full bg-[#faf8f5] hover:bg-stone-200 border border-[#dfd9cd] text-xs font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Kho dự án
          </button>
        )}
      </div>

      {publishNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{publishNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tiêu đề dự án (*)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên dự án..."
              className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 focus:outline-none focus:border-[#1e293b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Thuộc lĩnh vực (có thể chọn nhiều):
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCats.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCatSelection(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                      active
                        ? "bg-[#1e293b] text-white border-[#1e293b]"
                        : "bg-[#faf8f5] text-stone-700 border-[#dfd9cd]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nhóm khách hàng / Chủ đầu tư
            </label>
            <input
              type="text"
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              placeholder="Nhập nhóm khách hàng..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mô tả tóm tắt dự án
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Nhập tóm tắt ngắn gọn..."
              className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 focus:outline-none focus:border-[#1e293b]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bài toán của khách hàng
              </label>
              <textarea
                rows={3}
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Nhập yêu cầu kỹ thuật..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Giải pháp thiết kế của Studio
              </label>
              <textarea
                rows={3}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Nhập giải pháp triển khai..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Media, Multi-Sheet CAD & PDF Upload */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d5] space-y-3">
            <label className="block text-xs font-bold text-slate-900">
              1. Ảnh bìa đại diện dự án (Phối cảnh 3D)
            </label>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-44 object-cover rounded-xl border border-stone-300 bg-white"
            />
            <label className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 border border-[#dfd9cd] text-xs text-slate-800 font-semibold flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-[#b45309]" /> Chọn ảnh bìa từ máy tính
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          </div>

          <div className="p-5 rounded-2xl bg-[#f3efe8]/80 border border-[#dfd9cd] space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-900">
                2. Bộ tờ Bản vẽ Kỹ thuật CAD ({cadSheets.length} tờ)
              </label>
              <p className="text-[11px] text-stone-600">
                Hỗ trợ chọn nhiều tờ ảnh/SVG bản vẽ cùng lúc để khách phóng to 500% soi chi tiết.
              </p>
            </div>

            <label className="w-full py-2.5 px-4 rounded-xl bg-[#1e293b] hover:bg-slate-800 text-xs text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <FileCode2 className="w-4 h-4 text-amber-300" />
              )}
              <span>+ Tải lên các tờ bản vẽ CAD</span>
              <input
                type="file"
                multiple
                accept="image/*,.svg"
                onChange={handleCadSheetsUpload}
                className="hidden"
              />
            </label>

            {cadSheets.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {cadSheets.map((sh) => (
                  <div
                    key={sh.id}
                    className="p-2 rounded-xl bg-white border border-[#dfd9cd] flex items-center gap-2.5"
                  >
                    <img
                      src={sh.url}
                      alt={sh.title}
                      className="w-14 h-10 object-contain rounded-lg border border-stone-200 bg-[#fcfbf8] shrink-0"
                    />
                    <input
                      type="text"
                      value={sh.title}
                      onChange={(e) => handleSheetTitleChange(sh.id, e.target.value)}
                      placeholder="Nhập tên tờ bản vẽ..."
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-[#faf8f5] border border-[#dfd9cd] text-xs font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSheet(sh.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer shrink-0"
                      title="Xóa tờ này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#e2dcd0] space-y-2.5">
              <div className="text-xs font-bold text-slate-900">
                3. Hồ sơ bản vẽ tổng hợp (.PDF nhiều trang)
              </div>
              {pdfUrl ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-900 font-semibold">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">{pdfName || "Hồ sơ PDF đính kèm"}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfUrl("");
                      setPdfName("");
                    }}
                    className="text-rose-600 hover:underline shrink-0 cursor-pointer"
                  >
                    Gỡ
                  </button>
                </div>
              ) : (
                <label className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 border border-[#dfd9cd] text-xs text-slate-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Đính kèm tệp .PDF bản vẽ</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#ebe6dc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <label className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={pinOnCreate}
            onChange={(e) => setPinOnCreate(e.target.checked)}
            className="rounded accent-[#1e293b]"
          />
          <span>
            Hiển thị ngay trên Trang chủ — Dự án tiêu biểu (tối đa {maxPinned} vị trí)
          </span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="px-8 py-4 rounded-full bg-[#b45309] hover:bg-amber-800 disabled:opacity-60 text-white font-bold text-sm transition cursor-pointer shadow-md"
        >
          {editingProject ? "LƯU CẬP NHẬT DỰ ÁN & BẢN VẼ" : "+ ĐĂNG TẢI DỰ ÁN LÊN HỆ THỐNG"}
        </button>
      </div>
    </form>
  );
}
