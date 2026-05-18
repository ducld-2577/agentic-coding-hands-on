/**
 * Validates a redirect path to prevent open-redirect attacks.
 * Only allows relative paths starting with "/" (not "//").
 */
export function validateRedirectPath(path: string | null, fallback = '/home'): string {
  if (!path) return fallback
  if (path.startsWith('/') && !path.startsWith('//')) return path
  return fallback
}
