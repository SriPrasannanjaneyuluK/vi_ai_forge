import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, Loader2, UserPlus, Users } from "lucide-react";
import {
  usePortalAuth,
  isApiConfigured,
  type PortalRole,
} from "@/context/PortalAuthContext";
import { toSignUpError } from "@/lib/authMessages";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from "@/lib/validation";
import { btnPrimaryClass } from "@/components/layout/PageLayout";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  AuthAlert,
  PasswordInput,
  RoleSelect,
  TextInput,
} from "@/components/auth/AuthFields";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

const ROLE_OPTIONS = [
  { value: "student" as const, label: "Student", icon: GraduationCap },
  { value: "teacher" as const, label: "Teacher", icon: Users },
];

function isSafeRedirect(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, user, loading, isStudent, isTeacher } = usePortalAuth();

  const redirectTo = searchParams.get("redirect");
  const presetRole = searchParams.get("role");
  const fromCourse = presetRole === "student" || Boolean(redirectTo?.includes("/courses/"));
  const hideRoleSelect = fromCourse;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [portalRole, setPortalRole] = useState<PortalRole>(
    presetRole === "teacher" ? "teacher" : "student"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const phoneError = validatePhone(phone);
    if (phoneError) {
      setError(phoneError);
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
      await signUp({
        email,
        password,
        fullName,
        phone,
        portalRole: hideRoleSelect ? "student" : portalRole,
      });
      navigate(postAuthPath, { replace: true });
    } catch (err) {
      setError(toSignUpError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";

  return (
    <AuthShell
      title={fromCourse ? "Book your free demo" : undefined}
      subtitle={
        fromCourse
          ? "Create a student account in under a minute — we'll bring you right back to your course."
          : undefined
      }
      footer={
        <>
          Already have an account?{" "}
          <Link to={loginHref} className="font-medium text-accent hover:underline">
            Sign in
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
        {!hideRoleSelect && (
          <RoleSelect
            label="I am joining as"
            value={portalRole}
            options={ROLE_OPTIONS}
            onChange={setPortalRole}
          />
        )}

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
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <TextInput
          id="signup-phone"
          label="Mobile number"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="10-digit mobile number"
          autoComplete="tel"
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
          disabled={submitting || !isApiConfigured}
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
              {fromCourse ? "Create account & continue" : "Create account"}
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
