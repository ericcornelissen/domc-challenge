function check() {
	const $form = document.querySelector("form[id='login']");
	if ($form.domc) {
		const s = $form.domc.name;
		const z = s + 0o17 + 0o44 + 0o43 + 0o25 + 0o25 + 0o47 + 0o16 + 0o43 + 0o13 + 0o25 + 0o112 + 0o17 + 0o25 + 0o47 + 0o22 + 0o32 + 0o32;
		const y = z.slice(s.length).match(/\d{2}/g).map(a => Number.parseInt(a) - 10).map((a, b) => s.charCodeAt(b % s.length) ^ a).map(a => String.fromCharCode(a)).join("");
		return y;
	}
}

load({
	check,
	id: 4,
	name: "short-sheep",
	scenario: `
<form id="login">
  <!-- ... -->
</form>

%s

<script>
  const $form = document.querySelector("form");
  if ($form.domc) {
    releaseSecret();
  }
</script>
`,
});
