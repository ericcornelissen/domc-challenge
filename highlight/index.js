import { createHighlighter, } from './core.js';
import { apache } from './languages/apache.js';
import { css } from './languages/css.js';
import { diff } from './languages/diff.js';
import { dockerfile } from './languages/dockerfile.js';
import { ejs } from './languages/ejs.js';
import { env } from './languages/env.js';
import { html } from './languages/html.js';
import { http } from './languages/http.js';
import { js } from './languages/js.js';
import { json } from './languages/json.js';
import { jsx } from './languages/jsx.js';
import { markdown } from './languages/markdown.js';
import { mermaid } from './languages/mermaid.js';
import { nginx } from './languages/nginx.js';
import { plaintext } from './languages/plaintext.js';
import { python } from './languages/python.js';
import { scheme } from './languages/scheme.js';
import { shell } from './languages/shell.js';
import { sql } from './languages/sql.js';
import { svelte } from './languages/svelte.js';
import { toml } from './languages/toml.js';
import { ts } from './languages/ts.js';
import { tsrx } from './languages/tsrx.js';
import { tsx } from './languages/tsx.js';
import { vue } from './languages/vue.js';
import { yaml } from './languages/yaml.js';
export { createHighlighter, defineLanguage, escapeHtml, renderNodesToHtml, renderTokens, } from './core.js';
export const allLanguages = [
    apache,
    css,
    diff,
    dockerfile,
    ejs,
    env,
    html,
    http,
    js,
    json,
    jsx,
    markdown,
    mermaid,
    nginx,
    plaintext,
    python,
    scheme,
    shell,
    sql,
    svelte,
    toml,
    ts,
    tsrx,
    tsx,
    vue,
    yaml,
];
export const defaultHighlighter = createHighlighter({ languages: allLanguages });
export function normalizeLanguage(lang) {
    return defaultHighlighter.normalizeLanguage(lang);
}
export function listLanguages() {
    return defaultHighlighter.listLanguages();
}
export function tokenize(code, options = {}) {
    return defaultHighlighter.tokenize(code, options);
}
export function highlight(code, options = {}) {
    return defaultHighlighter.highlight(code, options);
}
export function highlightToHtml(code, options = {}) {
    return defaultHighlighter.highlightToHtml(code, options);
}
export function renderCodeBlockData({ code, decorations, lang, lineNumbers, title, }) {
    return defaultHighlighter.renderCodeBlockData({
        code,
        decorations,
        lang,
        lineNumbers,
        title,
    });
}
