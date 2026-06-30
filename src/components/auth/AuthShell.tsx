import { Link, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageCard } from "@/components/ui/PageCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { STATIC_SITE } from "@/lib/staticSite";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Sign in", href: "/login" },
  { label: "Create account", href: "/signup" },
] as const;

const AUTH_META = {
  "/login": {
    title: "Sign in",
    subtitle: `Continue learning with ${STATIC_SITE.name}`,
  },
  "/signup": {
    title: "Create account",
    subtitle: `Join ${STATIC_SITE.name} as a student or teacher`,
  },
} as const;

type AuthShellProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/** Auth pages — shared shell, tabs, and field layout for sign-in and sign-up */
export function AuthShell({ children, footer }: AuthShellProps) {
  const { pathname } = useLocation();
  const meta = AUTH_META[pathname as keyof typeof AUTH_META] ?? AUTH_META["/login"];

  return (
    <PageLayout width="auth">
      <PageHeader title={meta.title} subtitle={meta.subtitle} />

      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-muted/20 p-1">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "rounded-lg py-2.5 text-center text-sm font-medium transition-all",
                active
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <PageCard padding="lg">{children}</PageCard>

      {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
    </PageLayout>
  );
}
