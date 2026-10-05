import {
  getCurrentUser as readCurrentUser,
  getStoredUsers,
  clearCurrentUser,
  saveCurrentUser,
  saveStoredUsers,
} from "./storage";
import { AuthError, type StoredUser, type User } from "./types";
import {
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
} from "./validation";

function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function getCurrentUser(): User | null {
  return readCurrentUser();
}

export function login(email: string, password: string): User {
  const normalizedEmail = normalizeEmail(email);
  const matchingUser = getStoredUsers().find(
    (user) =>
      user.email === normalizedEmail && user.password === password,
  );

  if (!matchingUser) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password.");
  }

  const user = toPublicUser(matchingUser);
  saveCurrentUser(user);
  return user;
}

export function register(name: string, email: string, password: string): User {
  const normalizedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  const validationMessage =
    validateName(normalizedName) ??
    validateEmail(normalizedEmail) ??
    validatePassword(password);
  if (validationMessage) throw new AuthError("VALIDATION", validationMessage);

  const users = getStoredUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new AuthError(
      "EMAIL_EXISTS",
      "An account with this email already exists.",
    );
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    password,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...users, newUser]);
  const user = toPublicUser(newUser);
  saveCurrentUser(user);
  return user;
}

export function logout(): void {
  clearCurrentUser();
}
