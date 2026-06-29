import type { PublicCoursesData } from "@/types/site";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.error === "string" ? body.error : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/** Published courses and featured course — admin-managed in database */
export function fetchPublicCourses() {
  return request<PublicCoursesData>("/api/content");
}

export function submitWaitlist(email: string) {
  return request<{ ok: boolean; message: string }>("/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function submitContact(input: { name: string; email: string; message: string }) {
  return request<{ ok: boolean; message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
