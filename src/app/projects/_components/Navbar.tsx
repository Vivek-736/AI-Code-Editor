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
        <nav className="flex justify-between font-sans items-center gap-x-4 px-4 py-2 bg-background border-b border-border h-10">
            <div className="flex items-center gap-x-4">
                <Breadcrumb>
                    <BreadcrumbList className="gap-0 sm:gap-0">
                        <BreadcrumbItem>
                            <BreadcrumbLink className="flex items-center gap-2" asChild>
                                <Button
                                    variant={"ghost"}
                                    className="w-fit! p-1! h-7 opacity-70 hover:opacity-100 hover:bg-transparent"
                                    asChild
                                >
                                    <Link href={"/"}>
                                        <Image
                                            src={"/favicon.svg"}
                                            alt="Favicon Orbit"
                                            width={20}
                                            height={20}
                                        />
                                        <span
                                            className={cn(
                                                "text-sm font-semibold text-foreground hidden md:block",
                                                font.className
                                            )}
                                        >
                                            Orbit
                                        </span>
                                    </Link>
                                </Button>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="mx-2 text-muted-foreground/40" />
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
                                    className="text-sm bg-transparent px-2 py-0.5 -ml-2 rounded text-foreground outline-none border border-primary font-medium max-w-40 truncate"
                                />
                            ) : (
                                <BreadcrumbPage
                                    onClick={handleStartRename}
                                    className="text-sm mb-0 max-w-40 truncate cursor-pointer text-foreground/80 hover:text-foreground hover:bg-muted/50 px-2 py-0.5 -ml-2 rounded transition-colors"
                                >
                                    {project?.name || "Loading..."}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center">
                    {project?.importStatus === "importing" ? (
                        <div className="flex items-center gap-1.5 px-2">
                            <Loader2Icon className="text-muted-foreground size-3 animate-spin" />
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Importing</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-2 opacity-0 hover:opacity-100 transition-opacity">
                            <CloudCheckIcon className="text-emerald-500/50 size-3" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-6 h-6",
                            rootBox: "flex items-center"
                        }
                    }}
                />
            </div>
        </nav>
    )
}

export default Navbar;
