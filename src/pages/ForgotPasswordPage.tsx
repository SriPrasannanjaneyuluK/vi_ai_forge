import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import {
  usePortalAuth,
  isApiConfigured,
} from "@/context/PortalAuthContext";
import { ACCOUNT_NOT_FOUND, RESET_EMAIL_SENT } from "@/lib/authMessages";
import { AuthAlert, TextInput } from "@/components/auth/AuthFields";
import { btnPrimaryClass, PageLayout } from "@/components/layout/PageLayout";
import { PageCard } from "@/components/ui/PageCard";
import { PageHeader } from "@/components/ui/PageHeader";

export function ForgotPasswordPage() {
  const { resetPassword } = usePortalAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : ACCOUNT_NOT_FOUND);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout width="auth">
      <PageHeader
        title="Reset your password"
        subtitle="Enter your email and we'll send you instructions to choose a new password."
      />

      <PageCard padding="lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
          <Mail size={22} />
        </div>

        {sent ? (
          <div className="space-y-5">
            <AuthAlert tone="success">{RESET_EMAIL_SENT}</AuthAlert>
            <Link to="/login" className={`block w-full text-center ${btnPrimaryClass}`}>
              Return to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isApiConfigured && (
              <AuthAlert tone="info">
                Add VITE_API_URL to vi_ai_forge/.env
              </AuthAlert>
            )}

            <TextInput
              id="reset-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
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
                  Sending…
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        )}
      </PageCard>

      <p className="mt-6 text-center text-sm text-muted">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </PageLayout>
  );
}
