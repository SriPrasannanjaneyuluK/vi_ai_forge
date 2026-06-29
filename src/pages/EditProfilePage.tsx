import { useState } from "react";
import { Loader2 } from "lucide-react";
import { btnPrimaryClass, PageLayout } from "@/components/layout/PageLayout";
import { AuthAlert, TextInput } from "@/components/auth/AuthFields";
import { PageCard } from "@/components/ui/PageCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { validateFullName } from "@/lib/validation";

export function EditProfilePage() {
  const { user, updateProfile } = usePortalAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const nameError = validateFullName(fullName);
    if (nameError) {
      setError(nameError);
      setSubmitting(false);
      return;
    }

    try {
      await updateProfile(fullName.trim());
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout width="narrow">
      <PageHeader
        title="Edit profile"
        subtitle="Update how your name appears across the portal."
      />

      <PageCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="text-sm font-medium text-foreground">Email</span>
            <p className="mt-1.5 rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-sm text-muted">
              {user?.email}
            </p>
            <p className="mt-1.5 text-xs text-muted">
              Email cannot be changed here. Contact support if you need help.
            </p>
          </div>

          <TextInput
            id="profile-name"
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Your name"
            autoComplete="name"
          />

          {error && <AuthAlert tone="error">{error}</AuthAlert>}
          {success && <AuthAlert tone="success">Profile updated successfully.</AuthAlert>}

          <button type="submit" disabled={submitting} className={btnPrimaryClass}>
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </form>
      </PageCard>
    </PageLayout>
  );
}
