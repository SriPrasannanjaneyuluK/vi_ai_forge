import { STATS } from "@/lib/constants";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";

export function Stats() {
  return (
    <section className="py-16 lg:py-20 border-y border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
