/**
 * Pure validation; never persists or transmits values.
 * @param {{name: string, email: string, comment: string, agreement: boolean}} values
 * @param {'full' | 'name-only'} mode
 * @returns {Record<string, string>}
 */
export function validateIntroduction({ name, email, comment, agreement }, mode = 'full') {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!name.trim()) errors.name = 'Please enter your full name to continue.';
  else if (name.length > 120) errors.name = 'Please keep your name under 121 characters.';
  if (mode === 'name-only') return errors;
  if (!email.trim()) errors.email = 'Please enter your email address.';
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter an email like you@example.com.';
  if (comment.length > 1000) errors.comment = 'Please keep your note to 1,000 characters.';
  if (!agreement) errors.agreement = 'Please agree to preview, or continue with your name only.';
  return errors;
}
