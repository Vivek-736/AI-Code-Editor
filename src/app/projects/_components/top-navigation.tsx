import { cn } from "@/lib/utils";
import { 
    ScrollArea, 
    ScrollBar 
} from "@/components/ui/scroll-area";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "@/hooks/use-editor";
import { useFile } from "@/hooks/use-files";
import { Spinner } from "@/components/ui/spinner";
import { FileIcon } from "@react-symbols/icons/utils";
import { XIcon } from "lucide-react";

const Tab = ({
    fileId,
    projectId,
    isFirst,
}: {
    fileId: Id<"files">;
    isFirst: boolean;
    projectId: Id<"projects">;
}) => {
    const file = useFile(fileId);
    const {
        previewTabId,
        activeTabId,
        setActiveTab,
        openFile,
        closeTab,
    } = useEditor(projectId);

    const isActive = activeTabId === fileId;
    const isPreview = previewTabId === fileId;
    const fileName = file?.name ?? "Loading...";

    return (
        <div
            onClick={() => setActiveTab(fileId)}
            onDoubleClick={() => openFile(fileId, { pinned: true })}
            className={cn(
                "flex items-center gap-2 h-9 pl-3 pr-2 cursor-pointer text-muted-foreground group border-r border-border hover:bg-accent/50 transition-colors",
                isActive && "bg-card text-foreground shadow-sm",
                isFirst && "border-l-0"
            )}
        >
            {file === undefined ? (
                <Spinner 
                    className="text-primary"
                />
            ) : (
                <FileIcon
                    fileName={fileName}
                    autoAssign
                    className="size-4"
                />
            )}
            <span 
                className={cn(
                    "text-sm whitespace-nowrap font-medium",
                    isPreview && "italic"
                )}
            >
                {fileName}
            </span>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTab(fileId);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        closeTab(fileId);
                    }
                }}
                className={cn(
                    "p-1 rounded-sm hover:bg-accent/70 opacity-0 group-hover:opacity-100 transition-opacity",
                    isActive && "opacity-100"
                )}
            >
                <XIcon className="size-3.5" />
            </button>
        </div>
    )
};

const TopNavigation = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { openTabs } = useEditor(projectId);
    
    return (
        <ScrollArea className="flex-1">
            <nav className="bg-card flex items-center h-9 border-b border-border">
                {openTabs.map((fileId, index) => (
                    <Tab 
                        key={fileId}
                        fileId={fileId}
                        isFirst={index === 0}
                        projectId={projectId}
                    />
                ))}
            </nav>
            
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

export default TopNavigation;
