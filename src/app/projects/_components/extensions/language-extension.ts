import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";

export const getLanguageExtension = (filename: string): Extension => {
    const ext = filename.split(".").pop()?.toLowerCase();

    switch (ext) {
        case "js":
            return javascript();
        case "ts":
            return javascript({ typescript: true });
        case "jsx":
            return javascript({ jsx: true });
        case "tsx":
            return javascript({ typescript: true, jsx: true });
        case "py":
            return python();
        case "html":
            return html();
        case "css":
            return css();
        case "json":
            return json();
        case "xml":
            return xml();
        case "java":
            return java();
        case "cpp":
            return cpp();
        case "php":
            return php();
        case "md":
            return markdown();
        case "sql":
            return sql();
        default:
            return [];
    }
};