/**
 * HBS Cryptographic Cookie Security Helper
 * Provides HMAC-like SHA-256 signing and verification for cookies
 * using the native Web Cryptography API (fully supported in Edge/Next.js runtimes).
 */

const SECRET_SALT = process.env.COOKIE_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "hbs_default_super_secret_cookie_signing_key_2026";

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
