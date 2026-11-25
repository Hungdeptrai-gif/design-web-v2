"use client";

import React from "react";
import { useAdminStudio } from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";
import QuanLyPhieuBaoGia from "@/giao-dien/quan-tri/06-QuanLyPhieuBaoGia";

export default function AdminPhieuBaoGiaPage() {
  const { quotes, toggleQuoteStatus, deleteQuote } = useAdminStudio();

  return (
    <QuanLyPhieuBaoGia
      quotes={quotes}
      onToggleQuoteStatus={toggleQuoteStatus}
      onDeleteQuote={deleteQuote}
    />
  );
}
