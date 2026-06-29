import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { EASE_OUT } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";
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

/** Single site-wide navbar — same size and layout on every page */
export function Navbar() {
  const { pathname } = useLocation();
  const onHomePage = pathname === "/";

  const { user, loading, isStudent, isTeacher } = usePortalAuth();
  const isLoggedIn = !loading && Boolean(user && (isStudent || isTeacher));

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey | null>("home");
  const navLockUntil = useRef(0);

  const isNavLocked = () => Date.now() < navLockUntil.current;

  const lockNav = (key: NavKey, ms = SCROLL_LOCK_MS) => {
    navLockUntil.current = Date.now() + ms;
    setActiveNav(key);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      setScrolled(window.scrollY > 20);

      if (!onHomePage || isNavLocked()) return;

      if (window.scrollY < 120) {
        setActiveNav("home");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHomePage]);

  useEffect(() => {
    if (!onHomePage) return;

    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || isNavLocked()) return;
          setActiveNav(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [onHomePage]);

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

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[var(--navbar-height)] bg-white transition-shadow duration-300",
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
        <nav className="mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 lg:px-8">
          <Link to="/" className="flex h-full shrink-0 items-center leading-[0]">
            <Logo size="nav" className="max-h-[calc(var(--navbar-height)-0.25rem)]" />
          </Link>

          <div className="hidden lg:flex items-center justify-center">
            <CenterNavLinks
              activeNav={activeNav}
              onSectionClick={onHomePage ? handleNavClick : undefined}
              onHomeClick={handleHomeClick}
              onMyLearningClick={handleMyLearningClick}
            />
          </div>

          <div className="hidden lg:flex">
            <AuthNavActions loading={loading} isLoggedIn={isLoggedIn} />
          </div>

          <button
            type="button"
            className="lg:hidden justify-self-end p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-lg lg:hidden pt-[var(--navbar-height)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center justify-center h-[calc(100%-var(--navbar-height))] gap-8">
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
        )}
      </AnimatePresence>
    </>
  );
}
