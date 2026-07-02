import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { EASE_OUT, SPRING_GENTLE } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { Logo } from "@/components/layout/Logo";
import {
  AuthNavActions,
  CenterNavLinks,
  MobileAuthNav,
  type NavKey,
} from "@/components/layout/SiteNavLinks";
import { MY_LEARNING_PATH } from "@/lib/constants";
import { usePortalAuth } from "@/context/PortalAuthContext";

const SECTION_IDS = ["courses", "contact"] as const;
const SCROLL_LOCK_MS = 1100;

export function Navbar() {
  const { pathname } = useLocation();
  const onHomePage = pathname === "/";

  const { user, loading, isStudent, isTeacher } = usePortalAuth();
  const isLoggedIn = !loading && Boolean(user && (isStudent || isTeacher));

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey | null>("home");
  const navLockUntil = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(scrollLocked);

  const isNavLocked = () => Date.now() < navLockUntil.current;

  const lockNav = (key: NavKey, ms = SCROLL_LOCK_MS) => {
    navLockUntil.current = Date.now() + ms;
    setActiveNav(key);
  };

  useEffect(() => {
    setMobileOpen(false);
    setScrollLocked(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) setScrollLocked(true);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (pathname === MY_LEARNING_PATH) {
      navLockUntil.current = 0;
      setActiveNav("my-learning");
      return;
    }

    if (onHomePage) {
      if (window.scrollY < 120) {
        setActiveNav("home");
      }
      return;
    }

    setActiveNav(null);
  }, [pathname, onHomePage]);

  useEffect(() => {
    const onScroll = () => {
      if (scrollLocked) return;

      setScrolled(window.scrollY > 20);

      if (!onHomePage || isNavLocked()) return;

      if (window.scrollY < 120) {
        setActiveNav("home");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHomePage, scrollLocked]);

  useEffect(() => {
    if (!onHomePage) return;

    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || isNavLocked() || scrollLocked) return;
          setActiveNav(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [onHomePage, scrollLocked]);

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    lockNav(id === "courses" ? "courses" : "contact");
    scrollToSection(href);
    setMobileOpen(false);
  };

  const handleHomeClick = () => {
    lockNav("home");
    setMobileOpen(false);
  };

  const handleMyLearningClick = () => {
    lockNav("my-learning", 500);
    setMobileOpen(false);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80",
          "pt-[var(--safe-top)] h-[calc(var(--navbar-height)+var(--safe-top))]",
          scrolled ? "shadow-md shadow-foreground/5" : ""
        )}
        style={{
          boxShadow: scrolled
            ? undefined
            : "inset 0 -1px 0 0 rgb(203 213 225 / 0.85)",
        }}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
      >
        <nav className="mx-auto flex h-[var(--navbar-height)] max-w-7xl items-center justify-between gap-3 safe-px lg:px-8">
          <Link to="/" className="flex shrink-0 items-center leading-[0]" onClick={closeMobile}>
            <Logo size="nav" className="max-h-[calc(var(--navbar-height)-0.5rem)]" />
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center">
            <CenterNavLinks
              activeNav={activeNav}
              onSectionClick={onHomePage ? handleNavClick : undefined}
              onHomeClick={handleHomeClick}
              onMyLearningClick={handleMyLearningClick}
            />
          </div>

          <div className="hidden lg:flex shrink-0">
            <AuthNavActions loading={loading} isLoggedIn={isLoggedIn} />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="touch-target lg:hidden inline-flex items-center justify-center rounded-xl text-foreground active:bg-muted/40 transition-colors"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence onExitComplete={() => setScrollLocked(false)}>
        {mobileOpen && (
          <>
            <motion.button
              key="mobile-menu-backdrop"
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />

            <motion.div
              key="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              data-scroll-lock-scrollable
              className="fixed inset-x-0 bottom-0 z-50 lg:hidden max-h-[min(88dvh,640px)] overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl shadow-foreground/10 safe-pb"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SPRING_GENTLE}
            >
              <div className="mx-auto w-12 h-1 rounded-full bg-border mt-3 mb-6" />

              <div className="px-6 pb-8 flex flex-col items-stretch gap-6">
                <CenterNavLinks
                  activeNav={activeNav}
                  onSectionClick={onHomePage ? handleNavClick : undefined}
                  onHomeClick={handleHomeClick}
                  onMyLearningClick={handleMyLearningClick}
                  onNavigate={closeMobile}
                  layout="vertical"
                />

                <MobileAuthNav
                  loading={loading}
                  isLoggedIn={isLoggedIn}
                  onNavigate={closeMobile}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
