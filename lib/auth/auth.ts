import {
  getCurrentUser as readCurrentUser,
  getStoredUsers,
  clearCurrentUser,
  saveCurrentUser,
  saveStoredUsers,
} from "./storage";
import type { StoredUser, User } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const normalizedEmail = email.trim().toLowerCase();
  const matchingUser = getStoredUsers().find(
    (user) =>
      user.email === normalizedEmail && user.password === password,
  );

  if (!matchingUser) {
    throw new Error("Invalid email or password.");
  }

  const user = toPublicUser(matchingUser);
  saveCurrentUser(user);
  return user;
}

export function register(name: string, email: string, password: string): User {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2) {
    throw new Error("Enter a name with at least 2 characters.");
  }
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }
  if (password.length < 8) {
    throw new Error("Your password must be at least 8 characters.");
  }

  const users = getStoredUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account with this email already exists. Please log in instead.");
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
