import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SECTIONS, TESTIMONIALS } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import { useSwipe } from "@/lib/hooks/useSwipe";
import { SectionHeading } from "@/components/motion/FadeIn";

export function Testimonials() {
  const section = SECTIONS.testimonials;
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const swipe = useSwipe(next, prev);
  const testimonial = TESTIMONIALS[current];

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl safe-px lg:px-8">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />

        <div
          className="relative max-w-3xl mx-auto touch-pan-y"
          onTouchStartCapture={swipe.onTouchStart}
          onTouchEndCapture={swipe.onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              className="bg-card rounded-3xl p-6 sm:p-12 shadow-sm border border-border/50 text-center"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <Quote size={28} className="text-accent/30 mx-auto mb-5 sm:mb-6" />
              <p className="text-base sm:text-xl text-foreground leading-relaxed font-medium">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 sm:mt-8">
                <p className="font-bold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted mt-1">{testimonial.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {TESTIMONIALS.length > 1 && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                type="button"
                onClick={prev}
                className="touch-target flex items-center justify-center rounded-full border border-border bg-white active:bg-accent/10 active:border-accent/30 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className="touch-target flex items-center justify-center"
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === current ? "true" : undefined}
                  >
                    <span
                      className={`block h-2 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-8 bg-accent"
                          : "w-2 bg-border"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                className="touch-target flex items-center justify-center rounded-full border border-border bg-white active:bg-accent/10 active:border-accent/30 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
