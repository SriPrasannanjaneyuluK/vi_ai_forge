import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { FOUNDER, SECTIONS, TEAM } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import {
  FadeIn,
  FadeInStagger,
  FadeInItem,
  SectionHeading,
} from "@/components/motion/FadeIn";

export function Founder() {
  const section = SECTIONS.founder;
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const experienceRef = useRef<HTMLUListElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const experienceInView = useInView(experienceRef, { once: true, margin: "-40px" });
  const quoteInView = useInView(quoteRef, { once: true, margin: "-40px" });

  return (
    <section id="founder" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />

        <FadeIn className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card rounded-3xl p-8 lg:p-12 shadow-sm border border-border/50">
            <div className="relative">
              <div className="aspect-square max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-accent/20 via-accent-secondary/20 to-accent/10 flex items-center justify-center">
                <span className="text-6xl font-bold gradient-text">
                  {FOUNDER.name}
                </span>
              </div>
              <p className="text-center text-xs text-muted mt-3">
                Add your photo at public/founder.jpg
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {FOUNDER.name}
              </h3>
              <p className="text-accent font-medium mt-1">{FOUNDER.role}</p>
              <p className="mt-4 text-muted leading-relaxed">{FOUNDER.bio}</p>

              <ul ref={experienceRef} className="mt-6 space-y-3">
                {FOUNDER.experience.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-start gap-3 text-sm text-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={experienceInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: EASE_OUT }}
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-secondary shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                {FOUNDER.companies.map((company) => (
                  <span
                    key={company}
                    className="rounded-full bg-background border border-border px-4 py-1.5 text-xs font-semibold text-muted"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mb-20">
          <div className="relative max-w-3xl mx-auto text-center px-6">
            <Quote size={32} className="text-accent/30 mx-auto mb-4" />
            <motion.blockquote
              ref={quoteRef}
              className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed italic"
              initial={{ opacity: 0 }}
              animate={quoteInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: EASE_OUT }}
            >
              &ldquo;{FOUNDER.quote}&rdquo;
            </motion.blockquote>
          </div>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <FadeInItem key={member.name}>
              <motion.button
                type="button"
                className="w-full text-left bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                onClick={() =>
                  setExpandedMember(
                    expandedMember === member.name ? null : member.name
                  )
                }
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-secondary text-white text-sm font-bold mb-4">
                  {member.avatar}
                </div>
                <h4 className="font-bold text-foreground">{member.name}</h4>
                <p className="text-sm text-accent mt-0.5">{member.role}</p>
                <motion.p
                  className="text-sm text-muted mt-3 leading-relaxed overflow-hidden"
                  animate={{
                    height: expandedMember === member.name ? "auto" : "2.5rem",
                    opacity: expandedMember === member.name ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  {member.bio}
                </motion.p>
              </motion.button>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
