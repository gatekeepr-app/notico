import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("folders").collect();
  },
});

export const create = mutation({
  args: { name: v.string(), parentId: v.optional(v.id("folders")) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("folders", {
      name: args.name,
      parentId: args.parentId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_folder", (q) => q.eq("folderId", args.folderId))
      .collect();
    for (const note of notes) {
      await ctx.db.patch(note._id, { folderId: undefined });
    }
    await ctx.db.delete(args.folderId);
  },
});

export const rename = mutation({
  args: { folderId: v.id("folders"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.folderId, { name: args.name });
  },
});
