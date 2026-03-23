"use client";

import { useEffect, useRef, useState } from "react";
import { EditorView, keymap, drawSelection, highlightActiveLine } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { history, historyKeymap, defaultKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { TerminalIcon, XIcon } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";

export const TerminalView = ({ projectId, onClose }: { projectId: Id<"projects">, onClose?: () => void }) => {
    const { setPreviewUrl } = useSidebarStore();
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        if (!editorRef.current || isInit) return;
        
        const initialDoc = "Orbit IDE Terminal v1.2.0\nType `help` for commands.\n\n$ ";
        
        const executeCommand = async (cmd: string): Promise<string> => {
            const trimmed = cmd.trim();
            if (!trimmed) return "\n$ ";
            
            if (trimmed === "clear") return "CLEAR_TERMINAL";
            
            let output = "";
            if (trimmed === "git push") {
                toast.loading("Simulating push...", { id: "gh" });
                try {
                    const res = await fetch("/api/github", {
                        method: "POST",
                        body: JSON.stringify({ projectId, command: cmd }),
                        headers: { "Content-Type": "application/json" }
                    });
                    const data = await res.json();
                    toast.success("Push successful", { id: "gh" });
                    output = `\n${data.message || "Done."}`;
                } catch (e) {
                    toast.error("Push failed", { id: "gh" });
                    output = `\nError: Connection failed.`;
                }
            } else if (trimmed === "npm run dev") {
                output = "\n> orbit-project@0.1.0 dev\n> next dev\n\n[orbit] Reconstructing filesystem...\n[orbit] Running npm install...\n[orbit] Starting dev server on http://localhost:3001";
                
                fetch("/api/preview", {
                    method: "POST",
                    body: JSON.stringify({ projectId }),
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                })
                .then(res => res.json())
                .then(data => {
                    if (data.url) setPreviewUrl(data.url);
                })
                .catch(e => console.error("Terminal preview trigger failed:", e));

                toast.info("Starting preview from terminal...", { id: "terminal-preview" });
            } else if (trimmed.startsWith("npm")) {
                output = `\n> ${trimmed}\n\nOperation successful. 12 packages updated.`;
            } else if (trimmed.startsWith("apt")) {
                output = `\napt: command not found (Orbit Terminal uses npm/git in a containerized environment)`;
            } else if (trimmed === "ls") {
                output = `\nsrc/  public/  convex/  package.json  next.config.ts`;
            } else if (trimmed === "help") {
                output = `\nAvailable: ls, clear, git push, npm install, npm run dev, whoami, help`;
            } else {
                output = `\nbash: ${trimmed}: command not found`;
            }
            
            return `${output}\n$ `;
        };

        const terminalKeymap = keymap.of([
            {
                key: "Enter",
                run: (target) => {
                    const doc = target.state.doc.toString();
                    const lastLineIdx = doc.lastIndexOf("\n") + 1;
                    const lastLine = doc.slice(lastLineIdx);
                    
                    if (lastLine.startsWith("$ ")) {
                        const cmd = lastLine.slice(2);
                        executeCommand(cmd).then(result => {
                            if (result === "CLEAR_TERMINAL") {
                                target.dispatch({
                                    changes: { from: 0, to: target.state.doc.length, insert: "$ " }
                                });
                            } else {
                                target.dispatch({
                                    changes: { from: target.state.doc.length, insert: result },
                                    selection: { anchor: target.state.doc.length + result.length }
                                });
                            }
                            target.dispatch({ effects: EditorView.scrollIntoView(target.state.doc.length) });
                        });
                        return true;
                    }
                    return false;
                }
            },
            {
                key: "Backspace",
                run: (target) => {
                    const pos = target.state.selection.main.head;
                    const doc = target.state.doc.toString();
                    const lastLineIdx = doc.lastIndexOf("\n") + 1;
                    if (pos <= lastLineIdx + 2) return true;
                    return false;
                }
            },
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab
        ]);

        const view = new EditorView({
            state: EditorState.create({
                doc: initialDoc,
                extensions: [
                    oneDark,
                    history(),
                    drawSelection(),
                    highlightActiveLine(),
                    bracketMatching(),
                    syntaxHighlighting(defaultHighlightStyle),
                    terminalKeymap,
                    EditorView.theme({
                        "&": { height: "100%", fontSize: "14px", fontFamily: "'Fira Code', monospace" },
                        ".cm-scroller": { overflow: "auto" },
                        ".cm-content": { padding: "10px" },
                        "&.cm-focused": { outline: "none" },
                        ".cm-cursor": { borderLeft: "2px solid #8b5cf6" }
                    })
                ]
            }),
            parent: editorRef.current!
        });

        viewRef.current = view;
        setIsInit(true);
        setTimeout(() => view.focus(), 200);

        return () => view.destroy();
    }, [projectId, isInit]);

    return (
        <div className="h-full flex flex-col bg-[#0B0914] border-t border-border/50">
            <div className="flex flex-row items-center justify-between px-4 py-2 bg-[#0B0914] border-b border-border/50 shrink-0 select-none">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="size-3.5 text-primary" />
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Terminal</span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground">
                        <XIcon className="size-4" />
                    </button>
                )}
            </div>
            <div 
                ref={editorRef} 
                className="flex-1 min-h-0 overflow-hidden cursor-text" 
                onClick={() => viewRef.current?.focus()}
            />
        </div>
    );
};