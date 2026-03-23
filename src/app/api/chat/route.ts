import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import FirecrawlApp from "@mendable/firecrawl-js";
import { auth } from "@clerk/nextjs/server";

export const maxDuration = 30;

export async function POST(req: Request) {
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return new Response("Invalid JSON body", { status: 400 });
    }
    const { messages, projectId } = body;
    
    try {

    let systemPrompt = "You are a senior AI Assistant integrated into Orbit IDE. You help the user write, debug, and understand code.\n";
    systemPrompt += "You can create files, update files, and list project files using the provided tools. Always list files if you need to know the structure or file IDs.\n";

    // Re-integrate Firecrawl for context
    const lastMessage = messages[messages.length - 1];
    const urlMatch = lastMessage?.content?.match?.(/https?:\/\/[^\s]+/);
    if (urlMatch) {
        try {
            const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
            const scrapeResult = await (app as any).scrapeUrl(urlMatch[0], { formats: ['markdown'] });
            if (scrapeResult.success && scrapeResult.markdown) {
                systemPrompt += `\n\nThe user shared this URL: ${urlMatch[0]}\nHere is the scraped content:\n${scrapeResult.markdown.substring(0, 6000)}`;
            }
        } catch (e) {
            console.error("Scraping failed", e);
        }
    }

    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    if (token) {
        convex.setAuth(token);
    }

    const result = streamText({
        model: google('gemini-1.5-flash'), // Stable tool support
        system: systemPrompt,
        messages,
        // @ts-ignore
        tools: {
            createFile: tool({
                description: 'Create a new file in the project',
                parameters: z.object({
                    name: z.string().describe('The name of the file'),
                    content: z.string().describe('The content of the file'),
                    parentId: z.string().optional().describe('The ID of the parent folder (optional)')
                }),
                execute: async ({ name, content, parentId }) => {
                    await convex.mutation(api.files.createFile, {
                        projectId: projectId as Id<"projects">,
                        name,
                        content,
                        parentId: parentId as any
                    });
                    return { success: true, message: `File ${name} created successfully.` };
                }
            }),
            updateFile: tool({
                description: 'Update an existing file content',
                parameters: z.object({
                    id: z.string().describe('The ID of the file to update'),
                    content: z.string().describe('The new content of the file')
                }),
                execute: async ({ id, content }) => {
                    await convex.mutation(api.files.updateFile, {
                        id: id as any,
                        content
                    });
                    return { success: true, message: 'File updated successfully.' };
                }
            }),
            listFiles: tool({
                description: 'List all files and folders in the project to get their IDs and structure',
                parameters: z.object({}),
                execute: async () => {
                    const files = await convex.query(api.files.getFiles, { projectId: projectId as Id<"projects"> });
                    return { files: files.map(f => ({ id: f._id, name: f.name, type: f.type, parentId: f.parentId })) };
                }
            })
        }
    });

    return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error", stack: error.stack }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}