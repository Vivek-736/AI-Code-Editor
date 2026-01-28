"use client";

import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import { useProject, useRenameProject } from "@/hooks/use-projects";
import { useState } from "react";
import { CloudCheckIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
    const project = useProject(projectId);
    const renameProject = useRenameProject();

    const [renaming, setRenaming] = useState(false);
    const [name, setName] = useState("");

    const handleStartRename = () => {
        if (!project) return;
        setName(project.name);
        setRenaming(true);
    }

    const handleSubmit = () => {
        if (!project) return;
        setRenaming(false);

        const trimmedName = name.trim();
        if (!trimmedName || trimmedName === project.name) return;

        renameProject({ id: projectId, name: trimmedName });
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        } else if (e.key === "Escape") {
            setRenaming(false);
        }
    }

    return (
        <nav className="flex justify-between font-sans items-center gap-x-4 px-4 py-2 bg-card border-b border-border shadow-sm">
            <div className="flex items-center gap-x-4">
                <Breadcrumb>
                    <BreadcrumbList className="gap-0!">
                        <BreadcrumbItem>
                            <BreadcrumbLink className="flex items-center gap-2" asChild>
                                <Button 
                                    variant={"ghost"}
                                    className="w-fit! p-2! h-10! hover:bg-accent"
                                    asChild
                                >
                                    <Link href={"/"}>
                                        <Image 
                                            src={"/favicon.svg"}
                                            alt="Favicon Orbit"
                                            width={28}
                                            height={28}
                                        />
                                        <span 
                                            className={cn(
                                                "text-xl font-semibold text-foreground",
                                                font.className
                                            )}
                                        >
                                            Orbit
                                        </span>
                                    </Link>
                                </Button>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="ml-0! mr-2" />
                        <BreadcrumbItem>
                            {renaming ? (
                                <input 
                                    type="text"
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onBlur={handleSubmit}
                                    onKeyDown={handleKeyDown}
                                    className="text-lg bg-muted px-2 py-1 rounded text-foreground outline-none focus:ring-2 focus:ring-primary font-medium max-w-40 truncate"
                                /> 
                            ) : (
                                <BreadcrumbPage
                                    onClick={handleStartRename}
                                    className="text-lg mb-0 max-w-40 truncate cursor-pointer hover:text-primary font-medium transition-colors"
                                >
                                    {project?.name || "Loading..."}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {project?.importStatus === "importing" ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Importing...
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CloudCheckIcon className="text-muted-foreground size-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Saved{" "}
                            {formatDistanceToNow(
                                project?.updatedAt || new Date(),
                                { addSuffix: true }
                            )}
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            <div className="flex items-center gap-2">
                <UserButton 
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8"
                        }
                    }}
                />
            </div>
        </nav>
    )
}

export default Navbar;
