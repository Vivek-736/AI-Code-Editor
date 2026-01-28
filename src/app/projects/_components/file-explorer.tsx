'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    ChevronRightIcon, 
    CopyMinusIcon, 
    FilePlusIcon, 
    FolderPlusIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useProject } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { useCreateFile, useCreateFolder, useFolderContents } from "@/hooks/use-files";
import CreateInput from "./create-input";
import LoadingRow from "./loading-row";
import Tree from "./tree";

const FileExplorer = ({
    projectId 
}: { 
    projectId: Id<"projects"> 
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [collapseKey, setCollapseKey] = useState(0);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);
    const project = useProject(projectId);

    const rootFiles = useFolderContents({
        projectId,
        enabled: isOpen,
    })

    const createFile = useCreateFile();
    const createFolder = useCreateFolder();

    const handleCreate = (name: string) => {
        setCreating(null);

        if (creating === "file") {
            createFile({
                projectId,
                name,
                content: "",
                parentId: undefined,
            });
        } 
        else {
            createFolder({
                projectId,
                name,
                parentId: undefined,
            })
        }
    };

    return (
        <div className="h-full bg-sidebar border-r border-border">
            <ScrollArea className="h-full">
                <div
                    role="button"
                    onClick={() => setIsOpen((value) => !value)}
                    className="group/project cursor-pointer w-full text-left flex items-center gap-1 h-9 px-2 bg-card/50 font-semibold hover:bg-card/70 transition-colors border-b border-border"
                >
                    <ChevronRightIcon
                        className={cn(
                            "size-4 shrink-0 text-muted-foreground transition-transform",
                            isOpen && "rotate-90"
                        )}
                    />
                    <p className="text-xs uppercase line-clamp-1 tracking-wide text-foreground">
                        {project?.name ?? "Loading..."}
                    </p>
                    <div className="opacity-0 group-hover/project:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsOpen(true);
                                setCreating("file");
                            }}
                            variant={"ghost"}
                            size={"icon-xs"}
                            className="hover:bg-accent"
                        >
                            <FilePlusIcon 
                                className="size-3.5"
                            />
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsOpen(true);
                                setCreating("folder");
                            }}
                            variant={"ghost"}
                            size={"icon-xs"}
                            className="hover:bg-accent"
                        >
                            <FolderPlusIcon 
                                className="size-3.5"
                            />
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setCollapseKey((prev) => prev + 1);
                            }}
                            variant={"ghost"}
                            size={"icon-xs"}
                            className="hover:bg-accent"
                        >
                            <CopyMinusIcon 
                                className="size-3.5"
                            />
                        </Button>
                    </div>
                </div>
                
                {isOpen && (
                    <div className="py-1">
                        {rootFiles === undefined && <LoadingRow level={0} />}
                        {creating && (
                            <CreateInput 
                                type={creating}
                                onSubmit={handleCreate}
                                level={0}
                                onCancel={() => setCreating(null)}
                            />
                        )}
                        {rootFiles?.map((item) => (
                            <Tree 
                                key={`${item._id}-${collapseKey}`}
                                item={item}
                                level={0}
                                projectId={projectId}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

export default FileExplorer;
