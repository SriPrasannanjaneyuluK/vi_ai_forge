import { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
import { MY_LEARNING_LABEL, MY_LEARNING_PATH } from "@/lib/constants";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";

export type NavKey = "home" | "courses" | "my-learning" | "contact";

const UNDERLINE_TRANSITION = { duration: 0.38, ease: EASE_OUT };
const UNDERLINE_INSET = 12;

const navLinkClass =
  "relative flex h-9 min-w-[6.5rem] items-center justify-center px-3 text-sm font-medium transition-colors duration-200";

const mobileLinkClass =
  "relative w-full max-w-sm mx-auto rounded-2xl px-5 py-3.5 text-lg font-semibold text-foreground min-h-[3rem] flex items-center justify-center transition-colors active:scale-[0.98]";

type NavTabProps = {
  navKey: NavKey;
  active: boolean;
  horizontal: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  to?: string;
  type?: "button" | "link";
};

function NavTab({
  navKey,
  active,
  horizontal,
  children,
  className,
  onClick,
  to,
  type = "button",
}: NavTabProps) {
  const classes = cn(
    horizontal ? navLinkClass : mobileLinkClass,
    active
      ? horizontal
        ? "text-accent"
        : "text-accent bg-accent/10 border-2 border-accent/25 shadow-sm shadow-accent/10"
      : horizontal
        ? "text-muted hover:text-foreground"
        : "text-foreground bg-white border border-border shadow-sm active:bg-accent/5 active:border-accent/25",
    className
  );

  if (type === "link" && to) {
    return (
      <Link to={to} data-nav={navKey} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" data-nav={navKey} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

type NavUnderlineProps = {
  activeNav: NavKey | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

/** One shared underline — slides directly to the active tab (no layoutId hop-through). */
function NavUnderline({ activeNav, containerRef }: NavUnderlineProps) {
  const [metrics, setMetrics] = useState({ left: 0, width: 0, visible: false });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !activeNav) {
      setMetrics((m) => ({ ...m, visible: false }));
      return;
    }

    const measure = () => {
      const tab = container.querySelector<HTMLElement>(`[data-nav="${activeNav}"]`);
      if (!tab) return;

      const cRect = container.getBoundingClientRect();
      const tRect = tab.getBoundingClientRect();
      setMetrics({
        left: tRect.left - cRect.left + UNDERLINE_INSET,
        width: Math.max(0, tRect.width - UNDERLINE_INSET * 2),
        visible: true,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeNav, containerRef]);

  if (!metrics.visible) return null;

  return (
    <motion.span
      className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-accent"
      initial={false}
      animate={{ left: metrics.left, width: metrics.width }}
      transition={UNDERLINE_TRANSITION}
    />
  );
}

type CenterNavLinksProps = {
  activeNav?: NavKey | null;
  onSectionClick?: (href: string) => void;
  onHomeClick?: () => void;
  onMyLearningClick?: () => void;
  onNavigate?: () => void;
  layout?: "horizontal" | "vertical";
  className?: string;
};

/** Home · Courses · My Learnings · Contact */
export function CenterNavLinks({
  activeNav = null,
  onSectionClick,
  onHomeClick,
  onMyLearningClick,
  onNavigate,
  layout = "horizontal",
  className,
}: CenterNavLinksProps) {
  const location = useLocation();
  const onHomePage = location.pathname === "/";
  const horizontal = layout === "horizontal";
  const tabsRef = useRef<HTMLDivElement>(null);

  const homeActive = activeNav === "home";
  const coursesActive = activeNav === "courses";
  const myLearningActive = activeNav === "my-learning";
  const contactActive = activeNav === "contact";

  const handleSection = (href: string) => {
    onSectionClick?.(href);
    onNavigate?.();
  };

  const handleHome = () => {
    onHomeClick?.();
    if (onHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    onNavigate?.();
  };

  const handleCoursesFromAway = () => {
    onNavigate?.();
  };

  const handleMyLearning = () => {
    onMyLearningClick?.();
    onNavigate?.();
  };

  return (
    <div
      ref={tabsRef}
      className={cn(
        horizontal ? "relative flex items-center" : "flex flex-col items-stretch gap-2 w-full",
        className
      )}
    >
      {horizontal && <NavUnderline activeNav={activeNav} containerRef={tabsRef} />}

      <NavTab
        navKey="home"
        type="link"
        to="/"
        active={homeActive}
        horizontal={horizontal}
        onClick={handleHome}
      >
        Home
      </NavTab>

      {onHomePage && onSectionClick ? (
        <NavTab
          navKey="courses"
          active={coursesActive}
          horizontal={horizontal}
          onClick={() => handleSection("#courses")}
        >
          Courses
        </NavTab>
      ) : (
        <NavTab
          navKey="courses"
          type="link"
          to="/#courses"
          active={false}
          horizontal={horizontal}
          onClick={handleCoursesFromAway}
        >
          Courses
        </NavTab>
      )}

      <NavTab
        navKey="my-learning"
        type="link"
        to={MY_LEARNING_PATH}
        active={myLearningActive}
        horizontal={horizontal}
        onClick={handleMyLearning}
      >
        {MY_LEARNING_LABEL}
      </NavTab>

      {onHomePage && onSectionClick ? (
        <NavTab
          navKey="contact"
          active={contactActive}
          horizontal={horizontal}
          onClick={() => handleSection("#contact")}
        >
          Contact
        </NavTab>
      ) : (
        <NavTab
          navKey="contact"
          type="link"
          to="/#contact"
          active={false}
          horizontal={horizontal}
          onClick={onNavigate}
        >
          Contact
        </NavTab>
      )}
    </div>
  );
}

/** @deprecated Use CenterNavLinks */
export const PublicNavLinks = CenterNavLinks;

type AuthNavActionsProps = {
  loading: boolean;
  isLoggedIn: boolean;
  onNavigate?: () => void;
};

/** Right side: Sign in + Enroll (guest) · circular profile only (member) */
export function AuthNavActions({ loading, isLoggedIn, onNavigate }: AuthNavActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 w-[220px] shrink-0">
      {loading ? (
        <>
          <div className="h-4 w-24 rounded bg-muted/40 animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-muted/40 animate-pulse ml-auto" />
        </>
      ) : isLoggedIn ? (
        <div className="ml-auto">
          <UserProfileMenu variant="navbar" onNavigate={onNavigate} />
        </div>
      ) : (
        <>
          <Link
            to="/login"
            onClick={onNavigate}
            className="min-w-[5.5rem] text-center text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            onClick={onNavigate}
            className="flex h-9 w-[130px] items-center justify-center rounded-full bg-accent text-sm font-semibold text-white shadow-sm shadow-accent/25 hover:opacity-90 transition-opacity duration-200"
          >
            Enroll now
          </Link>
        </>
      )}
    </div>
  );
}

export function MobileAuthNav({ loading, isLoggedIn, onNavigate }: AuthNavActionsProps) {
  return (
    <div className="flex flex-col items-stretch gap-3 pt-2 border-t border-border">
      {loading ? (
        <div className="mx-auto h-11 w-11 rounded-full bg-muted/40 animate-pulse" />
      ) : isLoggedIn ? (
        <div className="flex justify-center">
          <UserProfileMenu variant="navbar" onNavigate={onNavigate} />
        </div>
      ) : (
        <>
          <Link
            to="/login"
            onClick={onNavigate}
            className="w-full max-w-sm mx-auto rounded-2xl border border-border px-5 py-3.5 text-center text-base font-semibold text-foreground min-h-[3rem] flex items-center justify-center active:bg-muted/30"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            onClick={onNavigate}
            className="w-full max-w-sm mx-auto flex min-h-[3rem] items-center justify-center rounded-2xl bg-accent px-6 text-base font-semibold text-white shadow-sm shadow-accent/25 active:opacity-90"
          >
            Enroll now
          </Link>
        </>
      )}
    </div>
  );
}
