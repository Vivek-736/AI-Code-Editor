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
        caretColor: "#58a6ff",
    },

    ".cm-scroller": {
        scrollbarWidth: "thin",
        scrollbarColor: "#30363d #000000",
    },

    ".cm-gutters": {
        backgroundColor: "#000000",
        borderRight: "1px solid #21262d",
        color: "#8b949e",
    },

    ".cm-activeLineGutter": {
        backgroundColor: "#111111",
        color: "#e6edf3",
    },

    ".cm-activeLine": {
        backgroundColor: "#0a0a0a",
    },

    ".cm-selectionBackground, ::selection": {
        backgroundColor: "#1f6feb40 !important",
    },

    "&.cm-focused .cm-selectionBackground, &.cm-focused ::selection": {
        backgroundColor: "#1f6feb40 !important",
    },

    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "#58a6ff",
    },

    ".cm-line": {
        borderRadius: "2px",
    }
});