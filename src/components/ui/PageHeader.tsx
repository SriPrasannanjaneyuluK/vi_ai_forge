import { cn } from "@/lib/utils";
import { pageSubtitleClass, pageTitleClass } from "@/components/layout/PageLayout";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
};

export function PageHeader({ title, subtitle, eyebrow, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-8", className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className={pageTitleClass}>{title}</h1>
      {subtitle && <p className={pageSubtitleClass}>{subtitle}</p>}
    </header>
  );
}
