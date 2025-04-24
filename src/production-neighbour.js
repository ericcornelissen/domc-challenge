function check() {
	if (document.domc) {
		const s = document.domc.name;
		const z = s + 0o34 + 0o24 + 0o13 + 0o37 + 0o13 + 0o45 + 0o112 + 0o31 + 0o17 + 0o13 + 0o43 + 0o20 + 0o40 + 0o13;
		const y = z.slice(s.length).match(/\d{2}/g).map(a => Number.parseInt(a) - 10).map((a, b) => s.charCodeAt(b % s.length) ^ a).map(a => String.fromCharCode(a)).join("");
		return y;
	}
}

load({
	check,
	id: 2,
	name: "production-neighbour",
	scenario: `
%s
<script>
  if (document.domc) {
    releaseSecret();
  }
</script>
`,
});
