import { cn } from "@/lib/utils";

export const pageContainerClass = "mx-auto safe-px lg:px-8";

export const pageTitleClass = "text-3xl font-bold text-foreground tracking-tight";

export const pageSubtitleClass = "mt-2 text-base text-muted";

export const btnPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 sm:py-3 text-sm font-semibold text-white shadow-sm shadow-accent/25 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 min-h-[2.75rem]";

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
          "pt-[calc(var(--navbar-height)+var(--safe-top)+1.5rem)] pb-16 safe-pb lg:pb-12",
          widthClasses[width],
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
