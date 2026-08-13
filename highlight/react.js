export function createHighlightedCodeBlockProps({ className, code, decorations, highlighter, lang, lineNumbers, title, }) {
    return {
        ...highlighter.renderCodeBlockData({
            code,
            decorations,
            lang,
            lineNumbers,
            title,
        }),
        className,
    };
}
