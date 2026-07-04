import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  Star,
  Users,
  Video,
} from "lucide-react";
import { PageLayout, btnPrimaryClass } from "@/components/layout/PageLayout";
import { CurriculumAccordion } from "@/components/courses/CurriculumAccordion";
import { DemoBookingDialog } from "@/components/courses/DemoBookingDialog";
import { DemoSlotPickerDialog } from "@/components/courses/DemoSlotPickerDialog";
import { FadeIn } from "@/components/motion/FadeIn";
import { bookDemoSession, fetchCourseDetail } from "@/lib/api";
import { formatDemoSessionDate, formatDemoSessionTime } from "@/lib/demoSessionFormat";
import {
  buildLoginUrl,
  buildSignupUrl,
  clearPendingDemo,
  readPendingDemo,
  savePendingDemo,
} from "@/lib/bookingIntent";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CourseDetail, DemoSession } from "@/types/site";
import { usePortalAuth } from "@/context/PortalAuthContext";

const formatSessionDate = formatDemoSessionDate;
const formatSessionTime = formatDemoSessionTime;

function formatFee(amount: number, currency: string) {
  if (!amount) return "Discuss during demo";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CourseDetailPage() {
  const { slug = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, accessToken, isStudent, isTeacher } = usePortalAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [slotPickerOpen, setSlotPickerOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<DemoSession | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [highlightDemos, setHighlightDemos] = useState(false);

  const bookDemoParam = searchParams.get("bookDemo");

  const loadCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { course: data } = await fetchCourseDetail(slug);
      setCourse(data);
    } catch {
      setError("Course not found or unavailable.");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const openBookingDialog = useCallback(
    (session: DemoSession) => {
      setSelectedSession(session);
      setBookingError(null);
      setDialogOpen(true);
    },
    []
  );

  const handleBookDemo = useCallback(
    (session: DemoSession) => {
      if (authLoading) return;

      if (!user || !isStudent) {
        if (user && isTeacher) {
          setBookingError("Teachers cannot book student demos. Sign in with a student account.");
          return;
        }
        savePendingDemo({ courseSlug: slug, demoSessionId: session.id });
        navigate(buildSignupUrl(slug, session.id));
        return;
      }

      openBookingDialog(session);
    },
    [authLoading, user, isStudent, isTeacher, slug, navigate, openBookingDialog]
  );

  // Reopen dialog after signup redirect
  useEffect(() => {
    if (!course || authLoading || !user || !isStudent) return;

    const pending = readPendingDemo();
    const demoId = bookDemoParam
      ? Number(bookDemoParam)
      : pending?.courseSlug === slug
        ? pending.demoSessionId
        : null;

    if (!demoId) return;

    const session = course.demoSessions.find((s) => s.id === demoId);
    if (session && session.availableSeats > 0) {
      openBookingDialog(session);
      clearPendingDemo();
      if (bookDemoParam) {
        setSearchParams({}, { replace: true });
      }
    }
  }, [
    course,
    authLoading,
    user,
    isStudent,
    bookDemoParam,
    slug,
    openBookingDialog,
    setSearchParams,
  ]);

  const handleBookFreeDemo = useCallback(() => {
    if (!course) return;

    const available = course.demoSessions.filter((s) => s.availableSeats > 0);
    if (available.length > 0) {
      setStatusMessage(null);
      setBookingError(null);
      setSlotPickerOpen(true);
      return;
    }

    if (course.demoSessions.length > 0) {
      setStatusMessage("All demo slots are full right now. Try again later or contact us.");
      setHighlightDemos(true);
      document.getElementById("demo-sessions")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => setHighlightDemos(false), 3000);
      return;
    }

    setStatusMessage("Demo slots are loading — pick one below when they appear.");
    setHighlightDemos(true);
    document.getElementById("demo-sessions")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setHighlightDemos(false), 3000);
  }, [course]);

  const handleSlotSelected = useCallback(
    (session: DemoSession) => {
      setSlotPickerOpen(false);
      handleBookDemo(session);
    },
    [handleBookDemo]
  );

  const handleConfirmBooking = async () => {
    if (!selectedSession || !accessToken) return;
    setConfirming(true);
    setBookingError(null);
    try {
      const { booking } = await bookDemoSession(accessToken, selectedSession.id);
      setDialogOpen(false);
      clearPendingDemo();
      setBookingError(null);
      navigate("/demo/success", { state: { booking }, replace: true });
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed.");
      setDialogOpen(true);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-32 text-muted">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading course…
        </div>
      </PageLayout>
    );
  }

  if (error || !course) {
    return (
      <PageLayout width="narrow">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
          <p className="text-muted mt-2">{error}</p>
          <Link to="/#courses" className={`mt-6 inline-flex ${btnPrimaryClass}`}>
            Explore courses
          </Link>
        </div>
      </PageLayout>
    );
  }

  const nextDemo = course.demoSessions[0];

  const heroImage = course.bannerUrl || course.cardImageUrl;

  return (
    <PageLayout>
      {(statusMessage || bookingError) && (
        <div
          className={cn(
            "mb-6 rounded-xl border px-4 py-3 text-sm",
            bookingError
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-accent/20 bg-accent/5 text-foreground"
          )}
          role="status"
        >
          {bookingError ?? statusMessage}
        </div>
      )}

      {/* Hero — compact content section; banner image is a subtle background only, not a large block */}
      <section
        className="relative overflow-hidden rounded-3xl border border-border mb-16 bg-slate-900"
        style={
          heroImage
            ? {
                backgroundImage: `linear-gradient(to right, rgb(15 23 42 / 0.94), rgb(15 23 42 / 0.88)), url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_55%)]" />
        <div className="relative grid lg:grid-cols-2 gap-8 p-8 sm:p-10 lg:p-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              {course.tag}
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {course.title}
            </h1>
            <p className="mt-3 text-lg text-white/80">{course.tagline}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Badge>{course.level}</Badge>
              <Badge icon={<Clock size={14} />}>{course.duration}</Badge>
              <Badge icon={<Video size={14} />}>{course.mode}</Badge>
              {course.hasCertificate && <Badge icon={<Award size={14} />}>Certificate</Badge>}
              {course.hasPlacementAssistance && (
                <Badge icon={<Briefcase size={14} />}>Placement assistance</Badge>
              )}
              {course.rating != null && (
                <Badge icon={<Star size={14} className="text-amber-500" />}>
                  {course.rating.toFixed(1)} rating
                </Badge>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className={btnPrimaryClass}
                onClick={handleBookFreeDemo}
              >
                Book Free Demo
              </button>
              <a
                href="#curriculum"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors min-h-[2.75rem]"
              >
                View curriculum
              </a>
            </div>
          </div>

          <div className="lg:self-center">
            <div className="rounded-2xl bg-white/95 backdrop-blur border border-white/20 p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                Your instructor
              </p>
              <h3 className="text-xl font-bold text-foreground">{course.instructor.name}</h3>
              <p className="text-sm text-accent font-medium mt-1">{course.instructor.title}</p>
              <p className="text-sm text-muted mt-3 leading-relaxed">{course.instructor.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <Section title="Course overview" subtitle="What you'll learn and who this is for">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">What you will learn</h3>
            <p className="text-muted leading-relaxed">{course.overview}</p>
            {course.outcomes.length > 0 && (
              <ul className="mt-5 space-y-2">
                {course.outcomes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-foreground">
                    <CheckCircle2 size={16} className="text-accent-secondary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-6">
            <InfoBlock title="Who is this for?" text={course.audience} />
            <InfoBlock title="Prerequisites" text={course.prerequisites} />
            {course.technologies.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Technologies covered</h3>
                <div className="flex flex-wrap gap-2">
                  {course.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Curriculum */}
      <Section id="curriculum" title="Curriculum" subtitle="Week-by-week learning path">
        <CurriculumAccordion weeks={course.curriculum} />
      </Section>

      {/* Projects */}
      {course.projects.length > 0 && (
        <Section title="Projects" subtitle="Build a portfolio employers notice">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.projects.map((project) => (
              <motion.div
                key={project.title}
                className="rounded-2xl border border-border bg-white p-6 hover:shadow-lg transition-shadow"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <GraduationCap className="text-accent mb-3" size={22} />
                <h3 className="font-semibold text-foreground">{project.title}</h3>
                <p className="text-sm text-muted mt-2">{project.description}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Careers */}
      {course.careers.length > 0 && (
        <Section title="Career opportunities" subtitle="Paths you can pursue after completion">
          <div className="grid sm:grid-cols-2 gap-6">
            {course.careers.map((career) => (
              <div key={career.title} className="rounded-2xl border border-border bg-white p-6">
                <Briefcase className="text-accent-secondary mb-3" size={22} />
                <h3 className="font-semibold text-foreground">{career.title}</h3>
                <p className="text-sm text-muted mt-2">{career.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Fee */}
      <Section
        title="Fee structure"
        subtitle={
          course.showFeeStructure !== false
            ? "Flexible options — full details shared in your demo"
            : "Personal guidance on pricing"
        }
      >
        {course.showFeeStructure !== false && course.feeStructure ? (
          <div className="rounded-2xl border border-border bg-white p-8 max-w-xl">
            <p className="text-sm text-muted uppercase tracking-wider font-semibold">
              {course.feeStructure.type === "emi" ? "Monthly EMI" : "One-time fee"}
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {formatFee(course.feeStructure.amount, course.feeStructure.currency)}
            </p>
            {course.feeStructure.emi && (
              <p className="text-sm text-muted mt-2">
                Or {formatFee(course.feeStructure.emi.monthly, course.feeStructure.currency)}
                /month × {course.feeStructure.emi.months} months
              </p>
            )}
            {course.feeStructure.discount && (
              <p className="text-sm text-accent-secondary font-medium mt-4">
                {course.feeStructure.discount}
              </p>
            )}
            {course.feeStructure.scholarship && (
              <p className="text-sm text-muted mt-2">{course.feeStructure.scholarship}</p>
            )}
          </div>
        ) : (
          <p className="text-base text-muted leading-relaxed max-w-2xl">
            Book a free demo — our tutor will personally explain the course structure and fee options.
          </p>
        )}
      </Section>

      {/* Demo sessions */}
      <Section
        id="demo-sessions"
        title="Free demo classes"
        subtitle="Pick a slot — our tutor will walk you through everything"
      >
        <div
          className={cn(
            "rounded-2xl transition-shadow",
            highlightDemos && "ring-2 ring-accent ring-offset-2"
          )}
        >
        {course.demoSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <p className="text-foreground font-medium">Demo slots are being scheduled</p>
            <p className="text-sm text-muted mt-2 max-w-md mx-auto">
              Refresh this page in a moment, or contact us and we will book a demo for you personally.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" className={btnPrimaryClass} onClick={() => loadCourse()}>
                Refresh slots
              </button>
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-white transition-colors min-h-[2.75rem]"
              >
                Contact us
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {course.demoSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar size={16} className="text-accent" />
                    {formatSessionDate(session.startsAt)} · {formatSessionTime(session.startsAt)}
                  </p>
                  <p className="text-sm text-muted flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {session.mode === "online" ? "Online" : "Offline"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {session.availableSeats} seats left
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  disabled={session.availableSeats === 0}
                  className={cn(
                    btnPrimaryClass,
                    "shrink-0",
                    session.availableSeats === 0 && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => handleBookDemo(session)}
                >
                  {session.availableSeats === 0 ? "Full" : "Book Demo"}
                </button>
              </div>
            ))}
          </div>
        )}
        </div>

        {!user && !authLoading && course.demoSessions.length > 0 && (
          <p className="text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link
              to={nextDemo ? buildLoginUrl(slug, nextDemo.id) : `/login?redirect=${encodeURIComponent(`/courses/${slug}`)}`}
              className="text-accent font-medium hover:underline"
            >
              Sign in to book faster
            </Link>
          </p>
        )}
      </Section>

      <DemoSlotPickerDialog
        open={slotPickerOpen}
        course={course}
        sessions={course.demoSessions}
        onClose={() => setSlotPickerOpen(false)}
        onSelectSession={handleSlotSelected}
      />

      <DemoBookingDialog
        open={dialogOpen}
        course={course}
        session={selectedSession}
        confirming={confirming}
        error={bookingError}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </PageLayout>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-28">
      <FadeIn>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-muted mt-2 mb-8">{subtitle}</p>
      </FadeIn>
      <FadeIn delay={0.05}>{children}</FadeIn>
    </section>
  );
}

function Badge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-3 py-1 text-foreground">
      {icon}
      {children}
    </span>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  );
}
