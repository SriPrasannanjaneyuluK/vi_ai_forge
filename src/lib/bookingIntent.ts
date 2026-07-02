const KEY = "vj_pending_demo";

export type PendingDemoBooking = {
  courseSlug: string;
  demoSessionId: number;
};

export function savePendingDemo(booking: PendingDemoBooking) {
  sessionStorage.setItem(KEY, JSON.stringify(booking));
}

export function readPendingDemo(): PendingDemoBooking | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingDemoBooking;
    if (!parsed.courseSlug || !parsed.demoSessionId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingDemo() {
  sessionStorage.removeItem(KEY);
}

export function buildSignupUrl(courseSlug: string, demoSessionId: number) {
  const redirect = `/courses/${courseSlug}?bookDemo=${demoSessionId}`;
  return `/signup?role=student&redirect=${encodeURIComponent(redirect)}`;
}

export function buildLoginUrl(courseSlug: string, demoSessionId: number) {
  const redirect = `/courses/${courseSlug}?bookDemo=${demoSessionId}`;
  return `/login?redirect=${encodeURIComponent(redirect)}`;
}
