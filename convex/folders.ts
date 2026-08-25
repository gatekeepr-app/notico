import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function getSession(ctx: any, token: string) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .unique();
  if (!session || session.expiresAt < Date.now()) return null;
  return session;
}

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.token);
    if (!session) return [];
    return await ctx.db
      .query("folders")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string(), parentId: v.optional(v.id("folders")), token: v.string() },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.token);
    if (!session) throw new Error("Not authenticated");
    return await ctx.db.insert("folders", {
      name: args.name,
      parentId: args.parentId,
      userId: session.userId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { folderId: v.id("folders"), token: v.string() },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.token);
    if (!session) throw new Error("Not authenticated");
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== session.userId) throw new Error("Not found");
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
  args: { folderId: v.id("folders"), name: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.token);
    if (!session) throw new Error("Not authenticated");
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== session.userId) throw new Error("Not found");
    await ctx.db.patch(args.folderId, { name: args.name });
  },
});
