import { cn } from "@/lib/utils";

type PageCardProps = {
  children: React.ReactNode;
  className?: string;
  dashed?: boolean;
  padding?: "md" | "lg";
};

export function PageCard({
  children,
  className,
  dashed = false,
  padding = "md",
}: PageCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm",
        padding === "lg" ? "p-6 sm:p-8" : "p-6",
        dashed && "border-dashed bg-background shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
}
