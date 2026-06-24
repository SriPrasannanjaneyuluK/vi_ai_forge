import { Mail, MapPin, Send } from "lucide-react";
import { ACADEMY, SOCIAL_LINKS } from "@/lib/constants";
import { FadeIn, SectionHeading } from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build together"
          subtitle="Have questions about courses, labs, or joining the community? Reach out."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <FadeIn>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a
                    href={`mailto:${ACADEMY.email}`}
                    className="text-muted hover:text-accent transition-colors"
                  >
                    {ACADEMY.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-secondary/10 text-accent-secondary shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-muted">Remote-first, global community</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Follow us
                </p>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-accent hover:border-accent/30 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <form
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! (Demo — no backend yet)");
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                  placeholder="Tell us what you'd like to learn..."
                />
              </div>
              <MagneticButton variant="primary" type="submit">
                <span className="flex items-center gap-2">
                  Send Message
                  <Send size={14} />
                </span>
              </MagneticButton>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
