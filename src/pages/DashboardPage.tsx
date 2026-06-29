import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { PageLayout, btnPrimaryClass } from "@/components/layout/PageLayout";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { PageCard } from "@/components/ui/PageCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { MY_LEARNING_LABEL } from "@/lib/constants";

export function DashboardPage() {
  const { user, loading, isTeacher, isStudent } = usePortalAuth();

  if (loading) {
    return (
      <PageLayout>
        <p className="text-sm text-muted">Loading…</p>
      </PageLayout>
    );
  }

  if (!user || (!isStudent && !isTeacher)) {
    return (
      <PageLayout>
        <PageHeader
          title={MY_LEARNING_LABEL}
          subtitle="Sign in to view your enrolled courses, progress, and learning paths."
        />
        <PageCard className="text-center py-12">
          <BookOpen className="mx-auto text-accent mb-4" size={36} />
          <p className="font-medium text-foreground">Your learning hub awaits</p>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Create an account or sign in to access your courses, track progress, and
            continue where you left off.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className={btnPrimaryClass}>
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
            >
              Enroll now
            </Link>
          </div>
        </PageCard>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {isTeacher ? <TeacherDashboard /> : <StudentDashboard />}
    </PageLayout>
  );
}
