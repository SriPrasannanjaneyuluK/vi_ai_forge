import { Bell, Shield } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageCard } from "@/components/ui/PageCard";
import { PageHeader } from "@/components/ui/PageHeader";

export function SettingsPage() {
  return (
    <PageLayout width="narrow">
      <PageHeader title="Settings" subtitle="Manage your account preferences." />

      <PageCard className="divide-y divide-border p-0 overflow-hidden">
        <div className="flex items-start gap-4 p-6">
          <Bell className="text-accent mt-0.5 shrink-0" size={20} />
          <div>
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted mt-1">
              Email updates for course announcements and progress reminders.
            </p>
            <p className="text-xs text-muted mt-3">Coming soon</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6">
          <Shield className="text-accent mt-0.5 shrink-0" size={20} />
          <div>
            <h2 className="font-semibold text-foreground">Security</h2>
            <p className="text-sm text-muted mt-1">
              Change your password from the forgot-password flow on the sign-in page.
            </p>
          </div>
        </div>
      </PageCard>
    </PageLayout>
  );
}
