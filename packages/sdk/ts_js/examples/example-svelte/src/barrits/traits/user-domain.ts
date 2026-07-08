/**
 * @barrits-trait
 * @barrits-summary User domain trait for Svelte example
 * @barrits-provides createUserSession, getActiveUser, checkAccess
 * @barrits-consumes logger, storage
 * @barrits-state sessionId, activeUser, permissions
 * @barrits-runtime browser
 * @barrits-version 1.0.0
 * @barrits-stability stable
 */
export function createUserSession(userId: string): string {
  return `session-${userId}`;
}

export function getActiveUser(): { id: string; name: string } | null {
  return null;
}

export function checkAccess(userId: string, resource: string): boolean {
  return true;
}
