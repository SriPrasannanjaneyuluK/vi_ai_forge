import { cn } from "@/lib/utils";

export const pageContainerClass = "mx-auto px-6 lg:px-8";

export const pageTitleClass = "text-3xl font-bold text-foreground tracking-tight";

export const pageSubtitleClass = "mt-2 text-base text-muted";

export const btnPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-accent/25 hover:opacity-90 disabled:opacity-60 transition-all duration-200";

type PageLayoutProps = {
  children: React.ReactNode;
  /** full = portal pages, narrow = settings/forms, auth = sign-in cards */
  width?: "full" | "narrow" | "auth";
  className?: string;
};

const widthClasses = {
  full: "max-w-7xl",
  narrow: "max-w-2xl",
  auth: "max-w-lg w-full",
} as const;

/** Shared page shell — navbar offset, background, content width */
export function PageLayout({
  children,
  width = "full",
  className,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main
        className={cn(
          pageContainerClass,
          "pt-[calc(var(--navbar-height)+2.5rem)] pb-16 lg:pb-12",
          widthClasses[width],
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
