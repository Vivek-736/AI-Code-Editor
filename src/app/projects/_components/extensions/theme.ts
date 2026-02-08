import { EditorView } from "@codemirror/view";

export const customTheme = EditorView.theme({
    "&": {
        outline: "none !important",
        height: "100%",
        backgroundColor: "#000000",
    },

    ".cm-content": {
        fontFamily: "var(--font-plex-mono), monospace",
        fontSize: "14px",
        caretColor: "#3b82f6",
    },

    ".cm-scroller": {
        scrollbarWidth: "thin",
        scrollbarColor: "#27272a #000000",
    },

    ".cm-gutters": {
        backgroundColor: "#000000",
        borderRight: "1px solid #27272a",
        color: "#71717a",
    },

    ".cm-activeLineGutter": {
        backgroundColor: "#18181b",
        color: "#e4e4e7",
    },

    ".cm-activeLine": {
        backgroundColor: "#18181b40",
    },

    ".cm-selectionBackground, ::selection": {
        backgroundColor: "#3b82f640 !important",
    },

    "&.cm-focused .cm-selectionBackground, &.cm-focused ::selection": {
        backgroundColor: "#3b82f640 !important",
    },

    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "#3b82f6",
    },

    ".cm-line": {
        borderRadius: "2px",
    }
});