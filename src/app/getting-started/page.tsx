import Link from "next/link";
import { ArrowLeftIcon, RocketIcon, FolderGit2Icon, ComputerIcon } from "lucide-react";

export default function GettingStartedPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
                    <ArrowLeftIcon className="mr-2 size-4" /> Back to Dashboard
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">Getting Started with Orbit</h1>
                <p className="text-xl text-muted-foreground mb-12">Orbit IDE is your professionally stupendous AI-powered workspace. Here is how to begin.</p>

                <div className="grid gap-8">
                    <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex gap-6 items-start hover:bg-card/50 transition-colors">
                        <div className="p-3 rounded-lg bg-primary/10">
                            <RocketIcon className="size-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">1. Start Afresh</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Click the "New Project" button on the dashboard and choose "Start Afresh". This will initialize a clean, empty workspace securely synced to your cloud database.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex gap-6 items-start hover:bg-card/50 transition-colors">
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                            <FolderGit2Icon className="size-6 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">2. Import your existing work</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Already have a Next.js or React app? Select "Import from Device" in the New Project dialog. You can authorize Orbit to recursively read a local folder and bulk-upload your entire architecture into the cloud instantly.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex gap-6 items-start hover:bg-card/50 transition-colors">
                        <div className="p-3 rounded-lg bg-purple-500/10">
                            <ComputerIcon className="size-6 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">3. Explore the Playground</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Once inside the IDE, open the Conversation Sidebar to access Gemini 2.5 Flash, or toggle the Terminal at the bottom to orchestrate your application. Orbit abstracts the infrastructure so you can focus on writing amazing code.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
