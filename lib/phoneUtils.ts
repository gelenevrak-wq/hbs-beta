/**
 * Smart phone and WhatsApp number sanitization utility.
 * Automatically heals and formats entered numbers to ensure a working WhatsApp wa.me link.
 * Detects common formatting mistakes for Turkish (+90) and Georgian (+995) numbers.
 */
export function sanitizeWhatsAppNumber(num: string | undefined | null): string {
  if (!num) return "905320000000"; // Fallback placeholder

  // 1. Strip all non-numeric characters
  let clean = num.replace(/[^0-9]/g, "");

  // 2. If it starts with '00', replace it with nothing (0090... -> 90...)
  if (clean.startsWith("00")) {
    clean = clean.substring(2);
  }

  // 3. If it starts with '0' (like '0532...'), it's a Turkish number without country code!
  // Strip the leading '0' and prepend '90' (Turkey country code)
  if (clean.startsWith("0") && clean.length === 11) {
    clean = "90" + clean.substring(1);
  }

  // 4. If it has 10 digits and starts with '5' (like '5321234567'), it's a Turkish number without country code or leading '0'!
  // Prepend '90'
  if (clean.length === 10 && clean.startsWith("5")) {
    clean = "90" + clean;
  }

  // 5. If it starts with '900' (like '900532...'), the user typed country code '90' followed by the local leading '0'!
  // Strip the extra '0' so it becomes '90532...'
  if (clean.startsWith("900") && clean.length === 13) {
    clean = "90" + clean.substring(3);
  }

  // 6. If it starts with '9950' (like '9950599...'), the user typed Georgia country code '995' followed by a leading '0'!
  // Strip the extra '0' so it becomes '995599...'
  if (clean.startsWith("9950")) {
    clean = "995" + clean.substring(4);
  }

  return clean;
}

/**
 * Standard phone formatting for display purposes.
 */
export function formatPhoneForDisplay(num: string | undefined | null): string {
  if (!num) return "";
  const clean = num.replace(/[^0-9+]/g, "");
  if (clean.startsWith("+90") || clean.startsWith("90")) {
    const raw = clean.startsWith("+") ? clean.substring(3) : clean.substring(2);
    if (raw.length === 10) {
      return `+90 (${raw.substring(0, 3)}) ${raw.substring(3, 6)} ${raw.substring(6, 8)} ${raw.substring(8, 10)}`;
    }
  }
  if (clean.startsWith("+995") || clean.startsWith("995")) {
    const raw = clean.startsWith("+") ? clean.substring(4) : clean.substring(3);
    if (raw.length === 9) {
      return `+995 (${raw.substring(0, 3)}) ${raw.substring(3, 5)} ${raw.substring(5, 7)} ${raw.substring(7, 9)}`;
    }
  }
  return num;
}
