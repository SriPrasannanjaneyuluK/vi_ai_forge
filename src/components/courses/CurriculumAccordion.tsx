import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CurriculumWeek } from "@/types/site";
import { cn } from "@/lib/utils";

export function CurriculumAccordion({ weeks }: { weeks: CurriculumWeek[] }) {
  const [openWeek, setOpenWeek] = useState<number | null>(weeks[0]?.week ?? null);

  return (
    <div className="space-y-3">
      {weeks.map((week) => {
        const isOpen = openWeek === week.week;
        return (
          <div
            key={week.week}
            className="rounded-xl border border-border bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenWeek(isOpen ? null : week.week)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/5 transition-colors"
              aria-expanded={isOpen}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Week {week.week}
                </span>
                <p className="font-semibold text-foreground mt-0.5">{week.title}</p>
              </div>
              <ChevronDown
                size={18}
                className={cn(
                  "text-muted shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-4 space-y-2 border-t border-border/60"
                >
                  {week.topics.map((topic) => (
                    <li key={topic} className="text-sm text-muted flex items-start gap-2 pt-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {topic}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
