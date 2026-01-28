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
            
            <div className="min-h-screen font-sans bg-background flex flex-col p-8 md:p-16">
                <div className="w-full max-w-7xl mx-auto mb-16">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 group/logo">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                <Image 
                                    src={"/favicon.svg"}
                                    alt="Favicon Orbit"
                                    width={42}
                                    height={42}
                                    className="object-contain relative z-10"
                                />
                            </div>
                            <h1 className={cn("text-5xl font-bold bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent", font.className)}>
                                Orbit
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => setCommandDialogOpen(true)}
                            >
                                <span className="text-sm">Search</span>
                                <Kbd className="ml-2">⌘K</Kbd>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
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
                                        className="h-32 items-start justify-start p-6 bg-card border-border hover:border-primary/50 hover:bg-card/80 flex flex-col gap-4 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <SparklesIcon className="size-5 text-primary" />
                                            </div>
                                            <Kbd className="bg-muted border-border">
                                                ⌘ J
                                            </Kbd>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-base font-semibold text-foreground mb-1">
                                                New Project
                                            </h3>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {}}
                                        className="h-32 items-start justify-start p-6 bg-card border-border hover:border-primary/50 hover:bg-card/80 flex flex-col gap-4 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-2 rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors">
                                                <FaGithub className="size-5 text-accent" />
                                            </div>
                                            <Kbd className="bg-muted border-border">
                                                ⌘ I
                                            </Kbd>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-base font-semibold text-foreground mb-1">
                                                Import from GitHub
                                            </h3>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {}}
                                        className="h-32 items-start justify-start p-6 bg-card border-border hover:border-primary/50 hover:bg-card/80 flex flex-col gap-4 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-2 rounded-md bg-chart-2/10 group-hover:bg-chart-2/20 transition-colors">
                                                <FolderGit2Icon className="size-5 text-chart-2" />
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-base font-semibold text-foreground mb-1">
                                                Open Folder
                                            </h3>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCommandDialogOpen(true)}
                                        className="h-32 items-start justify-start p-6 bg-card border-border hover:border-primary/50 hover:bg-card/80 flex flex-col gap-4 rounded-lg group transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-2 rounded-md bg-chart-3/10 group-hover:bg-chart-3/20 transition-colors">
                                                <LayoutGridIcon className="size-5 text-chart-3" />
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-base font-semibold text-foreground mb-1">
                                                View All Projects
                                            </h3>
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                    Learn
                                </h2>
                                <div className="grid grid-cols-1 gap-3">
                                    <a href="#" className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-200 group">
                                        <div className="flex items-center gap-3">
                                            <TerminalIcon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                                Getting Started Guide
                                            </span>
                                        </div>
                                    </a>
                                    <a href="#" className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-200 group">
                                        <div className="flex items-center gap-3">
                                            <TerminalIcon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                                Documentation
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
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
