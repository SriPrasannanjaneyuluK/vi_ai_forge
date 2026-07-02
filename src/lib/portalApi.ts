import {
  apiFetch,
  isApiConfigured,
  refreshAccessToken,
  setAccessToken,
} from "@/lib/authSession";

export type UserRole = "admin" | "teacher" | "student" | "user";

export interface PortalUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  accessRevoked?: boolean;
}

export { isApiConfigured };

export function fetchAuthUser(token: string) {
  return request<{ user: PortalUser }>("/api/auth/me", token);
}

export function portalSignIn(
  email: string,
  password: string,
  portal: "public" | "admin"
) {
  return requestWithoutAuth<{
    access_token: string;
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
  phone: string;
  portalRole: "student" | "teacher";
}) {
  return requestWithoutAuth<{
    access_token: string;
    user: PortalUser;
  }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function portalLogout() {
  return requestWithoutAuth<{ ok: true }>("/api/auth/logout", {
    method: "POST",
  });
}

export function portalUpdateProfile(token: string, fullName: string) {
  return request<{ user: PortalUser }>("/api/auth/me", token, {
    method: "PATCH",
    body: JSON.stringify({ fullName }),
  });
}

export { refreshAccessToken, setAccessToken };

async function requestWithoutAuth<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_API_URL ?? ""}${path}`, {
    ...init,
    credentials: "include",
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

async function request<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> {
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
