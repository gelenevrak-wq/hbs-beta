/**
 * Smart phone and WhatsApp number sanitization utility.
 * Automatically heals and formats entered numbers to ensure a working WhatsApp wa.me link.
 * Detects common formatting mistakes for Turkish (+90) and Georgian (+995) numbers.
 */
export function sanitizeWhatsAppNumber(num: string | undefined | null): string {
  if (!num) return "905320000000"; // Fallback placeholder

  // 1. Strip all non-numeric characters
  let clean = num.replace(/[^0-9]/g, "");

  // 2. If it starts with '00', replace it with nothing (0090... -> 90..., 00995... -> 995...)
  if (clean.startsWith("00")) {
    clean = clean.substring(2);
  }

  // 3. Turkish number check (without country code)
  // Starts with '05' and has 11 digits (e.g. 05321234567) -> replace leading '0' with '90'
  if (clean.startsWith("05") && clean.length === 11) {
    clean = "90" + clean.substring(1);
  }
  // Starts with '5' and has 10 digits (e.g. 5321234567) -> prepend '90'
  else if (clean.startsWith("5") && clean.length === 10) {
    clean = "90" + clean;
  }

  // 4. Georgian number check (without country code)
  // Starts with '05' and has 10 digits (e.g. 0599123456) -> replace leading '0' with '995'
  else if (clean.startsWith("05") && clean.length === 10) {
    clean = "995" + clean.substring(1);
  }
  // Starts with '5' and has 9 digits (e.g. 599123456) -> prepend '995'
  else if (clean.startsWith("5") && clean.length === 9) {
    clean = "995" + clean;
  }

  // 5. If it starts with '9005' -> the user typed country code '90' followed by leading '0'
  // Strip the extra '0' so it becomes '905...'
  if (clean.startsWith("9005") && clean.length === 13) {
    clean = "90" + clean.substring(3);
  }

  // 6. If it starts with '99505' -> the user typed country code '995' followed by leading '0'
  // Strip the extra '0' so it becomes '9955...'
  if (clean.startsWith("99505") && clean.length === 13) {
    clean = "995" + clean.substring(4);
  }

  return clean;
}

/**
 * Standard phone formatting for display purposes.
 * Automatically sanitizes first to support raw/healed numbers.
 */
export function formatPhoneForDisplay(num: string | undefined | null): string {
  if (!num) return "";
  
  // First, sanitize the number to standard 12-digit formats starting with 90 or 995
  const sanitized = sanitizeWhatsAppNumber(num);
  
  if (sanitized.startsWith("90")) {
    const raw = sanitized.substring(2);
    if (raw.length === 10) {
      return `+90 (${raw.substring(0, 3)}) ${raw.substring(3, 6)} ${raw.substring(6, 8)} ${raw.substring(8, 10)}`;
    }
  }
  
  if (sanitized.startsWith("995")) {
    const raw = sanitized.substring(3);
    if (raw.length === 9) {
      return `+995 (${raw.substring(0, 3)}) ${raw.substring(3, 5)} ${raw.substring(5, 7)} ${raw.substring(7, 9)}`;
    }
  }
  
  // Fallback to original string if formatting couldn't resolve
  return num;
}
