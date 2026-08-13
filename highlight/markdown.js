import { renderNodesToHtml, renderTokens, } from './core.js';
const codeDiffNotation = /[ \t]*(?:(?:\/\/|#)[ \t]*\[!code[ \t]+(\+\+|--)\]|\/\*[ \t]*\[!code[ \t]+(\+\+|--)\][ \t]*\*\/|<!--[ \t]*\[!code[ \t]+(\+\+|--)\][ \t]*-->)[ \t]*$/;
export function parseCodeDiffNotation(code) {
    const decorations = [];
    const lines = code.split('\n');
    const cleanLines = lines.map((line, index) => {
        const match = codeDiffNotation.exec(line);
        if (!match)
            return line;
        const notation = match[1] || match[2] || match[3];
        decorations.push({
            className: notation === '++' ? 'th-line--inserted' : 'th-line--deleted',
            lines: index + 1,
        });
        return line.slice(0, match.index);
    });
    return {
        code: cleanLines.join('\n'),
        decorations,
    };
}
export function parseCodeFenceMeta(meta) {
    if (!meta)
        return { decorations: [], lineNumbers: false };
    const matches = [];
    const annotationClasses = {
        del: 'th-line--deleted',
        error: 'th-line--error',
        focus: 'th-line--focused',
        highlight: 'th-line--highlighted',
        ins: 'th-line--inserted',
        warning: 'th-line--warning',
    };
    const annotation = /\b(del|error|focus|highlight|ins|warning)=\{([^}]*)\}/g;
    let match;
    while ((match = annotation.exec(meta))) {
        matches.push({
            decorations: parseLineList(match[2], annotationClasses[match[1]]),
            index: match.index,
        });
    }
    const shorthand = /(?:^|\s)\{([\d,\s-]+)\}(?=\s|$)/g;
    while ((match = shorthand.exec(meta))) {
        matches.push({
            decorations: parseLineList(match[1], 'th-line--highlighted'),
            index: match.index,
        });
    }
    return {
        decorations: matches
            .sort((a, b) => a.index - b.index)
            .flatMap((entry) => entry.decorations),
        lineNumbers: /\b(?:lineNumbers|showLineNumbers)\b/.test(meta),
        title: getCodeFenceTitle(meta),
    };
}
export function getCodeFenceTitle(meta) {
    if (!meta)
        return undefined;
    const match = meta.match(/\b(?:title|filename|file|name)=("[^"]*"|'[^']*'|[^\s}]+)/);
    if (!match)
        return undefined;
    const value = match[1];
    const unquoted = (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
        ? value.slice(1, -1)
        : value;
    return unquoted.trim() || undefined;
}
export function renderCodeFence({ code, decorations, lang, lineNumbers, meta, title, }, highlighter) {
    const annotated = parseCodeDiffNotation(code);
    const parsed = parseCodeFenceMeta(meta);
    const resolvedDecorations = [
        ...annotated.decorations,
        ...parsed.decorations,
        ...(decorations || []),
    ];
    const resolvedLineNumbers = lineNumbers ?? parsed.lineNumbers;
    const rendered = highlighter.renderCodeBlockData({
        code: annotated.code,
        decorations: resolvedDecorations,
        lang: lang || undefined,
        lineNumbers: resolvedLineNumbers,
        title: title || parsed.title,
    });
    return {
        ...rendered,
        decorations: resolvedDecorations,
        lineNumbers: resolvedLineNumbers,
    };
}
export function codeFenceToHast(input, highlighter) {
    const rendered = renderCodeFence(input, highlighter);
    return tokensToHast(rendered.tokens, rendered.lang, {
        decorations: rendered.decorations,
        lineNumbers: rendered.lineNumbers,
        title: rendered.title,
    });
}
export function createTanStackMarkdownHighlighter(highlighter) {
    return (code, lang = 'plaintext', options = {}) => {
        const annotated = parseCodeDiffNotation(code);
        const result = highlighter.tokenize(annotated.code, { lang });
        return renderNodesToHtml(renderTokens(result.tokens, {
            ...(options.lineNumbers !== undefined
                ? { lineNumbers: options.lineNumbers }
                : {}),
            ...(annotated.decorations.length || options.highlightLines?.length
                ? {
                    decorations: [
                        ...annotated.decorations,
                        ...(options.highlightLines || []).map((lines) => ({
                            className: 'th-line--highlighted',
                            lines,
                        })),
                    ],
                }
                : {}),
        }));
    };
}
export function tokensToHast(tokens, lang, options = {}) {
    return {
        type: 'element',
        tagName: 'pre',
        properties: {
            className: [
                'th-code',
                `th-code--${lang}`,
                ...(options.lineNumbers ? ['th-code--line-numbers'] : []),
            ],
            dataLanguage: lang,
            ...(options.title ? { dataTitle: options.title } : {}),
        },
        children: [
            {
                type: 'element',
                tagName: 'code',
                properties: {},
                children: renderTokens(tokens, options).map(renderNodeToHast),
            },
        ],
    };
}
function renderNodeToHast(node) {
    if (node.type === 'text')
        return node;
    return {
        type: 'element',
        tagName: 'span',
        properties: {
            className: node.classNames,
            ...Object.fromEntries(Object.entries(node.data || {}).map(([key, value]) => [
                `data${key[0]?.toUpperCase() || ''}${key.slice(1)}`,
                value,
            ])),
        },
        children: node.children.map(renderNodeToHast),
    };
}
function parseLineList(value, className) {
    const decorations = [];
    for (const part of value.split(',')) {
        const range = part.trim().match(/^(\d+)(?:-(\d+))?$/);
        if (!range)
            continue;
        const start = Number(range[1]);
        const end = Number(range[2] || range[1]);
        if (start < 1 || end < start)
            continue;
        decorations.push({
            className,
            lines: start === end ? start : [start, end],
        });
    }
    return decorations;
}
