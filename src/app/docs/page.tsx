import Link from "next/link";
import { ArrowLeftIcon, SparklesIcon, TerminalIcon, GlobeIcon } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
                    <ArrowLeftIcon className="mr-2 size-4" /> Back to Dashboard
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Documentation</h1>
                <p className="text-xl text-muted-foreground mb-12">Learn how to make the most out of Orbit IDE's powerful AI features.</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <SparklesIcon className="size-6 text-primary" />
                            AI Conversation Sidebar
                        </h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                            <p>Orbit IDE comes with an integrated Google Gemini 2.5 Flash agent that understands your entire codebase. You can open the Conversation Sidebar to chat directly with the AI.</p>
                            <p>Because the AI is injected with your project context, you can ask questions like "Where is the authentication logic?" or "Refactor the Button component to use variants."</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <GlobeIcon className="size-6 text-emerald-500" />
                            Web Scraping with Firecrawl
                        </h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                            <p>When you ask the AI to read an external documentation URL or reference a website, Orbit automatically uses Firecrawl to fetch the markdown contents of that page and injects it into the AI's context window. You can also manually scrape pages using the Globe icon in the Sidebar.</p>
                            <div className="p-4 bg-muted rounded-lg border border-border">
                                <strong>Try it:</strong> Paste a URL like `https://react.dev/reference/react/useState` in the chat and ask the AI to summarize it!
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <TerminalIcon className="size-6 text-purple-500" />
                            Intelligent Terminal
                        </h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                            <p>The integrated terminal mimics a standard UNIX environment. It supports common mock commands for UI fidelity and also allows you to execute operations like pushing to GitHub seamlessly.</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Type <code className="bg-card px-1.5 py-0.5 rounded text-primary">git push</code> to simulate a deployment.</li>
                                <li>The terminal automatically guards against sensitive folders like <code className="bg-card px-1.5 py-0.5 rounded text-primary">node_modules</code>.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
