"use client";

import { cn } from "@/lib/utils";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
    ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Doc } from "../../../../convex/_generated/dataModel";
import { getItemPadding } from "./constants";

interface TreeItemWrapperProps {
    item: Doc<"files">;
    children: React.ReactNode;
    level: number;
    isActive?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
    onCreateFolder?: () => void;
    onCreateFile?: () => void;
}

const TreeItemWrapper = ({
    item,
    children,
    level,
    isActive,
    onClick,
    onDoubleClick,
    onRename,
    onDelete,
    onCreateFolder,
    onCreateFile,
}: TreeItemWrapperProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <button
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onRename?.();
                        }
                    }}
                    className={cn(
                        "group flex items-center gap-2 w-full h-7 hover:bg-accent/50 outline-none focus:ring-1 focus:ring-inset focus:ring-primary rounded-sm transition-colors",
                        isActive && "bg-accent text-foreground"
                    )}
                    style={{
                        paddingLeft: getItemPadding(level, item.type === "file")
                    }}
                >
                    {children}
                </button>
            </ContextMenuTrigger>
            <ContextMenuContent
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="w-64"
            >
                {item.type === "folder" && (
                    <>
                        <ContextMenuItem
                            onClick={onCreateFile}
                            className="text-sm"
                        >
                            New File...
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={onCreateFolder}
                            className="text-sm"
                        >
                            New Folder...
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                    </>
                )}
                <ContextMenuItem
                    onClick={onRename}
                    className="text-sm"
                >
                    Rename...
                    <ContextMenuShortcut>Enter</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={onDelete}
                    className="text-sm text-destructive focus:text-destructive"
                >
                    Delete Permanently
                    <ContextMenuShortcut>⌘ Backspace</ContextMenuShortcut>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
};

export default TreeItemWrapper;
