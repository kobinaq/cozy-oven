const ALLOWED_PAYMENT_HOSTS = new Set([
  "checkout.paystack.com",
  "paystack.com",
  "www.paystack.com",
  "standard.paystack.co",
]);

export function isAllowedPaymentRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (ALLOWED_PAYMENT_HOSTS.has(host)) return true;
    return host.endsWith(".paystack.com") || host.endsWith(".paystack.co");
  } catch {
    return false;
  }
}
