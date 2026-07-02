import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/hooks/useFinePointer";
import { SPRING_SNAPPY } from "@/lib/motion";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function MagneticButton({
  children,
  className,
  variant = "primary",
  onClick,
  href,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const magnetic = finePointer && !reduced;

  const variants = {
    primary:
      "bg-accent text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30",
    secondary:
      "bg-white text-foreground border border-border hover:border-accent/30 hover:bg-accent/5",
    ghost: "text-foreground hover:bg-foreground/5",
  };

  const baseClass = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 sm:py-3 text-sm font-semibold transition-colors min-h-[2.75rem]",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]",
    variants[variant],
    className
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.12, y: y * 0.12 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const motionWrapper = (child: React.ReactNode) => (
    <motion.div
      ref={ref}
      className="inline-block w-full sm:w-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={magnetic ? { x: position.x, y: position.y } : undefined}
      transition={SPRING_SNAPPY}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      whileHover={magnetic ? { scale: 1.02 } : undefined}
    >
      {child}
    </motion.div>
  );

  if (href) {
    return motionWrapper(
      <a href={href} onClick={onClick} className={baseClass}>
        {children}
      </a>
    );
  }

  return motionWrapper(
    <button type={type} onClick={onClick} className={baseClass} disabled={disabled}>
      {children}
    </button>
  );
}
