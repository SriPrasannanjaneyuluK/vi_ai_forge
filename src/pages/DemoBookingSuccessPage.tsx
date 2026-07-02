import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, Hash, Mail, MessageCircle, User } from "lucide-react";
import { PageLayout, btnPrimaryClass } from "@/components/layout/PageLayout";
import { FadeIn } from "@/components/motion/FadeIn";
import type { DemoBookingResult } from "@/types/site";
import { EASE_OUT } from "@/lib/motion";

export function DemoBookingSuccessPage() {
  const location = useLocation();
  const booking = (location.state as { booking?: DemoBookingResult } | null)?.booking;

  if (!booking) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageLayout width="narrow">
      <FadeIn>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="text-center"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-secondary/15 text-accent-secondary mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Your demo class has been successfully booked
          </h1>
          <p className="text-4xl mt-4">🎉</p>
        </motion.div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-10 rounded-2xl border border-border bg-white p-6 sm:p-8 space-y-4">
          <DetailRow icon={<Hash size={16} />} label="Booking ID" value={booking.bookingRef} />
          <DetailRow icon={<Calendar size={16} />} label="Course" value={booking.courseName} />
          <DetailRow icon={<Calendar size={16} />} label="Date" value={booking.demoDate} />
          <DetailRow icon={<Clock size={16} />} label="Time" value={booking.demoTime} />
          <DetailRow icon={<User size={16} />} label="Instructor" value={booking.instructorName} />
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p className="mt-8 text-muted leading-relaxed text-center">
          Our tutor will contact you shortly to explain the complete course structure, fee details,
          projects, career opportunities, and answer all your questions.
        </p>

        <ul className="mt-6 space-y-2 text-sm text-foreground">
          {booking.notifications.emailSent && (
            <li className="flex items-center justify-center gap-2">
              <Mail size={16} className="text-accent" />
              Confirmation email sent
            </li>
          )}
          {booking.notifications.whatsAppSent ? (
            <li className="flex items-center justify-center gap-2">
              <MessageCircle size={16} className="text-accent-secondary" />
              WhatsApp notification sent
            </li>
          ) : (
            <li className="flex items-center justify-center gap-2 text-muted">
              <MessageCircle size={16} />
              WhatsApp reminders enabled for upcoming sessions
            </li>
          )}
        </ul>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className={btnPrimaryClass}>
            View Dashboard
          </Link>
          <Link
            to="/#courses"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-white transition-colors min-h-[2.75rem]"
          >
            Explore More Courses
          </Link>
        </div>
      </FadeIn>
    </PageLayout>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-accent mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
