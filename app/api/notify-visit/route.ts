import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = body.path || "/";

    const phone = process.env.WHATSAPP_ALERT_NUMBER;
    const apiKey = process.env.WHATSAPP_API_KEY;

    if (!phone || !apiKey) {
      // Return 200 to prevent throwing console errors on client-side if not configured yet
      console.warn("WhatsApp visitor notification config missing in .env.local.");
      return NextResponse.json({ success: true, message: "Configuration missing" });
    }

    const userAgent = request.headers.get("user-agent") || "Bilinmiyor";
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Bilinmiyor";

    // Format visitor details with Turkish locale
    const dateStr = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
    
    // Callmebot supports bold *text* formatting
    const messageText = `🔔 *HBS Market Yeni Ziyaretçi!*\n\n` +
      `📅 *Tarih:* ${dateStr}\n` +
      `🔗 *Sayfa:* ${path}\n` +
      `💻 *Tarayıcı:* ${userAgent.substring(0, 100)}\n` +
      `🌐 *IP Adresi:* ${ip.split(",")[0]}`;

    const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(messageText)}&apikey=${apiKey}`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error("Callmebot WhatsApp api call failed:", res.statusText);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification API route error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
export async function GET() {
  return NextResponse.json({ message: "WhatsApp Notification Endpoint is Active (Use POST)" });
}
