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

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

const ProjectsView = () => {
    const createProject = useCreateProject();
    const [commandDialogOpen, setCommandDialogOpen] = useState(false);

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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const projectName = uniqueNamesGenerator({
                                                dictionaries: [adjectives, colors, animals],
                                                separator: "-",
                                                length: 3,
                                                style: "lowerCase"
                                            });
                                            createProject({ name: projectName });
                                        }}
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
                                        onClick={() => {}}
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
                                        onClick={() => {}}
                                        className="h-28 items-start justify-start p-5 bg-card/40 border-border/40 hover:bg-card/60 hover:border-border/80 flex flex-col gap-3 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-1.5 rounded-md bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                                <FolderGit2Icon className="size-4 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="text-left mt-auto">
                                            <h3 className="text-sm font-medium text-foreground">
                                                Open Folder
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
                                    <a href="#" className="px-4 py-3 rounded-lg bg-card/20 border border-border/40 hover:bg-card/40 hover:border-border/60 transition-all duration-200 group">
                                        <div className="flex items-center gap-3">
                                            <TerminalIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                Getting Started Guide
                                            </span>
                                        </div>
                                    </a>
                                    <a href="#" className="px-4 py-3 rounded-lg bg-card/20 border border-border/40 hover:bg-card/40 hover:border-border/60 transition-all duration-200 group">
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
