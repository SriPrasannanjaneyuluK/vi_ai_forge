import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import {
  FadeInStagger,
  FadeInItem,
  SectionHeading,
} from "@/components/motion/FadeIn";

export function HowItWorks() {
  return (
    <section id="how" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="From curious to confident"
          subtitle="A clear path from picking a track to shipping your first production project."
        />

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <FadeInItem key={step.step} className="relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-accent/40 to-transparent"
                  aria-hidden
                />
              )}

              <motion.div
                className="text-center"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent text-xl font-bold mb-5">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
