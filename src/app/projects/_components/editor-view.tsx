import Image from "next/image";
import { useEditor } from "@/hooks/use-editor";
import { Id } from "../../../../convex/_generated/dataModel";
import TopNavigation from "./top-navigation";
import FileBreadcrumbs from "./file-breadcrumbs";
import { useFile } from "@/hooks/use-files";
import CodeEditor from "./code-editor";

const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { activeTabId } = useEditor(projectId);
    const activeFile = useFile(activeTabId);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center">
                <TopNavigation
                    projectId={projectId}
                />
            </div>
            {activeTabId && <FileBreadcrumbs projectId={projectId} />}
            <div className="flex-1 min-h-0 bg-background">
                {!activeFile && (
                    <div className="size-full flex items-center justify-center">
                        <Image
                            src={"/logo-alt.svg"}
                            alt="Orbit"
                            width={50}
                            height={50}
                            className="opacity-25"
                        />
                    </div>
                )}
                {activeFile && <CodeEditor />}
            </div>
        </div>
    )
}

export default EditorView;
