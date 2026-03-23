"use client";

import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { useSidebarStore } from "@/store/sidebar-store";
import { FaGithub } from "react-icons/fa";
import { Allotment } from "allotment";
import FileExplorer from "./file-explorer";
import EditorView from "./editor-view";
import { CodeIcon, EyeIcon, TerminalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TerminalView } from "./terminal-view";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;

const Tab = ({
    label,
    icon: Icon,
    isActive,
    onClick
}: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    onClick: () => void
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 h-full px-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent",
                isActive && "text-foreground border-primary"
            )}
        >
            <span className="text-sm font-medium">{label}</span>
        </div>
    )
};

const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
    const { previewUrl, setPreviewUrl } = useSidebarStore();
    const [previewLoading, setPreviewLoading] = useState(false);
    const [showTerminal, setShowTerminal] = useState(true);

    useEffect(() => {
        if (previewUrl) {
            setActiveView("preview");
        }
    }, [previewUrl]);

    const startPreview = async () => {
        setPreviewLoading(true);
        toast.loading("Starting dev server...", { id: "preview" });
        try {
            const res = await fetch("/api/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId })
            });

            const data = await res.json();
            
            if (res.ok && data.url) {
                setPreviewUrl(data.url);
                toast.success("Server started!", { id: "preview" });
            } else {
                toast.error(data.error || "Failed to start server", { id: "preview" });
            }
        } catch (e) {
            toast.error("An error occurred", { id: "preview" });
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-background border-l border-border">
            <div className="flex items-center justify-between px-4 border-b h-10 bg-background text-foreground shrink-0 w-full">
                <div className="flex items-center gap-2 h-full">
                    <Tab
                        label="Editor"
                        icon={CodeIcon}
                        isActive={activeView === "editor"}
                        onClick={() => setActiveView("editor")}
                    />
                    <Tab
                        label="Preview"
                        icon={EyeIcon}
                        isActive={activeView === "preview"}
                        onClick={() => setActiveView("preview")}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowTerminal(!showTerminal)}
                        className={cn("h-7 px-2 text-xs gap-1.5", showTerminal && "bg-primary/10 text-primary")}
                    >
                        <TerminalIcon className="size-3.5" />
                        {showTerminal ? "Hide Terminal" : "Show Terminal"}
                    </Button>
                    <div className="flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer p-1">
                        <FaGithub className="size-5 text-muted-foreground hover:text-foreground" />
                    </div>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <Allotment vertical defaultSizes={[700, 300]}>
                    <Allotment.Pane>
                        <div className="h-full relative overflow-hidden">
                            <div className={cn(
                                "absolute inset-0 w-full h-full",
                                activeView === "editor" ? "visible z-10" : "invisible z-0"
                            )}>
                                <Allotment
                                    defaultSizes={[
                                        DEFAULT_SIDEBAR_WIDTH,
                                        DEFAULT_MAIN_SIZE
                                    ]}
                                >
                                    <Allotment.Pane
                                        snap
                                        minSize={MIN_SIDEBAR_WIDTH}
                                        maxSize={MAX_SIDEBAR_WIDTH}
                                        preferredSize={DEFAULT_SIDEBAR_WIDTH}
                                    >
                                        <div className="h-full border-r border-border">
                                            <FileExplorer
                                                projectId={projectId}
                                            />
                                        </div>
                                    </Allotment.Pane>
                                    <Allotment.Pane>
                                        <EditorView
                                            projectId={projectId}
                                        />
                                    </Allotment.Pane>
                                </Allotment>
                            </div>
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center bg-background w-full h-full",
                                activeView === "preview" ? "visible z-10" : "invisible z-0"
                            )}>
                                {previewUrl ? (
                                    <iframe 
                                        src={previewUrl} 
                                        className="w-full h-full border-0 bg-white"
                                        title="Preview"
                                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                    />
                                ) : (
                                    <div className="text-center space-y-4">
                                        <EyeIcon className="size-12 text-muted-foreground mx-auto" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-4">Preview Configuration</h3>
                                            <p className="text-sm text-muted-foreground max-w-sm mb-6 mx-auto">
                                                Clicking start will extract your files and run 'npm run dev' to boot up a live server instance.
                                            </p>
                                            <Button 
                                                onClick={startPreview} 
                                                disabled={previewLoading}
                                            >
                                                {previewLoading ? "Starting Development Server..." : "Start Preview"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Allotment.Pane>
                    {showTerminal && (
                        <Allotment.Pane minSize={100} preferredSize={300}>
                            <TerminalView 
                                projectId={projectId} 
                                onClose={() => setShowTerminal(false)} 
                            />
                        </Allotment.Pane>
                    )}
                </Allotment>
            </div>
        </div>
    )
}

export default ProjectIdView;
