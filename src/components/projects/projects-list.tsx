import { Kbd } from "../ui/kbd";
import { useProjectsPartial } from "@/hooks/use-projects";
import { Spinner } from "../ui/spinner";
import { Doc } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import { AlertCircleIcon, ArrowRightIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";

const formatTimeStamp = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

const getProjectIcon = (project: Doc<"projects">) => {
    if (project.importStatus === "completed") {
        return <FaGithub className="size-3.5 text-muted-foreground" />;
    }

    if (project.importStatus === "failed") {
        return <AlertCircleIcon className="size-3.5 text-muted-foreground" />;
    }

    if (project.importStatus === "importing") {
        return (
            <Loader2Icon 
                className="size-3.5 text-muted-foreground animate-spin" 
            />
        );
    }

    return <GlobeIcon className="size-3.5 text-muted-foreground" />;
};

interface ProjectsListProps {
    onViewAll: () => void
}

const ContinueCard = ({ data }: { data: Doc<"projects"> }) => {
    return (
        <div className="flex flex-col gap-3">
            <Button
                variant={"outline"}
                asChild
                className="h-auto items-start justify-start p-5 bg-card border-border hover:border-primary/50 hover:bg-card/80 flex flex-col gap-3 rounded-lg transition-all duration-200"
            >
                <Link href={`/projects/${data._id}`} className="group">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-md bg-primary/10">
                                {getProjectIcon(data)}
                            </div>
                            <span className="font-semibold text-base truncate text-foreground">
                                {data.name}
                            </span>
                        </div>
                        <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Last opened {formatTimeStamp(data.updatedAt)}</span>
                    </div>
                </Link>
            </Button>
        </div>
    )
};

const ProjectItem = ({ data }: { data: Doc<"projects"> }) => {
    return (
        <Link 
            href={`/projects/${data._id}`}
            className="text-sm text-foreground hover:bg-accent/50 py-2.5 px-3 rounded-md flex items-center justify-between w-full group transition-colors"
        >
            <div className="flex items-center gap-2.5">
                {getProjectIcon(data)}
                <span className="truncate font-medium">
                    {data.name}
                </span>
            </div>
            <span className="text-xs text-muted-foreground">
                {formatTimeStamp(data.updatedAt)}
            </span>
        </Link>
    );
};

const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
    const projects = useProjectsPartial(6);

    if (projects === undefined) {
        return <Spinner className="size-4 text-ring" />;
    }

    const [mostRecent, ...rest] = projects;

    return (
        <div className="flex flex-col gap-4">
            {mostRecent ? <ContinueCard data={mostRecent} /> : null}
            {rest.length > 0 && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 px-1">
                        <button onClick={onViewAll} className="flex items-center gap-2 text-muted-foreground text-xs hover:text-primary transition-colors">
                            <span>View all projects</span>
                            <Kbd className="bg-muted border-border">
                                ⌘ K
                            </Kbd>
                        </button>
                    </div>
                    <div className="flex flex-col">
                        {rest.map((project) => (
                            <ProjectItem 
                                key={project._id}
                                data={project}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

export default ProjectsList;
