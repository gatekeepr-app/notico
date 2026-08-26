import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    deviceName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) throw new Error("Email already in use");

    const passwordHash = await hashPassword(args.password);
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      passwordHash,
      createdAt: Date.now(),
    });

    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId,
      token,
      deviceName: args.deviceName,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    return { userId, token };
  },
});

export const login = mutation({
  args: { email: v.string(), password: v.string(), deviceName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) throw new Error("Invalid email or password");

    const passwordHash = await hashPassword(args.password);
    if (passwordHash !== user.passwordHash) throw new Error("Invalid email or password");

    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      deviceName: args.deviceName,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    return { userId: user._id, token };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (session) await ctx.db.delete(session._id);
  },
});

export const me = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    if (!user) return null;
    return { userId: user._id, email: user.email, name: user.name };
  },
});

export const listSessions = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const current = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!current || current.expiresAt < Date.now()) return [];

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", current.userId))
      .collect();

    return sessions
      .filter((session) => session.expiresAt >= Date.now())
      .map((session) => ({
        id: session._id,
        name: session.deviceName ?? "Mystery Blob",
        current: session._id === current._id,
        createdAt: session.createdAt ?? session._creationTime,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});
