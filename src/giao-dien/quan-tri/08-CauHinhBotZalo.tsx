"use client";

import React, { useState, useEffect } from "react";
import {
  BellRing,
  CheckCircle2,
  AlertCircle,
  Send,
  Search,
  Loader2,
  Webhook,
  Bot,
} from "lucide-react";
import { ZaloBotConfig } from "@/kieu-du-lieu";

export default function CauHinhBotZalo() {
  const [config, setConfig] = useState<ZaloBotConfig>({
    enabled: true,
    mode: "zalo-bot-api",
    botToken: "",
    chatId: "",
    customWebhookUrl: "",
  });
  const [botDisplayName, setBotDisplayName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [working, setWorking] = useState<boolean>(false);
  const [detecting, setDetecting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const load = () => {
      fetch("/api/zalo-bot", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (data?.config) setConfig(data.config);
          if (data?.botProfile?.display_name) {
            setBotDisplayName(
              `${data.botProfile.display_name} (@${data.botProfile.account_name})`
            );
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    };
    load();

    const timer = window.setInterval(() => {
      if (!config.chatId) load();
    }, 3500);
    return () => window.clearInterval(timer);
  }, [config.chatId]);

  const handleAction = async (action: "save" | "test") => {
    setWorking(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/zalo-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, config }),
      });
      const data = await res.json();
      setFeedback({ ok: Boolean(data.ok), text: data.detail || "Đã xử lý." });
    } catch {
      setFeedback({ ok: false, text: "Không thể kết nối tới máy chủ cấu hình Bot." });
    } finally {
      setWorking(false);
    }
  };

  const handleDetectChatId = async () => {
    setDetecting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/zalo-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "detect-chat-id",
          botToken: config.botToken,
        }),
      });
      const data = await res.json();
      if (data.ok && data.chatId) {
        setConfig((prev) => ({ ...prev, chatId: String(data.chatId), enabled: true }));
      }
      setFeedback({ ok: Boolean(data.ok), text: data.detail || "" });
    } catch {
      setFeedback({ ok: false, text: "Lỗi khi dò tự động Chat ID từ Zalo Bot." });
    } finally {
      setDetecting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-[#dfd9cd] text-sm text-stone-500">
        Đang tải cấu hình kết nối Bot Zalo...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#dfd9cd] shadow-sm space-y-6">
        <div className="border-b border-[#ebe6dc] pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Module Kết Nối Bot Zalo Nhận Thông Báo Báo Giá
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Tự động bắn tin nhắn thẳng về Zalo của bạn ngay giây phút khách hàng bấm gửi đăng ký báo giá trên website.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#faf8f5] border border-[#dfd9cd] text-xs font-bold text-slate-900 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="rounded accent-[#1e293b]"
            />
            <span>{config.enabled ? "Đang bật nhận tin" : "Đang tắt"}</span>
          </label>
        </div>

        {botDisplayName && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2">
            <span>Đã kết nối xác thực: {botDisplayName}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-300 text-[11px] font-mono">
              {config.chatId ? `Chat ID: ${config.chatId}` : "Đang chờ bạn nhắn 'hi' trên Zalo..."}
            </span>
          </div>
        )}

        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-sm font-medium flex items-start gap-2.5 ${
              feedback.ok
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-300 text-amber-950"
            }`}
          >
            {feedback.ok ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Mode Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setConfig({ ...config, mode: "zalo-bot-api" })}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
              config.mode === "zalo-bot-api"
                ? "bg-[#1e293b] text-white border-[#1e293b] shadow-sm"
                : "bg-[#faf8f5] text-slate-800 border-[#dfd9cd]"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Zalo Bot API Trực Tiếp</span>
            </div>
            <p
              className={`text-[11px] ${
                config.mode === "zalo-bot-api" ? "text-slate-300" : "text-stone-500"
              }`}
            >
              Dùng Bot Token &amp; Chat ID chuẩn Zalo Bot Platform
            </p>
          </button>

          <button
            type="button"
            onClick={() => setConfig({ ...config, mode: "custom-webhook" })}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
              config.mode === "custom-webhook"
                ? "bg-[#1e293b] text-white border-[#1e293b] shadow-sm"
                : "bg-[#faf8f5] text-slate-800 border-[#dfd9cd]"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <Webhook className="w-4 h-4 text-amber-300" />
              <span>Webhook Bot Zalo Riêng</span>
            </div>
            <p
              className={`text-[11px] ${
                config.mode === "custom-webhook" ? "text-slate-300" : "text-stone-500"
              }`}
            >
              Dành cho Bot nối qua n8n, Make hoặc Server riêng
            </p>
          </button>
        </div>

        {config.mode === "zalo-bot-api" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Zalo Bot Token (*)
              </label>
              <input
                type="password"
                value={config.botToken}
                onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                placeholder="Dán mã Bot Token của con Bot Zalo..."
                className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm font-mono text-slate-900 focus:outline-none focus:border-[#1e293b]"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Chat ID người nhận hoặc nhóm nhận tin (*)
                </label>
                <button
                  type="button"
                  disabled={detecting}
                  onClick={handleDetectChatId}
                  className="text-xs font-bold text-[#b45309] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {detecting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Tự động dò Chat ID từ tin nhắn mới</span>
                </button>
              </div>
              <input
                type="text"
                value={config.chatId}
                onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
                placeholder="Nhập Chat ID nhận thông báo..."
                className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm font-mono text-slate-900 focus:outline-none focus:border-[#1e293b]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Đường dẫn Webhook Bot Zalo (*)
              </label>
              <input
                type="url"
                value={config.customWebhookUrl}
                onChange={(e) => setConfig({ ...config, customWebhookUrl: e.target.value })}
                placeholder="Nhập đường dẫn URL nhận POST JSON..."
                className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm font-mono text-slate-900 focus:outline-none focus:border-[#1e293b]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Chat ID định danh (không bắt buộc)
              </label>
              <input
                type="text"
                value={config.chatId}
                onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
                placeholder="Nhập Chat ID nếu Webhook yêu cầu..."
                className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cd] text-sm font-mono text-slate-900 focus:outline-none focus:border-[#1e293b]"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            disabled={working}
            onClick={() => handleAction("save")}
            className="flex-1 py-3.5 px-6 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer"
          >
            Lưu cấu hình Bot Zalo
          </button>

          <button
            type="button"
            disabled={working}
            onClick={() => handleAction("test")}
            className="py-3.5 px-6 rounded-full bg-[#b45309] hover:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {working ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Lưu &amp; Bắn tin nhắn thử về Zalo</span>
          </button>
        </div>
      </div>

      {/* Right Column: Quick Setup Guide & Message Preview */}
      <div className="lg:col-span-5 space-y-5">
        <div className="p-6 rounded-3xl bg-white border border-[#dfd9cd] space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <BellRing className="w-4 h-4 text-[#b45309]" />
            <span>Hướng Dẫn Nối Con Bot Zalo Trong 30 Giây</span>
          </div>

          <ol className="space-y-2.5 text-xs text-stone-600 leading-relaxed list-decimal list-inside">
            <li>
              Lấy mã <strong>Bot Token</strong> của con Bot bạn đã tạo trên <strong>Zalo Bot Platform</strong> dán vào ô bên trái.
            </li>
            <li>
              Mở ứng dụng Zalo trên điện thoại, nhắn một chữ bất kỳ (như <code>hi</code>) vào cuộc trò chuyện với con Bot đó, rồi bấm nút <strong>Tự động dò Chat ID</strong> (hoặc dán sẵn Chat ID bạn đang có).
            </li>
            <li>
              Tích bật <strong>Đang bật nhận tin</strong> và bấm <strong>Lưu &amp; Bắn tin nhắn thử về Zalo</strong> để kiểm tra chuông báo trên điện thoại!
            </li>
          </ol>
        </div>

        <div className="p-6 rounded-3xl bg-[#1e293b] text-white space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
            MẪU TIN NHẮN BOT SẼ BẮN VỀ ZALO CỦA BẠN
          </div>
          <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
{`🔔 PHIẾU ĐĂNG KÝ BÁO GIÁ MỚI (#PIU-2311-684)
━━━━━━━━━━━━━━━━━━
👤 Khách hàng: Công ty Cơ điện An Phát
📞 SĐT xác thực: 0912345678
📐 Lĩnh vực: Đường ống nhà máy
📝 Yêu cầu: Cần dựng tuyến ống hơi DN150
🕒 Thời gian: 10:15:08 — 23/11/2026
━━━━━━━━━━━━━━━━━━
👉 Mở chat Zalo khách ngay:
https://zalo.me/0912345678`}
          </pre>
        </div>
      </div>
    </div>
  );
}
