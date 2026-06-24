import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { ACADEMY } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-background to-accent-secondary/10 border border-border/50 p-10 sm:p-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden
          />

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Your playground is ready
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Join the waitlist and be the first to access labs, community, and
            courses at {ACADEMY.name}.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full sm:flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
            />
            <MagneticButton variant="primary" type="submit">
              <span className="flex items-center gap-2">
                Join Waitlist
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
                You&apos;re on the list! We&apos;ll be in touch soon.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
