import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  fetchAuthUser,
  isApiConfigured,
  portalForgotPassword,
  portalLogout,
  portalSignIn,
  portalSignUp,
  portalUpdateProfile,
  refreshAccessToken,
  setAccessToken,
  type PortalUser,
} from "@/lib/portalApi";
import { ACCESS_REVOKED } from "@/lib/authMessages";

function isPortalRole(role: PortalUser["role"]) {
  return role === "student" || role === "teacher" || role === "user";
}

export type PortalRole = "student" | "teacher";

interface PortalAuthContextValue {
  user: PortalUser | null;
  loading: boolean;
  accessToken: string | null;
  isStudent: boolean;
  isTeacher: boolean;
  signIn: (email: string, password: string) => Promise<PortalUser>;
  signUp: (input: {
    email: string;
    password: string;
    fullName: string;
    portalRole: PortalRole;
  }) => Promise<PortalUser>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    const { user: profile } = await fetchAuthUser(token);
    return profile;
  };

  const applyPortalSession = async (token: string, profile: PortalUser) => {
    if (profile.accessRevoked) {
      await portalLogout().catch(() => undefined);
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
      throw new Error(ACCESS_REVOKED);
    }

    if (!isPortalRole(profile.role)) {
      await portalLogout().catch(() => undefined);
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
      return false;
    }

    setAccessToken(token);
    setAccessTokenState(token);
    setUser(profile);
    return true;
  };

  const restoreSession = async (token: string) => {
    try {
      const profile = await fetchProfile(token);
      await applyPortalSession(token, profile);
    } catch {
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
    }
  };

  useEffect(() => {
    if (!isApiConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const token = await refreshAccessToken();
      if (cancelled) return;

      if (!token) {
        setLoading(false);
        return;
      }

      await restoreSession(token);
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isApiConfigured) throw new Error("API is not configured");

    const { access_token, user: profile } = await portalSignIn(email, password, "public");
    setAccessToken(access_token);
    setAccessTokenState(access_token);
    setUser(profile);
    return profile;
  };

  const signOut = async () => {
    await portalLogout().catch(() => undefined);
    setAccessToken(null);
    setAccessTokenState(null);
    setUser(null);
  };

  const signUp = async ({
    email,
    password,
    fullName,
    portalRole,
  }: {
    email: string;
    password: string;
    fullName: string;
    portalRole: PortalRole;
  }) => {
    if (!isApiConfigured) throw new Error("API is not configured");

    const { access_token, user: profile } = await portalSignUp({
      email,
      password,
      fullName,
      portalRole,
    });

    setAccessToken(access_token);
    setAccessTokenState(access_token);
    setUser(profile);
    return profile;
  };

  const resetPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/login`;
    await portalForgotPassword(email, redirectTo);
  };

  const updateProfile = async (fullName: string) => {
    if (!accessToken) {
      throw new Error("You must be signed in to update your profile.");
    }

    const { user: profile } = await portalUpdateProfile(accessToken, fullName);
    setUser(profile);
  };

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student" || user?.role === "user";

  return (
    <PortalAuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        isStudent,
        isTeacher,
        signIn,
        signUp,
        resetPassword,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const context = useContext(PortalAuthContext);
  if (!context) {
    throw new Error("usePortalAuth must be used within PortalAuthProvider");
  }
  return context;
}

export { isApiConfigured };
