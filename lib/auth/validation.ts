export const MIN_NAME_LENGTH = 2;
export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return "Enter your full name.";
  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Your name must be at least ${MIN_NAME_LENGTH} characters.`;
  }
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Create a password.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) return "Confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return undefined;
}

export type PasswordStrengthLabel = "Weak" | "Fair" | "Good" | "Strong";

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: PasswordStrengthLabel | null;
}

/**
 * Rough, length/variety-based hint to guide users. It is NOT a measure of
 * cryptographic strength and says nothing about whether a password is safe.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: null };

  const variety = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((rule) =>
    rule.test(password),
  ).length;

  let score: 1 | 2 | 3 | 4;
  if (password.length < MIN_PASSWORD_LENGTH) score = 1;
  else if (variety <= 1) score = 2;
  else if (password.length >= 12 && variety >= 3) score = 4;
  else if (variety >= 3 || password.length >= 12) score = 3;
  else score = 2;

  return { score, label: (["Weak", "Fair", "Good", "Strong"] as const)[score - 1] };
}
