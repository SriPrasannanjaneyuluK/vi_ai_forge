const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return "Email is required.";
  if (!EMAIL_PATTERN.test(normalized)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include a lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must include a number.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include a special character.";
  }
  return null;
}

export function validateFullName(fullName: string): string | null {
  const trimmed = fullName.trim();
  if (trimmed.length < 2) return "Enter your full name.";
  if (!/^[\p{L}\s'.-]+$/u.test(trimmed)) {
    return "Name can only contain letters, spaces, and basic punctuation.";
  }
  return null;
}

export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    id: "special",
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const;
