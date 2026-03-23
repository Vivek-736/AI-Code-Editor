import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";

export const list = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get("projects", args.projectId);
        if (!project || project.ownerId !== identity.subject) return [];

        return await ctx.db
            .query("messages")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .order("asc")
            .collect();
    },
});

export const send = mutation({
    args: {
        projectId: v.id("projects"),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get("projects", args.projectId);
        if (!project || project.ownerId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.insert("messages", {
            projectId: args.projectId,
            role: args.role,
            content: args.content,
            createdAt: Date.now(),
        });
    },
});

export const clear = mutation({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get("projects", args.projectId);
        if (!project || project.ownerId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .collect();

        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
    },
});
