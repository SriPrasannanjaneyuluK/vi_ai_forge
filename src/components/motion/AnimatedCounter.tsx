import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  label: string;
};

export function AnimatedCounter({ value, suffix = "", label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.2 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? value : 0);
  const visible = reduced || isInView;

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setCount(value);
      return;
    }

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [visible, value, reduced]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="text-4xl sm:text-5xl font-bold gradient-text">
        {count}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-muted uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );
}
