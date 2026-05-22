import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    tags: v.array(v.string()),
    folderId: v.optional(v.id("folders")),
    isPinned: v.optional(v.boolean()),
    isPublished: v.boolean(),
    publishedSlug: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_folder", ["folderId"])
    .index("by_updated", ["updatedAt"])
    .searchIndex("search_content", { searchField: "content", filterFields: ["folderId"] }),

  folders: defineTable({
    name: v.string(),
    parentId: v.optional(v.id("folders")),
    createdAt: v.number(),
  }).index("by_parent", ["parentId"]),

  attachments: defineTable({
    noteId: v.id("notes"),
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    createdAt: v.number(),
  }).index("by_note", ["noteId"]),
});
