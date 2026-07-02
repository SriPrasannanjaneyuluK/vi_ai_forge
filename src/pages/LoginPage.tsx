import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import {
  usePortalAuth,
  isApiConfigured,
} from "@/context/PortalAuthContext";
import { toSignInError } from "@/lib/authMessages";
import { btnPrimaryClass } from "@/components/layout/PageLayout";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert, PasswordInput, TextInput } from "@/components/auth/AuthFields";

function isSafeRedirect(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, user, loading, isStudent, isTeacher } = usePortalAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect");
  const postAuthPath = useMemo(() => {
    if (redirectTo && isSafeRedirect(redirectTo)) return redirectTo;
    return "/dashboard";
  }, [redirectTo]);

  const hasPortalAccess = Boolean(user && (isStudent || isTeacher));

  if (!loading && hasPortalAccess) {
    return <Navigate to={postAuthPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate(postAuthPath, { replace: true });
    } catch (err) {
      setError(toSignInError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const signupHref = redirectTo
    ? `/signup?redirect=${encodeURIComponent(redirectTo)}&role=student`
    : "/signup";

  return (
    <AuthShell
      footer={
        <>
          New here?{" "}
          <Link to={signupHref} className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {!isApiConfigured && (
        <AuthAlert tone="info">
          Add VITE_API_URL to vi_ai_forge/.env
        </AuthAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={submitting || !isApiConfigured}
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
