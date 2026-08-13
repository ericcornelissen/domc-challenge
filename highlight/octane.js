import { rehypeHighlightCodeBlocks, } from './rehype.js';
export function createHighlightedCodeBlockProps({ className, code, decorations, highlighter, lang, lineNumbers, title, }) {
    const rendered = highlighter.renderCodeBlockData({
        code,
        decorations,
        lang,
        lineNumbers,
        title,
    });
    return {
        ...rendered,
        className,
        dangerouslySetInnerHTML: { __html: rendered.htmlMarkup },
    };
}
export function createOctaneMdxHighlight(options) {
    return [rehypeHighlightCodeBlocks, options];
}
