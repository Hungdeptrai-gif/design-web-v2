"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

interface ManHinhDangNhapProps {
  onSuccess: () => void;
}

export default function ManHinhDangNhap({ onSuccess }: ManHinhDangNhapProps) {
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passwordInput.trim();
    if (trimmed === SITE_CONFIG.admin.defaultPin) {
      setLoginError("");
      onSuccess();
    } else {
      setLoginError("Mật khẩu quản trị không chính xác.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <img
            src={SITE_CONFIG.logoPath}
            alt={SITE_CONFIG.name}
            className="h-12 w-auto object-contain mx-auto"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-[#b45309]">
            <Lock className="w-3.5 h-3.5" /> KHU VỰC QUẢN TRỊ NỘI BỘ
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 pt-1">Đăng Nhập Quản Trị</h1>
          <p className="text-xs text-stone-500">
            Cổng quản trị tập trung dành riêng cho đội ngũ điều hành {SITE_CONFIG.name}.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mã khóa quản trị (*)
            </label>
            <input
              type="password"
              required
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full px-4 py-3.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm text-slate-900 focus:outline-none focus:border-[#1e293b]"
            />
            {loginError && <p className="text-xs text-rose-600 font-medium mt-1.5">{loginError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer"
          >
            Xác thực &amp; Vào Hệ Thống
          </button>
        </form>

        <div className="pt-4 border-t border-stone-200 flex items-center justify-end text-xs text-stone-500">
          <Link href="/" className="text-[#b45309] font-semibold hover:underline">
            ← Quay về giao diện khách hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
