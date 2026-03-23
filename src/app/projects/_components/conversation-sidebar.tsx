"use client";

import { useSidebarStore } from "@/store/sidebar-store";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookIcon,
    BotIcon,
    GlobeIcon,
    Loader2Icon,
    SendIcon,
    SparklesIcon,
    TrashIcon,
    UserIcon,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const ConversationSidebar = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { docs, addDoc, clearDocs } = useSidebarStore();
    const convexMessages = useQuery(api.messages.list, { projectId });
    const sendMessage = useMutation(api.messages.send);
    const clearHistory = useMutation(api.messages.clear);

    const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat({
        api: "/api/chat",
        body: { projectId },
        streamProtocol: "text",
        credentials: "omit",
        fetch: async (url: string, init?: RequestInit) => {
            return fetch(url, { ...init, credentials: "include" });
        },
        initialMessages: (convexMessages || []).map(m => ({
            id: m._id,
            role: m.role,
            content: m.content,
        })) as any,
        onFinish: async (message: any) => {
            await sendMessage({
                projectId,
                role: "assistant",
                content: message.content,
            });
        },
    } as any) as any;

    const [scrapeUrl, setScrapeUrl] = useState("");
    const [isScraping, setIsScraping] = useState(false);
    const [scrapeDialogOpen, setScrapeDialogOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Sync initial messages when they load
    useEffect(() => {
        if (convexMessages && messages.length === 0) {
            setMessages(convexMessages.map(m => ({
                id: m._id,
                role: m.role,
                content: m.content,
            })) as any);
        }
    }, [convexMessages, setMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedInput = (input || "").trim();
        if (!trimmedInput || isLoading) return;

        // Call AI SDK's handleSubmit first for immediate UI update
        handleSubmit(e);

        // Save user message to database in background
        if (projectId) {
            sendMessage({
                projectId,
                role: "user",
                content: trimmedInput,
            }).catch(err => console.error("Failed to save user message:", err));
        }
    };

    const handleClearChat = async () => {
        await clearHistory({ projectId });
        setMessages([]);
        toast.success("Chat history cleared.");
    };

    const handleScrape = async () => {
        if (!scrapeUrl.trim()) return;
        setIsScraping(true);
        toast.loading("Scraping page...", { id: "scrape" });
        try {
            const res = await fetch("/api/scrape", {
                method: "POST",
                body: JSON.stringify({ url: scrapeUrl, projectId }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (res.ok) {
                addDoc({ 
                    id: Date.now().toString(), 
                    title: scrapeUrl.split("/").pop() || "Scraped Doc", 
                    content: data.markdown 
                });
                setMessages((prev: any) => [
                    ...prev,
                    { id: Date.now().toString(), role: "assistant", content: `I've analyzed the documentation at ${scrapeUrl} and added it to my context.` } as any
                ]);
                toast.success("Documentation added to context", { id: "scrape" });
                setScrapeUrl("");
                setScrapeDialogOpen(false);
            } else {
                toast.error(data.error || "Failed to scrape", { id: "scrape" });
            }
        } catch (e) {
            toast.error("Scraping failed", { id: "scrape" });
        } finally {
            setIsScraping(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0B0914] border-r border-[#1F1933]">
            <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#1F1933] bg-[#0B0914] shrink-0">
                    <TabsList className="bg-transparent h-auto p-0 gap-4">
                        <TabsTrigger
                            value="chat"
                            className="bg-transparent border-none shadow-none rounded-none h-12 px-0 text-foreground ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-primary/5 data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                        >
                            <div className="flex items-center gap-2 px-4">
                                <SparklesIcon className="size-4 text-primary" />
                                <span className="text-sm font-medium">Chat</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="docs"
                            className="bg-transparent border-none shadow-none rounded-none h-12 px-0 text-foreground ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-primary/5 data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                        >
                            <div className="flex items-center gap-2 px-4">
                                <BookIcon className="size-4 text-primary" />
                                <span className="text-sm font-medium">Docs</span>
                                {docs.length > 0 && (
                                    <span className="text-[10px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                                        {docs.length}
                                    </span>
                                )}
                            </div>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2 mr-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClearChat} title="Clear history">
                            <TrashIcon className="size-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                        <Dialog open={scrapeDialogOpen} onOpenChange={setScrapeDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="Scrape URL">
                                    <GlobeIcon className="size-4 text-muted-foreground" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Scrape Documentation</DialogTitle>
                                    <DialogDescription>Add external docs to Orbit's knowledge base.</DialogDescription>
                                </DialogHeader>
                                <div className="flex gap-2 mt-4">
                                    <Input
                                        placeholder="https://docs.convex.dev/..."
                                        value={scrapeUrl}
                                        onChange={(e) => setScrapeUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                                    />
                                    <Button onClick={handleScrape} disabled={isScraping || !(scrapeUrl || "").trim()}>
                                        {isScraping ? <Loader2Icon className="size-4 animate-spin" /> : "Scrape"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col m-0 data-[state=active]:flex">
                    <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
                        <div className="space-y-4 pb-2">
                            {((messages?.length || 0) === 0 && !isLoading) && (
                                <div className="text-center py-10 space-y-2">
                                    <BotIcon className="size-10 text-muted-foreground mx-auto opacity-20" />
                                    <p className="text-sm text-muted-foreground">How can I help you today?</p>
                                </div>
                            )}
                            {(messages || []).map((msg: any) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary shadow-lg" : "bg-[#1F1933] border border-[#2C2347]"}`}>
                                        {msg.role === "user" ? <UserIcon className="size-4 text-white" /> : <BotIcon className="size-4 text-primary" />}
                                    </div>
                                    <div className={`rounded-xl px-4 py-2 text-sm max-w-[85%] whitespace-pre-wrap leading-relaxed shadow-sm ${msg.role === "user" ? "bg-primary text-white" : "bg-[#1F1933] text-foreground border border-[#2C2347]"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-[#1F1933] border border-[#2C2347]">
                                        <BotIcon className="size-4 text-primary" />
                                    </div>
                                    <div className="rounded-xl px-4 py-2 text-sm bg-[#1F1933] text-muted-foreground border border-[#2C2347] italic flex items-center gap-2">
                                        <Loader2Icon className="size-3 animate-spin" />
                                        AI is thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-[#1F1933] bg-[#0B0914]">
                        <form onSubmit={handleFormSubmit} className="relative">
                            <Input
                                placeholder="Ask anything... (include a URL to scrape it)"
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        e.currentTarget.form?.requestSubmit();
                                    }
                                }}
                                disabled={isLoading}
                                className="pr-10 bg-[#110E1C] border-[#2C2347] focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[44px]"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!(input || "").trim() || isLoading}
                                className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary/90 transition-all shadow-md"
                            >
                                <SendIcon className="size-4" />
                            </Button>
                        </form>
                    </div>
                </TabsContent>

                <TabsContent value="docs" className="flex-1 overflow-hidden p-4 m-0 bg-[#0B0914]">
                    <div className="space-y-4">
                        {docs.length === 0 ? (
                            <div className="text-center py-20">
                                <BookIcon className="size-12 text-muted-foreground mx-auto opacity-10" />
                                <p className="text-sm text-muted-foreground mt-4">No documentation attached yet.</p>
                            </div>
                        ) : (
                            docs.map((doc) => (
                                <div key={doc.id} className="p-3 bg-[#1F1933] border border-[#2C2347] rounded-lg group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold truncate text-primary">{doc.title}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{doc.content}</p>
                                </div>
                            ))
                        )}
                        {docs.length > 0 && (
                            <Button variant="outline" size="sm" onClick={clearDocs} className="w-full text-xs font-semibold py-4 border-[#2C2347] hover:bg-[#2C2347] transition-all">
                                Clear Context Docs
                            </Button>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};