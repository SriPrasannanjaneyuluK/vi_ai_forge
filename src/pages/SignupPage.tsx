import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GraduationCap, Loader2, UserPlus, Users } from "lucide-react";
import {
  usePortalAuth,
  isSupabaseConfigured,
  type PortalRole,
} from "@/context/PortalAuthContext";
import { toSignUpError } from "@/lib/authMessages";
import {
  validateEmail,
  validateFullName,
  validatePassword,
} from "@/lib/validation";
import { btnPrimaryClass } from "@/components/layout/PageLayout";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert, PasswordInput, TextInput } from "@/components/auth/AuthFields";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: {
  value: PortalRole;
  label: string;
  description: string;
  icon: typeof GraduationCap;
}[] = [
  {
    value: "student",
    label: "Student",
    description: "Learn courses and track your progress",
    icon: GraduationCap,
  },
  {
    value: "teacher",
    label: "Teacher",
    description: "Manage classes and support learners",
    icon: Users,
  },
];

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp, user, loading, isStudent, isTeacher } = usePortalAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [portalRole, setPortalRole] = useState<PortalRole>("student");
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

    const nameError = validateFullName(fullName);
    if (nameError) {
      setError(nameError);
      setSubmitting(false);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setSubmitting(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      await signUp({ email, password, fullName, portalRole });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(toSignUpError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join as a student or teacher and start your learning journey"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
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
        <div>
          <span className="text-sm font-medium text-foreground">I am joining as</span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => {
              const selected = portalRole === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPortalRole(value)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    selected
                      ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                      : "border-border hover:border-accent/30"
                  )}
                >
                  <Icon
                    size={18}
                    className={selected ? "text-accent" : "text-muted"}
                  />
                  <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-1 text-xs text-muted leading-snug">{description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <TextInput
          id="signup-name"
          label="Full name"
          value={fullName}
          onChange={setFullName}
          placeholder="Your name"
          autoComplete="name"
        />

        <TextInput
          id="signup-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <div>
          <PasswordInput
            id="signup-password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <PasswordStrength password={password} />
        </div>

        <PasswordInput
          id="signup-confirm"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        {error && <AuthAlert tone="error">{error}</AuthAlert>}

        <button
          type="submit"
          disabled={submitting || !isSupabaseConfigured}
          className={`w-full ${btnPrimaryClass}`}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Create account
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
