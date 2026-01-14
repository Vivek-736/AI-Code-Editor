const ProjectIdPage = async ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { projectId } = await params;
    
    return (
        <div className="p-2 text-lg">
            Project ID Page - {projectId}
        </div>
    )
}

export default ProjectIdPage;
