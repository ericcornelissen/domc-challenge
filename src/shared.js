import { html } from "./highlight/languages/html.js";
import { githubLightTheme } from "./highlight/themes/github-light.js";
import { createHighlighter } from "./highlight/core.js";
import { createThemeCss } from "./highlight/theme.js";

const highlighter = createHighlighter({ languages: [html] });

const messages = {
	wrong: ["That didn't work...", "Try again...", "No, that wasn't it..."],
};

export function load({ check, id, name, scenario }) {
	setupHighlighting();
	setupInput(id);
	setupPreview(scenario);
	setupSubmit({ check, id, name });
	trySolution({ check, id, name });
}

function setupHighlighting() {
	const style = document.createElement("style");
	style.textContent = createThemeCss({ light: githubLightTheme });
	document.head.append(style);
}

function setupInput(id) {
	const input = _getStoredInput(id);
	if (input) {
		_loadInput(input);
		_loadSolution(input);
	}
}

function setupPreview(template) {
	const $input = document.getElementById("input");
	const $preview = document.getElementById("preview");

	const update = () => {
		const value = $input.value.trim() || "<!-- your input will go here -->";
		const raw = template.replace("%s", value);
		const markup = highlighter.highlight(raw, { lang: "html" });
		$preview.innerHTML = markup.html;
	};

	update();
	$input.addEventListener("keydown", _debounce(update));
}

function setupSubmit({ check, id, name }) {
	const $input = document.getElementById("input");
	const $submit = document.getElementById("submit");

	const submit = () => {
		_loadSolution($input.value);
		trySolution({ check, id, name });
	};

	$submit.addEventListener("click", event => {
		event.preventDefault();
		submit();
	});

	$input.addEventListener("keydown", _debounce(event => {
		if (event.ctrlKey && event.key === "Enter") {
			event.preventDefault();
			submit();
		}
	}));
}

let attempt = 0;
function trySolution({ check, id, name }) {
	const $input = document.getElementById("input");
	if ($input.value.trim() === "") {
		return;
	}

	const $solved = document.getElementById("solved");

	attempt = (attempt + 1) % messages.wrong.length;

	const secret = check();
	if (secret) {
		localStorage.setItem(`challenge-${id}`, JSON.stringify({
			id, name, secret,
			input: $input.value,
		}));

		$solved.innerHTML = `<hr><p><b>Success!</b> The key for the next challenge is <a href="./${secret}.html">${secret}</a>.</p>`;
	} else {
		$solved.innerHTML = `<hr><p>${messages.wrong[attempt]}</p>`;
	}
}

// ---

function _debounce(fn) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), 100);
	};
}

function _getStoredInput(id) {
	try {
		const raw = localStorage.getItem(`challenge-${id}`);
		const solution = JSON.parse(raw);
		return solution.input;
	} catch {
		return null;
	}
}

function _loadInput(input) {
	const $input = document.getElementById("input");
	$input.value = input;
}

function _loadSolution(markup) {
	const $container = document.getElementById("container");
	$container.innerHTML = markup;
}
