import { ProjectIdLayout } from "@/components/projects/project-id-layout";

const ProjectLayout = async ({
    children, 
    params 
}: { 
    children: React.ReactNode,
    params: Promise<{ projectId: string }>
}) => {
    const { projectId } =  await params;

    return (
        <ProjectIdLayout projectId={projectId}>
            {children}
        </ProjectIdLayout>
    )
}

export default ProjectLayout;
