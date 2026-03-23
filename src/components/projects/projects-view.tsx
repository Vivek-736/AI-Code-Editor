"use client";

import { cn } from "@/lib/utils";
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator
} from "unique-names-generator";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { Button } from "../ui/button";
import { SparklesIcon, TerminalIcon, FolderGit2Icon, LayoutGridIcon } from "lucide-react";
import { Kbd } from "../ui/kbd";
import { FaGithub } from "react-icons/fa";
import ProjectsList from "./projects-list";
import { useCreateProject } from "@/hooks/use-projects";
import { useEffect, useState } from "react";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

const ProjectsView = () => {
    const createProject = useCreateProject();
    const [commandDialogOpen, setCommandDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [githubDialogOpen, setGithubDialogOpen] = useState(false);
    const [githubUrl, setGithubUrl] = useState("");
    const createFile = useMutation(api.files.createFile);
    const createFolder = useMutation(api.files.createFolder);
    const router = useRouter();
    const [isImporting, setIsImporting] = useState(false);

    const SKIP_DIRS = ["node_modules", ".git", ".next", "dist", "build"];

    const handleGitHubImport = async () => {
        try {
            if (!githubUrl) return;
            setIsImporting(true);
            const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (!match) throw new Error("Invalid GitHub URL");
            const [, owner, repo] = match;
            
            const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo.replace(".git", "")}`);
            const repoData = await repoRes.json();
            const branch = repoData.default_branch || "main";

            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo.replace(".git", "")}/git/trees/${branch}?recursive=1`);
            const treeData = await treeRes.json();
            if (!treeData.tree) throw new Error("Failed to fetch repository tree");

            toast.loading(`Importing ${repo}...`, { id: "import" });
            const projectId = await createProject({ name: repo.replace(".git", "") });

            const folderIds = new Map<string, Id<"files">>();
            
            for (const item of treeData.tree) {
                if (item.type === "tree") {
                    const parts = item.path.split("/");
                    if (parts.some((p: string) => SKIP_DIRS.includes(p))) continue;
                    
                    const name = parts.pop();
                    const parentPath = parts.join("/");
                    
                    const parentId = parentPath ? folderIds.get(parentPath) : undefined;
                    const folderId = await createFolder({ projectId: projectId as Id<"projects">, parentId, name });
                    folderIds.set(item.path, folderId);
                }
            }
            
            for (const item of treeData.tree) {
                if (item.type === "blob") {
                    const parts = item.path.split("/");
                    if (parts.some((p: string) => SKIP_DIRS.includes(p))) continue;
                    
                    const name = parts.pop();
                    const parentPath = parts.join("/");
                    const parentId = parentPath ? folderIds.get(parentPath) : undefined;
                    
                    try {
                        const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo.replace(".git", "")}/${branch}/${item.path}`);
                        if (!rawRes.ok) continue;
                        const content = await rawRes.text();
                        if (content.length > 1024 * 1024 * 2) continue; 
                        
                        await createFile({ projectId: projectId as Id<"projects">, parentId, name, content });
                    } catch(e) { console.error("Failed file", item.path) }
                }
            }

            toast.success("GitHub repository imported!", { id: "import" });
            router.push(`/projects/${projectId}`);
        } catch (e: any) {
            toast.error(e.message || "Failed to import from GitHub", { id: "import" });
            setIsImporting(false);
        } finally {
            setGithubDialogOpen(false);
        }
    };

    const handleFolderImport = async () => {
        try {
            const dirHandle = await (window as any).showDirectoryPicker();
            setIsImporting(true);
            const projectName = dirHandle.name;
            toast.loading(`Creating project ${projectName}...`, { id: "import" });
            const projectId = await createProject({ name: projectName });

            const uploadDir = async (handle: any, parentId?: Id<"files">) => {
                for await (const entry of handle.values()) {
                    if (entry.kind === "file") {
                        try {
                            const file = await entry.getFile();
                            if (file.size > 1024 * 1024) continue;
                            const content = await file.text();
                            await createFile({ projectId: projectId as Id<"projects">, parentId, name: entry.name, content });
                        } catch (e) { console.warn("Could not read file", entry.name) }
                    } else if (entry.kind === "directory") {
                        if (SKIP_DIRS.includes(entry.name)) continue;
                        const newFolderId = await createFolder({ projectId: projectId as Id<"projects">, parentId, name: entry.name });
                        await uploadDir(entry, newFolderId);
                    }
                }
            };
            await uploadDir(dirHandle);
            toast.success("Folder imported successfully!", { id: "import" });
            router.push(`/projects/${projectId}`);
        } catch (e: any) {
            console.error(e);
            if (e.name !== "AbortError") {
                toast.error("Failed to import folder", { id: "import" });
            } else {
                toast.dismiss("import");
            }
            setIsImporting(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) {
                if (e.key === "k") {
                    e.preventDefault();
                    setCommandDialogOpen(true);
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <ProjectsCommandDialog
                open={commandDialogOpen}
                onOpenChange={setCommandDialogOpen}
            />

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                            How would you like to start your next great idea?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Button
                            variant="outline"
                            className="h-28 flex flex-col gap-2 hover:bg-card/60 transition-colors"
                            onClick={() => {
                                setCreateDialogOpen(false);
                                const projectName = uniqueNamesGenerator({
                                    dictionaries: [adjectives, colors, animals],
                                    separator: "-",
                                    length: 3,
                                    style: "lowerCase"
                                });
                                createProject({ name: projectName });
                            }}
                        >
                            <SparklesIcon className="size-6 text-primary mb-2" />
                            <span className="font-semibold text-foreground">Start Afresh</span>
                            <span className="text-xs text-muted-foreground font-normal">Empty workspace</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-28 flex flex-col gap-2 hover:bg-card/60 transition-colors"
                            disabled={isImporting}
                            onClick={() => {
                                setCreateDialogOpen(false);
                                handleFolderImport();
                            }}
                        >
                            <FolderGit2Icon className="size-6 text-emerald-500 mb-2" />
                            <span className="font-semibold text-foreground">Import from Device</span>
                            <span className="text-xs text-muted-foreground font-normal">Upload a local folder</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import from GitHub</DialogTitle>
                        <DialogDescription>
                            Enter the URL of a public GitHub repository.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                        <input 
                            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="https://github.com/facebook/react" 
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            disabled={isImporting}
                        />
                        <Button disabled={isImporting || !githubUrl} onClick={handleGitHubImport}>
                            {isImporting ? "Importing..." : "Import"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="min-h-screen font-sans bg-background flex flex-col p-8 md:p-12">
                <div className="w-full max-w-6xl mx-auto mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 group/logo">
                            <Image
                                src={"/favicon.svg"}
                                alt="Favicon Orbit"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <h1 className={cn("text-2xl font-semibold text-foreground tracking-tight", font.className)}>
                                Orbit
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-8 px-3"
                                onClick={() => setCommandDialogOpen(true)}
                            >
                                <span className="text-xs font-medium">Search</span>
                                <Kbd className="ml-2 bg-muted/50 border-border/50 text-[10px] min-h-[18px]">⌘K</Kbd>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-6xl mx-auto flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-xs font-medium text-muted-foreground mb-4 pl-1">
                                    Start
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCreateDialogOpen(true)}
                                        className="h-28 items-start justify-start p-5 bg-card/40 border-border/40 hover:bg-card/60 hover:border-border/80 flex flex-col gap-3 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <SparklesIcon className="size-4 text-primary" />
                                            </div>
                                            <Kbd className="bg-muted/50 border-border/50 text-[10px] min-h-[18px]">
                                                ⌘ J
                                            </Kbd>
                                        </div>
                                        <div className="text-left mt-auto">
                                            <h3 className="text-sm font-medium text-foreground">
                                                New Project
                                            </h3>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setGithubDialogOpen(true)}
                                        className="h-28 items-start justify-start p-5 bg-card/40 border-border/40 hover:bg-card/60 hover:border-border/80 flex flex-col gap-3 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-1.5 rounded-md bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                                                <FaGithub className="size-4 text-foreground" />
                                            </div>
                                            <Kbd className="bg-muted/50 border-border/50 text-[10px] min-h-[18px]">
                                                ⌘ I
                                            </Kbd>
                                        </div>
                                        <div className="text-left mt-auto">
                                            <h3 className="text-sm font-medium text-foreground">
                                                Import from GitHub
                                            </h3>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCommandDialogOpen(true)}
                                        className="h-28 items-start justify-start p-5 bg-card/40 border-border/40 hover:bg-card/60 hover:border-border/80 flex flex-col gap-3 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-1.5 rounded-md bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                                                <LayoutGridIcon className="size-4 text-purple-500" />
                                            </div>
                                        </div>
                                        <div className="text-left mt-auto">
                                            <h3 className="text-sm font-medium text-foreground">
                                                View All
                                            </h3>
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xs font-medium text-muted-foreground mb-4 pl-1">
                                    Learn
                                </h2>
                                <div className="grid grid-cols-1 gap-2">
                                    <a href="/getting-started" className="px-4 py-3 rounded-lg bg-card/20 border border-border/40 hover:bg-card/40 hover:border-border/60 transition-all duration-200 group">
                                        <div className="flex items-center gap-3">
                                            <TerminalIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                Getting Started Guide
                                            </span>
                                        </div>
                                    </a>
                                    <a href="/docs" className="px-4 py-3 rounded-lg bg-card/20 border border-border/40 hover:bg-card/40 hover:border-border/60 transition-all duration-200 group">
                                        <div className="flex items-center gap-3">
                                            <TerminalIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                Documentation
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xs font-medium text-muted-foreground mb-4 pl-1">
                                    Recent
                                </h2>
                                <ProjectsList
                                    onViewAll={() => setCommandDialogOpen(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectsView;
