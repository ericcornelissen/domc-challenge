function load({ check, id, name, scenario }) {
	setupSolved({ id, name });

	setupInput(id);
	setupPreview(scenario);

	const secret = check()
	if (secret) {
		solved(secret);
	}
}

function setupInput(id) {
	const input = _getInput(id);
	if (input) {
		const $container = document.getElementById("container");
		$container.innerHTML = input;

		const $input = document.getElementById("input");
		$input.value = input;
	}
}

function setupPreview(template) {
	const $input = document.getElementById("input"), $preview = document.getElementById("preview");

	const update = () => {
		const value = $input.value || "<!-- your input will go here -->"
		$preview.innerText = template.replace("%s", value);
	};

	update();
	$input.addEventListener("keydown", _debounce(update));
}

function setupSolved({ id, name }) {
	const $solved = document.getElementById("solved");
	globalThis.solved = (secret) => {
		localStorage.setItem(`challenge-${id}`, JSON.stringify({
			id, name, secret,
			input: _getInput(id),
		}));

		$solved.innerHTML = `<hr><p><b>Success!</b> The key for the next challenge is <a href="./${secret}.html">${secret}</a>.</p>`;
	};
}

// ---

function _debounce(fn) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), 100);
	};
}

function _getInput(id) {
	return _getInputFromUrl() || _getInputFromStorage(id) || "";
}

function _getInputFromUrl() {
	try {
		const { search } = new URL(document.URL);
		const params = new URLSearchParams(search);
		return params.get("input");
	} catch { }
}

function _getInputFromStorage(id) {
	try {
		const raw = localStorage.getItem(`challenge-${id}`);
		const solution = JSON.parse(raw);
		return solution.input;
	} catch { }
}
