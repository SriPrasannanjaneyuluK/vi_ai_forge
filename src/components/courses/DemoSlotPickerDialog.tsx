import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, Users, X } from "lucide-react";
import type { CourseDetail, DemoSession } from "@/types/site";
import { btnPrimaryClass } from "@/components/layout/PageLayout";
import { formatDemoSessionDate, formatDemoSessionTime } from "@/lib/demoSessionFormat";
import { SPRING_GENTLE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type DemoSlotPickerDialogProps = {
  open: boolean;
  course: CourseDetail;
  sessions: DemoSession[];
  onClose: () => void;
  onSelectSession: (session: DemoSession) => void;
};

/** Lets visitors pick a demo slot without scrolling to the bottom of the course page. */
export function DemoSlotPickerDialog({
  open,
  course,
  sessions,
  onClose,
  onSelectSession,
}: DemoSlotPickerDialogProps) {
  const available = sessions.filter((s) => s.availableSeats > 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close slot picker"
            className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-slot-picker-title"
            data-scroll-lock-scrollable
            className="fixed inset-x-4 bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[70] w-auto sm:w-full sm:max-w-lg max-h-[min(85dvh,640px)] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl safe-pb"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={SPRING_GENTLE}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Book free demo
                </p>
                <h2 id="demo-slot-picker-title" className="text-xl font-bold text-foreground mt-1">
                  Choose a time slot
                </h2>
                <p className="text-sm text-muted mt-1">{course.title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-muted hover:bg-muted/10 shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-muted mb-5">
              Pick a slot that works for you — our tutor will walk you through the full course.
            </p>

            {available.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">
                All demo slots are currently full. Please check back soon or contact us.
              </p>
            ) : (
              <ul className="space-y-3">
                {available.map((session) => (
                  <li key={session.id}>
                    <button
                      type="button"
                      onClick={() => onSelectSession(session)}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-background/50 p-4 text-left hover:border-accent/40 hover:bg-accent/5 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Calendar size={16} className="text-accent shrink-0" />
                          {formatDemoSessionDate(session.startsAt)} ·{" "}
                          {formatDemoSessionTime(session.startsAt)}
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
                      <span className={cn(btnPrimaryClass, "shrink-0 sm:min-w-[7.5rem] justify-center")}>
                        Select
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
