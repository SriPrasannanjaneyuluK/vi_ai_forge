import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import { submitWaitlist } from "@/lib/api";
import { EASE_OUT } from "@/lib/motion";
import { MagneticButton } from "@/components/motion/MagneticButton";

const cta = SECTIONS.cta;

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px", amount: 0.15 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitWaitlist(email.trim());
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl safe-px lg:px-8">
        <motion.div
          ref={ref}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-background to-accent-secondary/10 border border-border/50 p-10 sm:p-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden
          />

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {cta.title}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            {cta.subtitle}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={cta.emailPlaceholder}
              required
              disabled={submitting}
              className="w-full sm:flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow disabled:opacity-60"
            />
            <MagneticButton variant="primary" type="submit" disabled={submitting}>
              <span className="flex items-center gap-2">
                {submitting ? "Joining…" : cta.submitLabel}
                <Send size={14} />
              </span>
            </MagneticButton>
          </form>

          <AnimatePresence>
            {submitted && (
              <motion.p
                className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-accent-secondary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={16} />
                {cta.successMessage}
              </motion.p>
            )}
            {error && (
              <motion.p
                className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-red-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
