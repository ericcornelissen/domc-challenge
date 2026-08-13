import { codeFenceToHast, } from './markdown.js';
export function rehypeHighlightCodeBlocks(options) {
    return function transformer(tree) {
        replacePreCodeNodes(tree, options);
    };
}
export function rehypePreCodeToHast(node, options) {
    if (hasClassName(node, 'th-code'))
        return undefined;
    const code = getCodeChild(node);
    if (!code)
        return undefined;
    return codeFenceToHast({
        code: collectText(code).trimEnd(),
        decorations: options.getDecorations?.(node),
        lang: getLanguage(code),
        lineNumbers: options.lineNumbers,
        title: options.getTitle?.(node),
    }, options.highlighter);
}
function replacePreCodeNodes(node, options) {
    const children = node.children;
    if (!children)
        return;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (isElement(child) && child.tagName === 'pre') {
            const highlighted = rehypePreCodeToHast(child, options);
            if (highlighted)
                children[index] = highlighted;
            continue;
        }
        replacePreCodeNodes(child, options);
    }
}
function getCodeChild(node) {
    return node.children.find((child) => isElement(child) && child.tagName === 'code');
}
function getLanguage(node) {
    const className = node.properties?.className;
    const classes = Array.isArray(className)
        ? className
        : typeof className === 'string'
            ? className.split(/\s+/)
            : [];
    return classes
        .find((value) => typeof value === 'string' && value.startsWith('language-'))
        ?.slice('language-'.length);
}
function hasClassName(node, expected) {
    const className = node.properties?.className;
    return Array.isArray(className)
        ? className.includes(expected)
        : typeof className === 'string'
            ? className.split(/\s+/).includes(expected)
            : false;
}
function collectText(node) {
    if (node.type === 'text' && typeof node.value === 'string')
        return node.value;
    if ('children' in node && Array.isArray(node.children)) {
        return node.children.map((child) => collectText(child)).join('');
    }
    return '';
}
function isElement(node) {
    return node.type === 'element' && typeof node.tagName === 'string';
}
