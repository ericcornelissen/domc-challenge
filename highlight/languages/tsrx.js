import { defineLanguage } from '../core.js';
import { collectScriptRanges } from '../internal/script.js';
const templateDirectives = new Set([
    '@catch',
    '@case',
    '@default',
    '@else',
    '@empty',
    '@for',
    '@if',
    '@pending',
    '@switch',
    '@try',
]);
export const tsrx = defineLanguage({
    name: 'tsrx',
    aliases: ['octane'],
    tokenize(code) {
        const ranges = collectScriptRanges(code, true, true).map((range) => range.className === 'function' &&
            templateDirectives.has(code.slice(range.start, range.end))
            ? { ...range, className: 'keyword' }
            : range);
        const shorthand = /@\{/g;
        let match;
        while ((match = shorthand.exec(code))) {
            const range = {
                start: match.index,
                end: match.index + match[0].length,
                className: 'keyword',
            };
            if (!ranges.some((candidate) => overlaps(candidate, range))) {
                ranges.push(range);
            }
        }
        return ranges;
    },
});
function overlaps(left, right) {
    return left.start < right.end && right.start < left.end;
}
