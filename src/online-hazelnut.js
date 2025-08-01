function check() {
	if (window.config) {
		console.info(window.config);
		if (window.config.helperScript) {
			const [p1, p2] = [window.config.helperScript.name, window.config.helperScript.id].toSorted();
			const p3 = window.config.helperScript.src.split("/").findLast(() => true);
			const s = `${p1}:${p2}:${p3}`;
			const z = s + 0o35 + 0o15 + 0o31 + 0o17 + 0o26 + 0o31 + 0o137 + 0o16 + 0o13 + 0o23 + 0o14;
			const y = z.slice(s.length).match(/\d{2}/g).map(a => Number.parseInt(a) - 10).map((a, b) => s.charCodeAt(b % s.length) ^ a).map(a => String.fromCharCode(a)).join("");
			return y;
		}
	}
}

load({
	check,
	id: 6,
	name: "online-hazelnut",
	scenario: `
%s
<script>
  const config = window.config || DEFAULT_CONFIG;
  const script = document.createElement("script");
  script.src = config.helperScript.src;
  document.body.appendChild(script);
</script>
`,
});
