import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchAuthUser, portalForgotPassword, portalSignIn, portalSignUp, type PortalUser } from "@/lib/portalApi";
import { ACCESS_REVOKED, INVALID_CREDENTIALS } from "@/lib/authMessages";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const signInInProgress = useRef(false);

  const fetchProfile = async (token: string) => {
    const { user: profile } = await fetchAuthUser(token);
    return profile;
  };

  const applyPortalSession = async (token: string, profile: PortalUser) => {
    if (profile.accessRevoked) {
      if (supabase) await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      throw new Error(ACCESS_REVOKED);
    }

    if (!isPortalRole(profile.role)) {
      if (supabase) await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      return false;
    }

    setUser(profile);
    setAccessToken(token);
    return true;
  };

  const restoreSession = async (token: string) => {
    try {
      const profile = await fetchProfile(token);
      await applyPortalSession(token, profile);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    client.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      const token = data.session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }
      await restoreSession(token);
      if (!cancelled) setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      if (signInInProgress.current) return;

      const token = session?.access_token;
      if (!token) {
        setUser(null);
        setAccessToken(null);
        return;
      }

      await restoreSession(token);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase is not configured");

    signInInProgress.current = true;
    try {
      const { session, user: profile } = await portalSignIn(email, password, "public");

      const { error } = await supabase.auth.setSession(session);
      if (error) throw new Error(INVALID_CREDENTIALS);

      setUser(profile);
      setAccessToken(session.access_token);
      return profile;
    } finally {
      signInInProgress.current = false;
    }
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
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
    if (!supabase) throw new Error("Supabase is not configured");

    signInInProgress.current = true;
    try {
      const { session, user: profile } = await portalSignUp({
        email,
        password,
        fullName,
        portalRole,
      });

      const { error } = await supabase.auth.setSession(session);
      if (error) throw new Error(INVALID_CREDENTIALS);

      setUser(profile);
      setAccessToken(session.access_token);
      return profile;
    } finally {
      signInInProgress.current = false;
    }
  };

  const resetPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/login`;
    await portalForgotPassword(email, redirectTo);
  };

  const updateProfile = async (fullName: string) => {
    if (!supabase || !accessToken) {
      throw new Error("You must be signed in to update your profile.");
    }

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (error) throw error;

    const { user: profile } = await fetchAuthUser(accessToken);
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

export { isSupabaseConfigured };
