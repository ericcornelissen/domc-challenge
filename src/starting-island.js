function check() {
	if (window.domc) {
		const s = window.domc.id || window.domc.name;
		const z = s + 0o36 + 0o47 + 0o14 + 0o21 + 0o33 + 0o26 + 0o43 + 0o24 + 0o25 + 0o13 + 0o112 + 0o27 + 0o13 + 0o20 + 0o24 + 0o25 + 0o20 + 0o12 + 0o42 + 0o33;
		const y = z.slice(s.length).match(/\d{2}/g).map(a => Number.parseInt(a) - 10).map((a, b) => s.charCodeAt(b % s.length) ^ a).map(a => String.fromCharCode(a)).join("");
		return y;
	}
}

load({
	check,
	id: 1,
	name: "start",
	scenario: `
%s
<script>
  if (window.domc) {
    releaseSecret();
  }
</script>
`,
});
