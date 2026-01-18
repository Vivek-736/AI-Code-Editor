import { useEditor } from "@/hooks/use-editor";
import { Id } from "../../../../convex/_generated/dataModel";
import TopNavigation from "./top-navigation";

const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { activeTabId } = useEditor(projectId);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center">
                <TopNavigation
                    projectId={projectId}
                />
            </div>
        </div>
    )
}

export default EditorView;
