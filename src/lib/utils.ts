export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const navHeightRaw = getComputedStyle(document.documentElement).getPropertyValue(
    "--navbar-height"
  );
  const navHeight = Number.parseFloat(navHeightRaw) || 80;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
