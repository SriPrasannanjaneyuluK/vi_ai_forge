import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Loader2, MapPin, User, Users, X } from "lucide-react";
import type { CourseDetail, DemoSession } from "@/types/site";
import { btnPrimaryClass } from "@/components/layout/PageLayout";
import { SPRING_GENTLE } from "@/lib/motion";

type DemoBookingDialogProps = {
  open: boolean;
  course: CourseDetail;
  session: DemoSession | null;
  confirming: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function DemoBookingDialog({
  open,
  course,
  session,
  confirming,
  error,
  onClose,
  onConfirm,
}: DemoBookingDialogProps) {
  if (!session) return null;

  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(session.startsAt));

  const timeLabel = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(session.startsAt));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close booking dialog"
            className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-booking-title"
            className="fixed inset-x-4 bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[70] w-auto sm:w-full sm:max-w-md rounded-2xl bg-white p-6 shadow-2xl safe-pb"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={SPRING_GENTLE}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Confirm demo booking
                </p>
                <h2 id="demo-booking-title" className="text-xl font-bold text-foreground mt-1">
                  {course.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-muted hover:bg-muted/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-foreground">
                <Calendar size={16} className="text-accent shrink-0" />
                {dateLabel}
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Clock size={16} className="text-accent shrink-0" />
                {timeLabel} · {session.durationMinutes} min
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <User size={16} className="text-accent shrink-0" />
                {session.instructorName}
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <MapPin size={16} className="text-accent shrink-0" />
                {session.mode === "online" ? "Online (Live)" : "In-person"}
              </li>
              <li className="flex items-center gap-3 text-muted">
                <Users size={16} className="text-accent shrink-0" />
                {session.availableSeats} seats available
              </li>
            </ul>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={confirming}
              onClick={onConfirm}
              className={`w-full mt-6 ${btnPrimaryClass}`}
            >
              {confirming ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Confirming…
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
