import { motion } from "framer-motion";
import { Heart, MessageSquare, GitBranch } from "lucide-react";
import {
  COMMUNITY_POSTS,
  MARQUEE_ITEMS,
} from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";
import {
  FadeIn,
  FadeInStagger,
  FadeInItem,
  SectionHeading,
} from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";

const TYPE_ICONS = {
  "Project Share": GitBranch,
  "Doubt Thread": MessageSquare,
  "Peer Review": Heart,
};

export function Community() {
  const doubledMarquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section id="community" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community"
          title="Learn together. Ship together."
          subtitle="Share projects, clear doubts, and grow with peers who are on the same journey."
        />

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {COMMUNITY_POSTS.map((post) => {
            const Icon =
              TYPE_ICONS[post.type as keyof typeof TYPE_ICONS] ?? MessageSquare;

            return (
              <FadeInItem key={post.id}>
                <motion.div
                  className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-secondary text-white text-xs font-bold">
                      {post.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {post.author}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1">
                        <Icon size={12} />
                        {post.type}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    {post.title}
                  </p>
                  <p className="mt-3 text-xs text-muted flex items-center gap-1">
                    <Heart size={12} className="text-accent" />
                    {post.likes} appreciations
                  </p>
                </motion.div>
              </FadeInItem>
            );
          })}
        </FadeInStagger>

        {/* Marquee */}
        <FadeIn className="relative mb-12">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex animate-marquee gap-4 whitespace-nowrap">
              {doubledMarquee.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-5 py-2.5 text-sm font-medium text-foreground"
                >
                  <GitBranch size={14} className="text-accent-secondary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn className="text-center">
          <MagneticButton
            variant="primary"
            onClick={() => {
              alert("Community portal coming soon!");
            }}
          >
            Join the Forge
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}
