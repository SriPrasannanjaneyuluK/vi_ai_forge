export const ACCESS_REVOKED =
  "Your account access has been revoked. Contact support if you believe this is a mistake.";

/** Generic message for failed sign-in (avoids leaking account type or portal). */
export const INVALID_CREDENTIALS = "Invalid email or password.";

export const SIGNUP_FAILED =
  "Unable to create account. Try a different email or sign in instead.";

export const ACCOUNT_NOT_FOUND = "No account found for this email.";

export const RESET_EMAIL_SENT =
  "We sent password reset instructions to your email.";

export function toSignInError(_err: unknown): string {
  return INVALID_CREDENTIALS;
}

export function toSignUpError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === ACCESS_REVOKED) return ACCESS_REVOKED;
    return err.message;
  }
  return SIGNUP_FAILED;
}
