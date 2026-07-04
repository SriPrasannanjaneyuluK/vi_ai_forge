import { useEffect, useState } from "react";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { ACADEMY, SECTIONS, SOCIAL_LINKS } from "@/lib/constants";
import { submitContact } from "@/lib/api";
import { FadeIn, SectionHeading } from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { usePortalAuth } from "@/context/PortalAuthContext";

const contact = SECTIONS.contact;

export function Contact() {
  const { user } = usePortalAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Logged-in visitors reach out from their registered email — locked so it can't be changed.
  const lockedEmail = user?.email ?? null;
  const effectiveEmail = lockedEmail ?? email;

  // Prefill the name from the profile once it loads, but keep it editable.
  useEffect(() => {
    if (user?.fullName) setName((prev) => prev || user.fullName!);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitContact({ name, email: effectiveEmail, message });
      setSubmitted(true);
      setName(user?.fullName ?? "");
      if (!lockedEmail) setEmail("");
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
      <div className="mx-auto max-w-7xl safe-px lg:px-8">
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
                  value={effectiveEmail}
                  onChange={(e) => !lockedEmail && setEmail(e.target.value)}
                  readOnly={Boolean(lockedEmail)}
                  disabled={submitting}
                  aria-readonly={Boolean(lockedEmail)}
                  title={lockedEmail ? "Using your account email" : undefined}
                  className={`w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60 ${
                    lockedEmail
                      ? "bg-muted/40 text-muted cursor-not-allowed"
                      : "bg-background"
                  }`}
                  placeholder="you@email.com"
                />
                {lockedEmail && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                    <Lock size={12} />
                    Sent from your account email — sign out to use a different address.
                  </p>
                )}
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
