import type {
  CourseDetail,
  DemoBookingResult,
  PublicCoursesData,
  StudentDemoBooking,
} from "@/types/site";
import { apiFetch } from "@/lib/authSession";

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

async function authRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(
    path,
    {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    },
    token
  );

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

export function fetchCourseDetail(slug: string) {
  return request<{ course: CourseDetail }>(`/api/content/courses/${slug}`);
}

export function bookDemoSession(token: string, demoSessionId: number) {
  return authRequest<{ booking: DemoBookingResult }>(
    "/api/demo-bookings",
    token,
    {
      method: "POST",
      body: JSON.stringify({ demoSessionId }),
    }
  );
}

export function fetchMyDemoBookings(token: string) {
  return authRequest<{ bookings: StudentDemoBooking[] }>(
    "/api/demo-bookings/me",
    token
  );
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
