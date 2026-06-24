export const GUEST_ORDER_PROFILE_KEY = "cozyoven_guest_order_profile";

export interface GuestOrderProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  orderId?: string;
}

export function saveGuestOrderProfile(profile: GuestOrderProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_ORDER_PROFILE_KEY, JSON.stringify(profile));
}

export function getGuestOrderProfile(): GuestOrderProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(GUEST_ORDER_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestOrderProfile;
  } catch {
    return null;
  }
}

export function clearGuestOrderProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_ORDER_PROFILE_KEY);
}
