import { signCookieValue } from "@/lib/security";

type SessionInput = { role: string; email: string };

/**
 * Sets HBS session cookies via the server-side route (preferred) and falls
 * back to client-side signing when the route is unreachable (demo / offline).
 * Returns true when the server route was used.
 */
export async function setSessionCookies(input: SessionInput): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("session route failed");
    return true;
  } catch {
    try {
      document.cookie = `hbs-user-role=${await signCookieValue(input.role)}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `hbs-user-email=${await signCookieValue(input.email)}; path=/; max-age=86400; SameSite=Lax`;
    } catch {
      /* ignore */
    }
    return false;
  }
}
