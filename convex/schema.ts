import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]).index("by_user", ["userId"]),

  pairing_codes: defineTable({
    userId: v.id("users"),
    code: v.string(),
    expiresAt: v.number(),
  }).index("by_code", ["code"]),

  notes: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    tags: v.array(v.string()),
    folderId: v.optional(v.id("folders")),
    userId: v.optional(v.id("users")),
    isPinned: v.optional(v.boolean()),
    isPublished: v.boolean(),
    publishedSlug: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_folder", ["folderId"])
    .index("by_updated", ["updatedAt"])
    .index("by_user", ["userId"])
    .searchIndex("search_content", { searchField: "content", filterFields: ["folderId", "userId"] }),

  folders: defineTable({
    name: v.string(),
    parentId: v.optional(v.id("folders")),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_parent", ["parentId"]).index("by_user", ["userId"]),

  attachments: defineTable({
    noteId: v.id("notes"),
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    createdAt: v.number(),
  }).index("by_note", ["noteId"]),
});
