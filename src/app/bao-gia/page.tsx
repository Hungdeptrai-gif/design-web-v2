"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { useDuLieuStudio } from "@/dich-vu-du-lieu/useDuLieuStudio";
import { studioStorage } from "@/dich-vu-du-lieu/luu-tru";
import ThanhMenuTrangCon from "@/giao-dien/khung-chung/ThanhMenuTrangCon";
import {
  OTHER_CATEGORY_KEY,
  isValidVietnamPhone,
} from "@/giao-dien/bao-gia/xac-thuc-bieu-mau";
import FormDangKyBaoGia from "@/giao-dien/bao-gia/FormDangKyBaoGia";
import TheXacNhanYeuCau from "@/giao-dien/bao-gia/TheXacNhanYeuCau";
import ManHinhGuiThanhCong from "@/giao-dien/bao-gia/ManHinhGuiThanhCong";

function BaoGiaContent() {
  const searchParams = useSearchParams();
  const { categories } = useDuLieuStudio();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedCat, setSelectedCat] = useState<string>("Thang máy");
  const [customCat, setCustomCat] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const qCat = searchParams.get("category");
    const qProj = searchParams.get("project");
    if (qCat === "other") setSelectedCat(OTHER_CATEGORY_KEY);
    else if (qCat) setSelectedCat(qCat);
    if (qProj) setNote(`Quan tâm hạng mục tương tự dự án: "${qProj}".`);
  }, [searchParams]);

  const effectiveCategory =
    selectedCat === OTHER_CATEGORY_KEY
      ? customCat.trim()
        ? `Khác: ${customCat.trim()}`
        : "Lĩnh vực khác"
      : selectedCat;

  const selectableCategories = [
    ...categories.filter((c) => c !== "Dự án khác"),
    OTHER_CATEGORY_KEY,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedName = name.trim();
    const cleanedPhone = phone.replace(/[\s.-]/g, "");
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setErrorMsg("Vui lòng nhập đầy đủ họ tên người liên hệ hoặc tên đơn vị.");
      return;
    }
    if (!isValidVietnamPhone(cleanedPhone)) {
      setErrorMsg(
        "Số điện thoại chưa đúng định dạng thực tế tại Việt Nam (10–11 chữ số). Vui lòng kiểm tra lại."
      );
      return;
    }
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg("Địa chỉ Email không đúng định dạng. Vui lòng kiểm tra lại hoặc để trống.");
      return;
    }

    // Only show the success screen once the server has really saved the quote.
    setSubmitting(true);
    const result = await studioStorage.submitQuote({
      name: trimmedName,
      phone: cleanedPhone,
      email: trimmedEmail || undefined,
      category: effectiveCategory,
      note: note.trim() || "Đăng ký tư vấn và nhận báo giá thiết kế.",
    });
    setSubmitting(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }

    setPhone(cleanedPhone);
    setSubmittedAt(result.quote.createdAt);
    setSubmittedCode(result.quote.code ?? result.quote.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setSubmittedCode(null);
    setSubmittedAt("");
    setErrorMsg("");
    setCustomCat("");
    setNote("");
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col">
      <ThanhMenuTrangCon badgeText="CỔNG ĐĂNG KÝ DỊCH VỤ THIẾT KẾ" rightMode="hotline" />

      <main className="flex-1 py-10 sm:py-14 relative">
        <div className="absolute inset-x-0 top-0 h-72 bg-cad-grid mask-grid-fade pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {submittedCode ? (
            <ManHinhGuiThanhCong
              submittedCode={submittedCode}
              submittedAt={submittedAt}
              name={name}
              phone={phone}
              effectiveCategory={effectiveCategory}
              onReset={handleReset}
            />
          ) : (
            <>
              <div className="max-w-3xl mb-10">
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
                  Đăng Ký Tư Vấn &amp; Nhận Báo Giá Thiết Kế
                </h1>
                <p className="text-stone-600 mt-2.5 text-sm sm:text-base">
                  Điền thông tin liên hệ chính xác và chọn lĩnh vực bạn cần triển khai — đội ngũ kỹ sư chuyên trách của {SITE_CONFIG.name} sẽ kết nối trao đổi chi tiết và gửi báo giá trọn gói.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <FormDangKyBaoGia
                  selectableCategories={selectableCategories}
                  name={name}
                  phone={phone}
                  email={email}
                  selectedCat={selectedCat}
                  customCat={customCat}
                  note={note}
                  errorMsg={errorMsg}
                  onNameChange={setName}
                  onPhoneChange={setPhone}
                  onEmailChange={setEmail}
                  onSelectCat={setSelectedCat}
                  onCustomCatChange={setCustomCat}
                  onNoteChange={setNote}
                />
                <TheXacNhanYeuCau
                  name={name}
                  phone={phone}
                  effectiveCategory={effectiveCategory}
                  submitting={submitting}
                  errorMsg={errorMsg}
                />
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BaoGiaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5]" />}>
      <BaoGiaContent />
    </Suspense>
  );
}
