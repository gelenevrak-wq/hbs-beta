/**
 * HBS Cryptographic Cookie Security Helper
 * Provides HMAC-like SHA-256 signing and verification for cookies
 * using the native Web Cryptography API (fully supported in Edge/Next.js runtimes).
 *
 * SECURITY NOTE:
 * Cookie signing happens in the browser bundle, so the secret MUST be a
 * NEXT_PUBLIC_ variable and is therefore exposed to clients. This protects
 * against tampering by users who have NOT read the bundle, but it is NOT a
 * substitute for server-side authorization. The authoritative protection is
 * Supabase Row Level Security (see supabase/migrations). For production you
 * MUST set a strong, unique NEXT_PUBLIC_COOKIE_SECRET and rely on RLS for
 * data access control.
 *
 * IMPORTANT: Never reuse NEXT_PUBLIC_SUPABASE_ANON_KEY as the cookie secret.
 * The anon key is public by design and would let anyone forge signed cookies.
 */

const COOKIE_SECRET = process.env.NEXT_PUBLIC_COOKIE_SECRET || process.env.COOKIE_SECRET;

const DEV_FALLBACK_SECRET = "dev-only-insecure-cookie-secret-change-me-in-production-32ch";

function resolveSecret(): string {
  if (COOKIE_SECRET && COOKIE_SECRET.length >= 16) {
    return COOKIE_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "COOKIE_SECRET (or NEXT_PUBLIC_COOKIE_SECRET) is not set or too short. " +
        "Set a strong secret (>=16 chars) in production environment variables."
    );
  }
  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "⚠️ NEXT_PUBLIC_COOKIE_SECRET is not set. Using an INSECURE dev fallback. " +
        "Set NEXT_PUBLIC_COOKIE_SECRET before deploying to production."
    );
  }
  return DEV_FALLBACK_SECRET;
}

const SECRET_SALT = resolveSecret();

export function isCookieSecretConfigured(): boolean {
  return Boolean(COOKIE_SECRET && COOKIE_SECRET.length >= 16);
}

/**
 * Computes a SHA-256 hash of the value combined with the secret salt
 */
async function getSignature(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value + ":" + SECRET_SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Signs a value, returning "value.signature"
 */
export async function signCookieValue(value: string): Promise<string> {
  const signature = await getSignature(value);
  return `${encodeURIComponent(value)}.${signature}`;
}

/**
 * Verifies a signed cookie value, returning the original value if signature is valid, or null
 */
export async function verifyCookieValue(signedValue: string | undefined): Promise<string | null> {
  if (!signedValue || !signedValue.includes(".")) return null;
  
  const parts = signedValue.split(".");
  if (parts.length !== 2) return null;
  
  const value = decodeURIComponent(parts[0]);
  const signature = parts[1];
  
  const expectedSignature = await getSignature(value);
  if (signature === expectedSignature) {
    return value;
  }
  
  return null;
}
