import { create } from "zustand";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Doc {
    id: string;
    title: string;
    content: string;
    url?: string;
}

interface SidebarState {
    messages: Message[];
    docs: Doc[];
    addMessage: (message: Message) => void;
    addDoc: (doc: Doc) => void;
    clearMessages: () => void;
    clearDocs: () => void;
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    messages: [{ role: "assistant", content: "Hello! I'm your AI coding assistant. How can I help you with this project today?" }],
    docs: [],
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    addDoc: (doc) => set((state) => ({ docs: [...state.docs, doc] })),
    clearMessages: () => set({ messages: [] }),
    clearDocs: () => set({ docs: [] }),
    previewUrl: null,
    setPreviewUrl: (url) => set({ previewUrl: url }),
}));