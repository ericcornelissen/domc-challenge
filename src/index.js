initializeContinue();

// ---

function initializeContinue() {
	const challengeCount = 5;
	const solved = [];
	for (let i = 1; i <= challengeCount; i++) {
		const solution = localStorage.getItem(`challenge-${i}`);
		if (solution) {
			solved.push([i, JSON.parse(solution)]);
		} else {
			break;
		}
	}

	if (solved.length === 0) {
		return;
	}

	solved.unshift([0, { secret: "starting-island" }]);

	const items = [];
	for (const [, solution] of solved) {
		const $text = document.createElement("span");
		$text.innerText = solution.secret;

		const $a = document.createElement("a");
		$a.href = `./${solution.secret}.html`;
		$a.append($text);

		const $li = document.createElement("li");
		$li.appendChild($a);

		items.push($li);
	}

	const $hr = document.createElement("hr");
	const $title = document.createElement("h2");
	$title.innerText = "Your Progress";
	const $list = document.createElement("ol");
	$list.append(...items);

	const $container = document.getElementById("continue");
	$container.append($hr, $title, $list);
}
