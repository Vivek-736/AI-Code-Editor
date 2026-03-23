'use client';

import Image from "next/image";
import { useEditor } from "@/hooks/use-editor";
import { Id } from "../../../../convex/_generated/dataModel";
import TopNavigation from "./top-navigation";
import FileBreadcrumbs from "./file-breadcrumbs";
import { useFile, useUpdateFile } from "@/hooks/use-files";
import CodeEditor from "./code-editor";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_DELAY = 1500;

const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { activeTabId } = useEditor(projectId);
    const activeFile = useFile(activeTabId);
    const updateFile = useUpdateFile();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isActiveFileBinary = activeFile && activeFile.storageId;
    const isActiveFileText = activeFile && !activeFile.storageId;

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [activeTabId]);

    return (
        <div className="h-full flex flex-col bg-black">
            <div className="flex items-center border-b border-border bg-black h-10">
                <TopNavigation
                    projectId={projectId}
                />
            </div>
            <div className="px-3 py-1.5 border-b border-border bg-black flex justify-between items-center">
                <FileBreadcrumbs projectId={projectId} />
            </div>
            <div className="flex-1 min-h-0 bg-black overflow-hidden relative">
                {!activeFile && (
                    <div className="size-full flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <Image
                                src={"/logo-alt.svg"}
                                alt="Orbit"
                                width={80}
                                height={80}
                                className="opacity-10 mx-auto"
                            />
                            <p className="text-muted-foreground text-sm">
                                Select a file to edit
                            </p>
                        </div>
                    </div>
                )}

                {isActiveFileText && (
                    <CodeEditor
                        key={activeFile._id}
                        fileName={activeFile.name}
                        initialValue={activeFile.content}
                        onChange={(content: string) => {
                            if (timeoutRef.current) {
                                clearTimeout(timeoutRef.current);
                            }

                            timeoutRef.current = setTimeout(() => {
                                updateFile({ id: activeFile._id, content });
                            }, DEBOUNCE_DELAY);
                        }}
                    />
                )}
                {isActiveFileBinary && (
                    <div className="size-full flex items-center justify-center">
                        <p className="text-muted-foreground">
                            Preview not available for binary files.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EditorView;
