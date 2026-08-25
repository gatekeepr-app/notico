import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const generate = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const allCodes = await ctx.db.query("pairing_codes").collect();
    for (const old of allCodes) {
      if (old.userId === session.userId) await ctx.db.delete(old._id);
    }

    const code = generateCode();
    await ctx.db.insert("pairing_codes", {
      userId: session.userId,
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return code;
  },
});

export const validate = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const pairing = await ctx.db
      .query("pairing_codes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();

    if (!pairing) return { valid: false as const, error: "Invalid code" };
    if (pairing.expiresAt < Date.now()) return { valid: false as const, error: "Code expired" };

    return { valid: true as const, userId: pairing.userId };
  },
});
