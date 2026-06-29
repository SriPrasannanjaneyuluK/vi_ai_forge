import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CoursesProvider } from "@/context/CoursesContext";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Courses } from "@/components/sections/Courses";
import { Founder } from "@/components/sections/Founder";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Contact } from "@/components/sections/Contact";
import { scrollToSection } from "@/lib/utils";

export function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const timer = window.setTimeout(() => scrollToSection(hash), 120);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <CoursesProvider>
      <main>
        <Hero />
        <Courses />
        <Founder />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </CoursesProvider>
  );
}
