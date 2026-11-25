import { NextRequest, NextResponse } from "next/server";
import {
  detectZaloBotChatId,
  ensureAutoPairBackgroundListener,
  fetchZaloBotProfile,
  loadZaloBotConfig,
  saveZaloBotConfig,
  sendZaloBotText,
} from "@/dich-vu-du-lieu/may-chu-zalo-bot";
import { ZaloBotConfig } from "@/kieu-du-lieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = await loadZaloBotConfig();
  if (config.botToken && !config.chatId) {
    ensureAutoPairBackgroundListener();
  }
  const botProfile = config.botToken ? await fetchZaloBotProfile(config.botToken) : null;
  return NextResponse.json({ config, botProfile });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action as "save" | "test" | "detect-chat-id";

    if (action === "detect-chat-id") {
      const result = await detectZaloBotChatId(String(body.botToken || ""), 20);
      return NextResponse.json(result);
    }

    const incomingConfig: ZaloBotConfig = {
      enabled: Boolean(body.config?.enabled),
      mode: body.config?.mode === "custom-webhook" ? "custom-webhook" : "zalo-bot-api",
      botToken: String(body.config?.botToken || ""),
      chatId: String(body.config?.chatId || ""),
      customWebhookUrl: String(body.config?.customWebhookUrl || ""),
    };

    const saved = await saveZaloBotConfig(incomingConfig);
    if (saved.botToken && !saved.chatId) {
      ensureAutoPairBackgroundListener();
    }

    if (action === "test") {
      const testText = [
        "🔔 [PLANITUP STUDIO — KIỂM TRA BOT ZALO]",
        "Kết nối thành công! Từ bây giờ mỗi khi có khách hàng gửi phiếu đăng ký báo giá trên website, Bot sẽ báo ngay lập tức về cuộc trò chuyện này.",
      ].join("\n");
      const sendRes = await sendZaloBotText(saved, testText, { isTest: true });
      return NextResponse.json({ config: saved, ...sendRes });
    }

    return NextResponse.json({
      ok: true,
      config: saved,
      detail: "Đã lưu cấu hình kết nối Bot Zalo thành công!",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, detail: `Lỗi xử lý cấu hình Bot Zalo: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
