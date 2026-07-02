import { ACADEMY, FOOTER, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border safe-pb">
      <div className="mx-auto max-w-7xl safe-px lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 text-muted max-w-sm leading-relaxed">
              {ACADEMY.tagline}. {FOOTER.blurb}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href === "/" ? "/" : link.href}
                    className="inline-flex min-h-[2.75rem] items-center text-muted hover:text-accent active:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[2.75rem] items-center text-muted hover:text-accent active:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {year} {ACADEMY.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted italic">{ACADEMY.caption}</p>
        </div>
      </div>
    </footer>
  );
}
