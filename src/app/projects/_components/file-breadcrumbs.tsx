import { FileIcon } from "@react-symbols/icons/utils";
import { useFilePath } from "@/hooks/use-files";
import { useEditor } from "@/hooks/use-editor";
import { 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Id } from "../../../../convex/_generated/dataModel";
import React from "react";

const FileBreadcrumbs = ({
    projectId 
} : {
    projectId: Id<"projects">
}) => {
    const { activeTabId } = useEditor(projectId);
    const filePath = useFilePath(activeTabId);

    if (filePath === undefined || !activeTabId) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList className="gap-1">
                {filePath.map((item, index) => {
                    const isLast = index === filePath.length - 1;

                    return (
                        <React.Fragment key={item._id}>
                            <BreadcrumbItem
                                className="text-xs"
                            >
                                {isLast ? (
                                    <BreadcrumbPage
                                        className="flex items-center gap-1.5 text-foreground font-medium"
                                    >
                                        <FileIcon 
                                            fileName={item.name}
                                            autoAssign
                                            className="size-3.5"
                                        />
                                        {item.name}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink 
                                        href="#"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator className="text-muted-foreground" />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default FileBreadcrumbs;
