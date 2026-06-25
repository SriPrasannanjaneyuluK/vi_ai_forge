import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ACADEMY, LATEST_COURSE } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import { scrollToSection } from "@/lib/utils";
import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

const SLIDE_DURATION = 6000;

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  const nextSlide = useCallback(() => {
    setSlide((s) => (s + 1) % 2);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          nextSlide();
          return 0;
        }
        return p + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [paused, nextSlide, reduced]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[calc(var(--navbar-height,4.25rem)+2.5rem)] pb-16">
      {/* Floating orbs */}
      <div
        className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-accent/10 blur-3xl animate-float pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-accent-secondary/10 blur-3xl animate-float-delayed pointer-events-none"
        aria-hidden
      />

      <div
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          {slide === 0 ? (
            <motion.div
              key="brand"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT }}
                className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-8"
              >
                <Sparkles size={14} />
                Your learning playground
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
              >
                <span className="gradient-text">{ACADEMY.name}</span>
              </motion.h1>

              <TextReveal
                text={ACADEMY.tagline}
                as="p"
                className="mt-6 text-2xl sm:text-3xl font-semibold text-foreground justify-center"
                delay={0.5}
              />

              <motion.p
                className="mt-4 text-lg text-muted italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6, ease: EASE_OUT }}
              >
                {ACADEMY.caption}
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: EASE_OUT }}
              >
                <MagneticButton
                  variant="primary"
                  onClick={() => scrollToSection("#courses")}
                >
                  Explore the Playground
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton
                  variant="secondary"
                  onClick={() => setSlide(1)}
                >
                  View Latest Course
                </MagneticButton>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="course"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block text-sm font-semibold text-accent-secondary uppercase tracking-widest mb-4">
                Latest Course
              </span>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                {LATEST_COURSE.title}
              </h2>

              <p className="mt-6 text-lg text-muted leading-relaxed">
                {LATEST_COURSE.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {LATEST_COURSE.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-white border border-border px-4 py-1.5 text-sm font-medium text-foreground shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-accent font-medium">
                  {LATEST_COURSE.level}
                </span>
                <span>{LATEST_COURSE.duration}</span>
              </div>

              <div className="mt-10">
                <MagneticButton
                  variant="primary"
                  onClick={() => scrollToSection("#courses")}
                >
                  Jump In
                  <ArrowRight size={16} />
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => {
                setSlide(i);
                setProgress(0);
              }}
              className="group relative w-12 h-1.5 rounded-full bg-border overflow-hidden"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`absolute inset-0 rounded-full transition-colors ${
                  slide === i ? "bg-accent/20" : "bg-transparent"
                }`}
              />
              {slide === i && !reduced && (
                <motion.span
                  className="absolute inset-y-0 left-0 bg-accent rounded-full"
                  style={{ width: `${progress}%` }}
                />
              )}
              {slide === i && reduced && (
                <span className="absolute inset-0 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
