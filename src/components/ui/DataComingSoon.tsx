import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type DataComingSoonProps = {
  loading?: boolean;
  label?: string;
};

export function DataComingSoon({
  loading = false,
  label = "This content",
}: DataComingSoonProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/50 px-8 py-20 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10"
        animate={loading ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
      >
        <Loader2
          size={28}
          className={`text-accent ${loading ? "animate-spin" : ""}`}
        />
      </motion.div>

      <p className="text-lg font-semibold text-foreground">
        {loading ? "Loading…" : "Something exciting is coming"}
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted">
        {loading
          ? `Fetching ${label.toLowerCase()} from our platform.`
          : `${label} is not available yet. Check back soon.`}
      </p>

      {!loading && (
        <div className="mt-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-accent/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
