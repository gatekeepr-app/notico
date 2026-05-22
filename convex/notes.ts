import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { folderId: v.optional(v.id("folders")) },
  handler: async (ctx, args) => {
    if (args.folderId) {
      return await ctx.db
        .query("notes")
        .withIndex("by_folder", (q) => q.eq("folderId", args.folderId!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("notes")
      .withIndex("by_updated")
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.noteId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.optional(v.string()),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("notes", {
      title: args.title,
      content: args.content ?? "",
      tags: [],
      folderId: args.folderId,
      isPinned: false,
      isPublished: false,
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
  },
  handler: async (ctx, args) => {
    const { noteId, ...fields } = args;
    await ctx.db.patch(noteId, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.noteId);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withSearchIndex("search_content", (q) => q.search("content", args.query))
      .take(20);
  },
});

export const getAllTags = query({
  handler: async (ctx) => {
    const notes = await ctx.db.query("notes").collect();
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

export const migrateRemoveCompiled = mutation({
  handler: async (ctx) => {
    const notes = await ctx.db.query("notes").collect();
    for (const note of notes) {
      if ("compiled" in note) {
        await ctx.db.replace(note._id, {
          title: note.title,
          content: note.content,
          excerpt: note.excerpt,
          tags: note.tags,
          folderId: note.folderId,
          isPinned: note.isPinned ?? false,
          isPublished: note.isPublished,
          publishedSlug: note.publishedSlug,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        });
      }
    }
  },
});

export const listByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .collect()
      .then((notes) => notes.filter((n) => n.tags.includes(args.tag)));
  },
});
