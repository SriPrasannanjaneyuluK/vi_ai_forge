import { Users } from "lucide-react";
import { MY_LEARNING_LABEL } from "@/lib/constants";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PageCard } from "@/components/ui/PageCard";
import { PageHeader } from "@/components/ui/PageHeader";

export function TeacherDashboard() {
  const { user } = usePortalAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        title={MY_LEARNING_LABEL}
        subtitle={`Welcome back${user?.fullName ? `, ${user.fullName}` : ""}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PageCard>
          <Users className="text-accent-secondary mb-3" size={24} />
          <h2 className="font-semibold text-foreground">My classes</h2>
          <p className="text-sm text-muted mt-2">
            Courses you teach and student rosters will appear here.
          </p>
        </PageCard>
        <PageCard dashed>
          <p className="text-sm font-medium text-foreground">Coming soon</p>
          <p className="text-sm text-muted mt-2">
            Grading, announcements, and class analytics.
          </p>
        </PageCard>
      </div>
    </div>
  );
}
