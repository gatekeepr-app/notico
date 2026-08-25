import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    folderId: v.optional(v.id("folders")),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) return [];

    const now = Date.now();
    const isVisible = (n: { expiresAt?: number; isPinned?: boolean }) => n.isPinned || !n.expiresAt || n.expiresAt > now;

    if (args.folderId) {
      return await ctx.db
        .query("notes")
        .withIndex("by_folder", (q) => q.eq("folderId", args.folderId!))
        .order("desc")
        .collect()
        .then((notes) => notes.filter((n) => n.userId === session.userId && isVisible(n)));
    }
    return await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect()
      .then((notes) => notes.filter(isVisible));
  },
});

export const get = query({
  args: { noteId: v.id("notes"), token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) return null;

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== session.userId) return null;
    return note;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("folders")),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const now = Date.now();
    return await ctx.db.insert("notes", {
      title: args.title,
      content: args.content ?? "",
      tags: args.tags ?? [],
      folderId: args.folderId,
      userId: session.userId,
      isPinned: false,
      isPublished: false,
      expiresAt: now + 10 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("folders")),
    isPinned: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    publishedSlug: v.optional(v.string()),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== session.userId) throw new Error("Not found");

    const { noteId, token, ...fields } = args;
    await ctx.db.patch(noteId, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { noteId: v.id("notes"), token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== session.userId) throw new Error("Not found");

    await ctx.db.delete(args.noteId);
  },
});

export const search = query({
  args: { query: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) return [];

    const now = Date.now();
    return await ctx.db
      .query("notes")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.query).eq("userId", session.userId)
      )
      .take(20)
      .then((notes) => notes.filter((n) => n.isPinned || !n.expiresAt || n.expiresAt > now));
  },
});

export const getAllTags = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) return [];

    const now = Date.now();
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .collect()
      .then((ns) => ns.filter((n) => n.isPinned || !n.expiresAt || n.expiresAt > now));
    const tagCounts: Record<string, number> = {};
    for (const note of notes) {
      for (const tag of note.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },
});

export const listByTag = query({
  args: { tag: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) return [];

    const now = Date.now();
    return await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .collect()
      .then((notes) =>
        notes.filter((n) => n.tags.includes(args.tag) && (n.isPinned || !n.expiresAt || n.expiresAt > now))
      );
  },
});

export const cleanupExpired = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const now = Date.now();
    const expired = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .collect()
      .then((ns) => ns.filter((n) => n.expiresAt && n.expiresAt <= now && !n.isPinned));

    for (const note of expired) {
      await ctx.db.delete(note._id);
    }
    return { deleted: expired.length };
  },
});
