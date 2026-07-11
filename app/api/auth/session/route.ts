import { NextRequest, NextResponse } from "next/server";
import { signCookieValue } from "@/lib/security";

export const runtime = "nodejs";

/**
 * Issues HBS session cookies server-side.
 * Signing happens on the server so the signing secret can stay server-only
 * (COOKIE_SECRET). The browser never sees the secret used to mint cookies.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.role !== "string") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const maxAge = 86400;
  const role = await signCookieValue(body.role);
  const email = await signCookieValue(body.email);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("hbs-user-role", role, { path: "/", maxAge, sameSite: "lax" });
  res.cookies.set("hbs-user-email", email, { path: "/", maxAge, sameSite: "lax" });
  return res;
}
