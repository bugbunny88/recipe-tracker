/**
 * Normalizes an email address to a consistent format.
 * @param email - The email address to normalize.
 * @returns The normalized email address.
 * @example
 * normalizeEmail('denisek.xo@gmail.com') // returns 'denisekxo@gmail.com'
 * normalizeEmail('denisek.xo@gmail.com') // returns 'denisekxo@gmail.com'
 */
export function normalizeEmail(email: string): string {
  const normalized = email.trim().toLocaleLowerCase()
  return normalized
}
