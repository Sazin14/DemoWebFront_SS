import type { StoredUser, User, UserRole } from "./types";

const USERS_STORAGE_KEY = "ecomms_users";
const SESSION_STORAGE_KEY = "ecomms_current_user";

// Development-only credential. Remove this account when backend authentication is connected.
const DEMO_ADMIN: StoredUser = {
  id: "ecomms-demo-admin",
  name: "EcomMS Admin",
  email: "admin@ecomms.local",
  password: "Admin@12345",
  role: "admin",
  createdAt: "2026-01-01T00:00:00.000Z",
};

// Registered passwords are stored in plaintext for this frontend-only prototype.
// This is insecure and must be replaced by backend-managed credentials before production.
function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "customer";
}

function isStoredUser(value: unknown): value is StoredUser {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.password === "string" &&
    isUserRole(user.role) &&
    typeof user.createdAt === "string"
  );
}

function isPersistedUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    isUserRole(user.role) &&
    typeof user.createdAt === "string"
  );
}

export function getStoredUsers(): StoredUser[] {
  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (storedUsers === null) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEMO_ADMIN]));
    return [DEMO_ADMIN];
  }

  let parsedUsers: unknown;
  try {
    parsedUsers = JSON.parse(storedUsers);
  } catch {
    throw new Error("Saved accounts could not be read. Clear this site's local storage and try again.");
  }

  if (!Array.isArray(parsedUsers) || !parsedUsers.every(isStoredUser)) {
    throw new Error("Saved accounts have an unsupported format. Clear this site's local storage and try again.");
  }

  const adminAccount = parsedUsers.find(
    (user) => user.email === DEMO_ADMIN.email,
  );
  if (adminAccount && adminAccount.role !== "admin") {
    throw new Error("The temporary admin account data is invalid.");
  }

  if (!adminAccount) {
    const seededUsers = [...parsedUsers, DEMO_ADMIN];
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seededUsers));
    return seededUsers;
  }

  return parsedUsers;
}

export function saveStoredUsers(users: StoredUser[]): void {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function saveCurrentUser(user: User): void {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (storedSession === null) return null;

  let parsedSession: unknown;
  try {
    parsedSession = JSON.parse(storedSession);
  } catch {
    throw new Error("The saved session could not be read. Please clear this site's local storage.");
  }

  if (!isPersistedUser(parsedSession)) {
    throw new Error("The saved session has an unsupported format. Please clear this site's local storage.");
  }

  const matchingUser = getStoredUsers().find(
    (user) =>
      user.id === parsedSession.id &&
      user.email === parsedSession.email &&
      user.role === parsedSession.role,
  );

  if (!matchingUser) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }

  return {
    id: matchingUser.id,
    name: matchingUser.name,
    email: matchingUser.email,
    role: matchingUser.role,
    createdAt: matchingUser.createdAt,
  };
}

export function clearCurrentUser(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}
