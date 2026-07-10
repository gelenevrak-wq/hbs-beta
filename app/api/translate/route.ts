import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const text = body.text || "";
    const from = body.from || "tr";
    const to = body.to || "en";

    if (!text || !text.trim()) {
      return NextResponse.json({ success: true, translatedText: "" });
    }

    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        // google translate single?client=gtx can return multiple translation segments for multi-paragraph texts
        const translatedParts = data[0].map((segment: any) => segment[0] || "").join("");
        return NextResponse.json({ success: true, translatedText: translatedParts });
      }
    }

    return NextResponse.json({ success: false, error: "Google Translate API failed" }, { status: 502 });
  } catch (error) {
    console.error("Server translation API error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Translation API is active (Use POST with JSON body)" });
}
