import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  FlaskConical,
  ClipboardCheck,
  X,
} from "lucide-react";
import { PRACTICE_FEATURES } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  FadeInStagger,
  FadeInItem,
  SectionHeading,
} from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";

const ICON_MAP = {
  "message-circle": MessageCircle,
  "flask-conical": FlaskConical,
  "clipboard-check": ClipboardCheck,
};

export function Practice() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="practice" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Learn & Practice"
          title="Understand by doing"
          subtitle="Doubts, labs, and mock tests — everything you need to learn deeply and ship confidently."
        />

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRACTICE_FEATURES.map((feature) => {
            const Icon = ICON_MAP[feature.icon];
            const isLarge = feature.size === "large";

            return (
              <FadeInItem
                key={feature.id}
                className={cn(isLarge && "md:col-span-2")}
              >
                <motion.div
                  className={cn(
                    "group relative bg-card rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-shadow h-full",
                    isLarge ? "md:p-10" : "p-8"
                  )}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-secondary/10 text-accent-secondary mb-6"
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon size={26} />
                  </motion.div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-muted leading-relaxed mb-6 max-w-lg">
                    {feature.description}
                  </p>

                  <MagneticButton
                    variant={feature.cta === "Try Sample" ? "primary" : "secondary"}
                    onClick={() => {
                      if (feature.cta === "Try Sample") setModalOpen(true);
                    }}
                  >
                    {feature.cta}
                  </MagneticButton>
                </motion.div>
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Sample Lab Preview</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="rounded-xl bg-[#1e1e2e] p-4 font-mono text-sm text-green-400 mb-6">
                <p className="text-muted-foreground text-xs mb-2">
                  # lab-01-setup.sh
                </p>
                <p>$ git clone playground/fullstack-lab</p>
                <p>$ cd fullstack-lab && npm install</p>
                <p>$ docker compose up -d</p>
                <p className="text-accent-secondary mt-2">
                  ✓ Environment ready. Start building!
                </p>
              </div>

              <p className="text-sm text-muted mb-6">
                This is a preview of our hands-on lab environment. Full labs
                coming soon with real codebases and guided challenges.
              </p>

              <MagneticButton variant="primary" onClick={() => setModalOpen(false)}>
                Got it!
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
