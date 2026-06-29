import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import {
  usePortalAuth,
  isSupabaseConfigured,
} from "@/context/PortalAuthContext";
import { toSignInError } from "@/lib/authMessages";
import { btnPrimaryClass } from "@/components/layout/PageLayout";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert, PasswordInput, TextInput } from "@/components/auth/AuthFields";
import { STATIC_SITE } from "@/lib/staticSite";

export function LoginPage() {
  const { signIn, user, loading, isStudent, isTeacher } = usePortalAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPortalAccess = Boolean(user && (isStudent || isTeacher));

  if (!loading && hasPortalAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(toSignInError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle={`Sign in to continue learning with ${STATIC_SITE.name}`}
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {!isSupabaseConfigured && (
        <AuthAlert tone="info">
          Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to vi_ai_forge/.env
        </AuthAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <div>
          <PasswordInput
            id="login-password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-accent hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <AuthAlert tone="error">{error}</AuthAlert>}

        <button
          type="submit"
          disabled={submitting || !isSupabaseConfigured}
          className={`w-full ${btnPrimaryClass}`}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn size={16} />
              Sign in
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
