function check() {
	if (window.config) {
		const p1 = window.config.id;
		const p2 = window.config.href.split("/").findLast(() => true);
		if (p2 === "malicious.js") {
			const s = `${p1}:${p2}`;
			const z = s + 0o26 + 0o13 + 0o14 + 0o31 + 0o21 + 0o14 + 0o41 + 0o17 + 0o12 + 0o40 + 0o26 + 0o31 + 0o21 + 0o44 + 0o13;
			const y = z.slice(s.length).match(/\d{2}/g).map(a => Number.parseInt(a) - 10).map((a, b) => s.charCodeAt(b % s.length) ^ a).map(a => String.fromCharCode(a)).join("");
			return y;
		}
	}
}

load({
	check,
	id: 5,
	name: "authorized-forest",
	scenario: `
%s
<script>
  const config = window.config || { href: "script.js" };
  const script = document.createElement("script");
  script.src = config.href;
  document.body.appendChild(script);
</script>
`,
});
