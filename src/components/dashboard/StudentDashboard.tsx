import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  Loader2,
  Video,
} from "lucide-react";
import { MY_LEARNING_LABEL } from "@/lib/constants";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PageCard } from "@/components/ui/PageCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { fetchMyDemoBookings } from "@/lib/api";
import type { StudentDemoBooking } from "@/types/site";
import { btnPrimaryClass } from "@/components/layout/PageLayout";

export function StudentDashboard() {
  const { user, accessToken } = usePortalAuth();
  const [demos, setDemos] = useState<StudentDemoBooking[]>([]);
  const [loadingDemos, setLoadingDemos] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoadingDemos(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { bookings } = await fetchMyDemoBookings(accessToken);
        if (!cancelled) {
          const upcoming = bookings
            .filter((b) => new Date(b.startsAt).getTime() > Date.now())
            .sort(
              (a, b) =>
                new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
            );
          setDemos(upcoming);
        }
      } catch {
        if (!cancelled) setDemos([]);
      } finally {
        if (!cancelled) setLoadingDemos(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={MY_LEARNING_LABEL}
        subtitle={`Welcome back${user?.fullName ? `, ${user.fullName}` : ""}`}
      />

      <PageCard>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Video className="text-accent" size={22} />
            <h2 className="font-semibold text-foreground">Upcoming demo</h2>
          </div>
          <Link to="/#courses" className="text-sm font-medium text-accent hover:underline">
            Explore courses
          </Link>
        </div>

        {loadingDemos ? (
          <div className="flex items-center gap-2 text-sm text-muted py-4">
            <Loader2 size={16} className="animate-spin" />
            Loading your bookings…
          </div>
        ) : demos.length === 0 ? (
          <p className="text-sm text-muted">
            No upcoming demos yet.{" "}
            <Link to="/#courses" className="text-accent font-medium hover:underline">
              Book a free demo
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {demos.map((demo) => (
              <div
                key={demo.bookingRef}
                className="rounded-xl border border-border bg-background/50 p-4"
              >
                <p className="font-semibold text-foreground">{demo.courseName}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {demo.demoDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {demo.demoTime}
                  </span>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent capitalize">
                    {demo.status}
                  </span>
                </div>
                {demo.joinLink ? (
                  <a
                    href={demo.joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 inline-flex ${btnPrimaryClass}`}
                  >
                    Join session
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <p className="mt-3 text-xs text-muted">
                    Join link will appear 30 minutes before the session.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </PageCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PageCard>
          <GraduationCap className="text-accent mb-3" size={24} />
          <h2 className="font-semibold text-foreground">My courses</h2>
          <p className="text-sm text-muted mt-2">
            Enrolled courses and progress will appear here after you complete enrollment.
          </p>
        </PageCard>
        <PageCard dashed>
          <p className="text-sm font-medium text-foreground">Coming soon</p>
          <p className="text-sm text-muted mt-2">
            Assignments, certificates, and learning paths.
          </p>
        </PageCard>
      </div>
    </div>
  );
}
