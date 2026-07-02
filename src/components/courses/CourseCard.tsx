import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { Course } from "@/types/site";
import { EASE_OUT } from "@/lib/motion";
import { FadeInItem } from "@/components/motion/FadeIn";
import { useFinePointer } from "@/lib/hooks/useFinePointer";
import { btnPrimaryClass } from "@/components/layout/PageLayout";
import { CourseCoverImage } from "@/components/courses/CourseCoverImage";
import { cn } from "@/lib/utils";

type CourseCardProps = {
  course: Course;
  preview?: boolean;
};

export function CourseCard({ course, preview = false }: CourseCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const enableTilt = finePointer && !reduced && !preview;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  });

  const detailPath = `/courses/${course.id}`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const card = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={enableTilt ? { rotateX, rotateY, transformPerspective: 900 } : {}}
      whileHover={enableTilt ? { y: -6 } : {}}
      whileTap={reduced || preview ? {} : { scale: 0.99 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow h-full flex flex-col border border-border/80"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
        <CourseCoverImage
          src={course.cardImageUrl}
          title={course.title || "Course"}
          tag={course.tag}
          variant="card"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-secondary shadow-sm">
          {course.tag || "Course"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {course.title || "Course title"}
        </h3>

        <p className="text-sm text-muted leading-relaxed mb-4 flex-1 line-clamp-3">
          {course.description || "Course description will appear here."}
        </p>

        <div className="flex items-center gap-3 text-xs font-medium mb-5">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
            {course.level || "Level"}
          </span>
          <span className="flex items-center gap-1 text-muted">
            <Clock size={12} />
            {course.duration || "Duration"}
          </span>
        </div>

        <span className={cn(btnPrimaryClass, "w-full mt-auto")}>
          View Course
          <ArrowRight size={16} />
        </span>
      </div>
    </motion.div>
  );

  if (preview) return card;

  return (
    <FadeInItem>
      <Link
        to={detailPath}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
      >
        {card}
      </Link>
    </FadeInItem>
  );
}
