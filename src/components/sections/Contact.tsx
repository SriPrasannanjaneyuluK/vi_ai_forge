import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { ACADEMY, SECTIONS, SOCIAL_LINKS } from "@/lib/constants";
import { submitContact } from "@/lib/api";
import { FadeIn, SectionHeading } from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";

const contact = SECTIONS.contact;

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitContact({ name, email, message });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          subtitle={contact.subtitle}
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
                  <p className="text-muted">{contact.location}</p>
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
              onSubmit={handleSubmit}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none disabled:opacity-60"
                  placeholder={contact.messagePlaceholder}
                />
              </div>
              <MagneticButton variant="primary" type="submit" disabled={submitting}>
                <span className="flex items-center gap-2">
                  {submitting ? "Sending…" : "Send Message"}
                  <Send size={14} />
                </span>
              </MagneticButton>

              {submitted && (
                <p className="flex items-center gap-2 text-sm font-medium text-accent-secondary">
                  <CheckCircle size={16} />
                  Message sent successfully.
                </p>
              )}
              {error && (
                <p className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
