import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { spawn } from "child_process";

// Maps projectId to port
const runningServers = new Map<string, number>();
let nextPort = 3001;

export async function POST(req: Request) {
    try {
        const { projectId } = await req.json();
        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        if (runningServers.has(projectId)) {
            return NextResponse.json({ url: `http://localhost:${runningServers.get(projectId)}` });
        }

        const { getToken } = await auth();
        const token = await getToken({ template: "convex" });

        const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        if (token) {
            client.setAuth(token);
        }

        const files = await client.query(api.files.getFiles, { projectId: projectId as Id<"projects"> });
        
        const previewDir = path.join(os.tmpdir(), `orbit-preview-${projectId}`);
        
        if (!fs.existsSync(previewDir)) {
            fs.mkdirSync(previewDir, { recursive: true });
        }

        // Reconstruct filesystem
        const fileMap = new Map<string, any>();
        files.forEach(f => fileMap.set(f._id, f));

        const getPath = (fileId: string): string => {
            const f = fileMap.get(fileId);
            if (!f) return "";
            if (!f.parentId) return f.name;
            return path.join(getPath(f.parentId), f.name);
        };

        for (const file of files) {
            const fullPath = path.join(previewDir, getPath(file._id));
            if (file.type === "folder") {
                if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
            } else {
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(fullPath, file.content || "");
            }
        }

        const port = nextPort++;
        runningServers.set(projectId, port);

        // Run install and dev
        const shellCmd = process.platform === "win32" ? "npm.cmd" : "npm";
        
        // Asynchronously spawn and wait for readiness
        await new Promise<void>((resolve, reject) => {
            const child = spawn(shellCmd, ["install"], { cwd: previewDir, shell: true });
            
            child.on("close", (code) => {
                if (code !== 0) {
                    console.error(`[Preview Err ${projectId}]: npm install failed with code ${code}`);
                    // Resolve anyway to try running dev, though it might fail
                }
                const devChild = spawn(shellCmd, ["run", "dev", "--", "--port", port.toString()], { cwd: previewDir, shell: true });
                console.log(`Started dev server for ${projectId} on port ${port}`);
                
                let resolved = false;
                devChild.stdout.on('data', (data) => {
                    const out = data.toString();
                    console.log(`[Preview ${projectId}]: ${out}`);
                    if (!resolved && (out.toLowerCase().includes('ready') || out.toLowerCase().includes('started server') || out.includes('localhost:'))) {
                        resolved = true;
                        resolve();
                    }
                });
                devChild.stderr.on('data', (data) => console.error(`[Preview Err ${projectId}]: ${data}`));
                
                // Fallback timeout in case the output doesn't match our 'ready' strings
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                }, 10000); // give it up to 10 seconds after install finishes
            });
        });

        return NextResponse.json({ url: `http://localhost:${port}` });
    } catch (error: any) {
        console.error("Preview endpoint error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error", stack: error.stack }, { status: 500 });
    }
}
