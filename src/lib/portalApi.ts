const API_BASE = import.meta.env.VITE_API_URL ?? "";

export type UserRole = "admin" | "teacher" | "student" | "user";

export interface PortalUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  accessRevoked?: boolean;
}

export function fetchAuthUser(token: string) {
  return request<{ user: PortalUser }>("/api/auth/me", token);
}

export function portalSignIn(
  email: string,
  password: string,
  portal: "public" | "admin"
) {
  return requestWithoutAuth<{
    session: { access_token: string; refresh_token: string };
    user: PortalUser;
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, portal }),
  });
}

export function portalForgotPassword(email: string, redirectTo: string) {
  return requestWithoutAuth<{ ok: true }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email, portal: "public", redirectTo }),
  });
}

export function portalSignUp(input: {
  email: string;
  password: string;
  fullName: string;
  portalRole: "student" | "teacher";
}) {
  return requestWithoutAuth<{
    session: { access_token: string; refresh_token: string };
    user: PortalUser;
  }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

async function requestWithoutAuth<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.error === "string" ? body.error : "Request failed";

    if (path === "/api/auth/login") {
      throw new Error("Invalid email or password.");
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

async function request<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.error === "string" ? body.error : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
