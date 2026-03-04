"use client";

import type { Echo, Postcard, ReceivedPostcard, User } from "@/types";

const STORAGE_KEYS = {
  user: "echodrop_user",
  echoes: "echodrop_echoes",
  postcards: "echodrop_postcards",
  received: "echodrop_received",
  allUsers: "echodrop_all_users",
} as const;

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.user, null);
}

export function setCurrentUser(user: User): void {
  setItem(STORAGE_KEYS.user, user);
  const users = getAllUsers();
  const existing = users.find((u) => u.id === user.id);
  if (!existing) {
    users.push(user);
    setItem(STORAGE_KEYS.allUsers, users);
  } else {
    const updated = users.map((u) => (u.id === user.id ? user : u));
    setItem(STORAGE_KEYS.allUsers, updated);
  }
}

function getAllUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.allUsers, []);
}

export function getEchoes(userId: string): Echo[] {
  const all = getItem<Record<string, Echo[]>>(STORAGE_KEYS.echoes, {});
  return all[userId] ?? [];
}

export function addEcho(echo: Echo): void {
  const all = getItem<Record<string, Echo[]>>(STORAGE_KEYS.echoes, {});
  const userEchoes = all[echo.userId] ?? [];
  userEchoes.push(echo);
  all[echo.userId] = userEchoes;
  setItem(STORAGE_KEYS.echoes, all);
}

export function deleteEcho(userId: string, echoId: string): void {
  const all = getItem<Record<string, Echo[]>>(STORAGE_KEYS.echoes, {});
  const userEchoes = (all[userId] ?? []).filter((e) => e.id !== echoId);
  all[userId] = userEchoes;
  setItem(STORAGE_KEYS.echoes, all);
}

export function updateEcho(userId: string, echoId: string, updates: Partial<Pick<Echo, "content" | "caption">>): void {
  const all = getItem<Record<string, Echo[]>>(STORAGE_KEYS.echoes, {});
  const userEchoes = (all[userId] ?? []).map((e) =>
    e.id === echoId ? { ...e, ...updates } : e
  );
  all[userId] = userEchoes;
  setItem(STORAGE_KEYS.echoes, all);
}

// Outbound postcards (sent by current user - for record keeping)
export function getSentPostcards(userId: string): Postcard[] {
  const all = getItem<Record<string, Postcard[]>>(STORAGE_KEYS.postcards, {});
  return all[userId] ?? [];
}

function addSentPostcard(postcard: Postcard): void {
  const all = getItem<Record<string, Postcard[]>>(STORAGE_KEYS.postcards, {});
  const sent = all[postcard.senderId] ?? [];
  sent.push(postcard);
  all[postcard.senderId] = sent;
  setItem(STORAGE_KEYS.postcards, all);
}

export function getReceivedPostcards(userId: string): ReceivedPostcard[] {
  const all = getItem<Record<string, ReceivedPostcard[]>>(STORAGE_KEYS.received, {});
  return all[userId] ?? [];
}

export function addReceivedPostcard(userId: string, postcard: ReceivedPostcard): void {
  const all = getItem<Record<string, ReceivedPostcard[]>>(STORAGE_KEYS.received, {});
  const received = all[userId] ?? [];
  received.unshift(postcard);
  all[userId] = received;
  setItem(STORAGE_KEYS.received, all);
}

export function savePostcard(userId: string, postcardId: string, saved: boolean): void {
  const all = getItem<Record<string, ReceivedPostcard[]>>(STORAGE_KEYS.received, {});
  const received = all[userId] ?? [];
  const updated = received.map((p) => (p.id === postcardId ? { ...p, saved } : p));
  all[userId] = updated;
  setItem(STORAGE_KEYS.received, all);
}

// Distribution: send postcard to a random user in the same city/area
export function sendPostcard(postcard: Postcard): void {
  addSentPostcard(postcard);

  const users = getAllUsers().filter(
    (u) => u.id !== postcard.senderId && u.city === postcard.city && u.area === postcard.area
  );

  const received: ReceivedPostcard = {
    ...postcard,
    receivedAt: new Date().toISOString(),
    saved: false,
  };

  if (users.length > 0) {
    // Pick random recipient
    const recipient = users[Math.floor(Math.random() * users.length)];
    addReceivedPostcard(recipient.id, received);
  } else {
    // No other users in city/area - store for demo: add to sender's inbox as "sample"
    addReceivedPostcard(postcard.senderId, received);
  }
}
