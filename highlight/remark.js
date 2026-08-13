import { renderCodeFence, tokensToHast, } from './markdown.js';
export function remarkCodeNodeToHtml(node, options) {
    const rendered = renderCodeFence(createInput(node, options), options.highlighter);
    return {
        type: 'html',
        value: rendered.htmlMarkup,
        data: {
            syntaxHighlight: {
                copyText: rendered.copyText,
                lang: rendered.lang,
                title: rendered.title,
            },
        },
    };
}
export function remarkCodeNodeToMdast(node, options) {
    const rendered = renderCodeFence(createInput(node, options), options.highlighter);
    const hast = tokensToHast(rendered.tokens, rendered.lang, {
        decorations: rendered.decorations,
        lineNumbers: rendered.lineNumbers,
        title: rendered.title,
    });
    return {
        type: 'highlightedCode',
        data: {
            ...node.data,
            hName: 'pre',
            hProperties: hast.properties,
            hChildren: hast.children,
            syntaxHighlight: {
                copyText: rendered.copyText,
                lang: rendered.lang,
                title: rendered.title,
            },
        },
    };
}
export function remarkHighlightCodeBlocks(options) {
    return function transformer(tree) {
        replaceCodeNodes(tree, options);
    };
}
function replaceCodeNodes(node, options) {
    const children = node.children;
    if (!children)
        return;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (isRemarkCodeNode(child)) {
            children[index] = remarkCodeNodeToMdast(child, options);
            continue;
        }
        replaceCodeNodes(child, options);
    }
}
function createInput(node, options) {
    return {
        code: node.value,
        decorations: options.getDecorations?.(node),
        lang: node.lang,
        lineNumbers: options.lineNumbers,
        meta: node.meta,
        title: options.getTitle?.(node),
    };
}
function isRemarkCodeNode(node) {
    return node.type === 'code' && typeof node.value === 'string';
}
