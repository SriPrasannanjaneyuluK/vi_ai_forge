import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCourses } from "@/context/CoursesContext";
import { ACADEMY, HERO_FEATURED_COURSE, SECTIONS } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import { useSwipe } from "@/lib/hooks/useSwipe";
import { scrollToSection } from "@/lib/utils";
import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import type { LatestCourse } from "@/types/site";

const SLIDE_DURATION = 6000;
const SLIDE_COUNT = 2;
const hero = SECTIONS.hero;

export function Hero() {
  const { latestCourse } = useCourses();

  const featuredCourse = useMemo<LatestCourse>(() => {
    if (latestCourse?.title?.trim()) return latestCourse;
    return { ...HERO_FEATURED_COURSE, stack: [...HERO_FEATURED_COURSE.stack] };
  }, [latestCourse]);

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  const goNext = () => setSlide((current) => (current + 1) % SLIDE_COUNT);
  const goPrev = () => setSlide((current) => (current - 1 + SLIDE_COUNT) % SLIDE_COUNT);

  const swipe = useSwipe(goNext, goPrev);

  useEffect(() => {
    setProgress(0);
  }, [slide]);

  useEffect(() => {
    if (paused || reduced) return;

    const started = performance.now();
    const tickMs = 50;

    const interval = setInterval(() => {
      const elapsed = performance.now() - started;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        setSlide((current) => (current + 1) % SLIDE_COUNT);
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, [paused, reduced, slide]);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-[calc(var(--navbar-height)+var(--safe-top)+1.5rem)] pb-12 safe-pb">
      <div
        className="absolute top-24 left-[5%] w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-accent/10 blur-3xl animate-float pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-16 right-[5%] w-56 h-56 sm:w-96 sm:h-96 rounded-full bg-accent-secondary/10 blur-3xl animate-float-delayed pointer-events-none"
        aria-hidden
      />

      <div
        className="relative z-10 mx-auto max-w-7xl safe-px lg:px-8 w-full touch-pan-y"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onTouchStartCapture={swipe.onTouchStart}
        onTouchEndCapture={swipe.onTouchEnd}
      >
        <AnimatePresence mode="wait">
          {slide === 0 ? (
            <motion.div
              key="brand"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45, ease: EASE_OUT }}
                className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs sm:text-sm font-medium text-accent mb-6 sm:mb-8"
              >
                <Sparkles size={14} />
                {hero.eyebrow}
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
              >
                <span className="gradient-text">{ACADEMY.name}</span>
              </motion.h1>

              <TextReveal
                text={ACADEMY.tagline}
                as="p"
                className="mt-5 sm:mt-6 text-xl sm:text-3xl font-semibold text-foreground justify-center px-2"
                delay={0.4}
              />

              <motion.p
                className="mt-3 sm:mt-4 text-base sm:text-lg text-muted italic px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.5, ease: EASE_OUT }}
              >
                {ACADEMY.caption}
              </motion.p>

              <motion.div
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 max-w-md sm:max-w-none mx-auto"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: EASE_OUT }}
              >
                <MagneticButton
                  variant="primary"
                  className="w-full sm:w-auto"
                  onClick={() => scrollToSection("#courses")}
                >
                  {hero.browseCoursesLabel}
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => setSlide(1)}
                >
                  {hero.viewLatestCourseLabel}
                </MagneticButton>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="course"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="max-w-3xl mx-auto text-center px-2"
            >
              <span className="inline-block text-xs sm:text-sm font-semibold text-accent-secondary uppercase tracking-widest mb-3 sm:mb-4">
                {hero.latestCourseLabel}
              </span>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
                {featuredCourse.title}
              </h2>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted leading-relaxed">
                {featuredCourse.description}
              </p>

              {featuredCourse.stack.length > 0 && (
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2">
                  {featuredCourse.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-white border border-border px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-foreground shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-accent font-medium">
                  {featuredCourse.level}
                </span>
                <span>{featuredCourse.duration}</span>
              </div>

              <div className="mt-8 sm:mt-10 px-4 sm:px-0">
                <MagneticButton
                  variant="primary"
                  className="w-full sm:w-auto"
                  onClick={() => scrollToSection("#courses")}
                >
                  {hero.viewCourseDetailsLabel}
                  <ArrowRight size={16} />
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-4">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              className="touch-target flex items-center justify-center rounded-full"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={slide === i ? "true" : undefined}
            >
              <span className="relative block w-14 sm:w-16 h-1.5 rounded-full bg-border overflow-hidden">
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
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
