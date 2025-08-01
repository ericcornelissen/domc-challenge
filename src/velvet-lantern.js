function check() {
	const $form = document.getElementById("container");
	if ($form.domc) {
		const s = $form.domc.id || $form.domc.name;
		const z = s + 0o41 + 0o21 + 0o14 + 0o33 + 0o32 + 0o114 + 0o50 + 0o25 + 0o13 + 0o24 + 0o47;
		const y = z.slice(s.length).match(/\d{2}/g).map(a => Number.parseInt(a) - 10).map((a, b) => s.charCodeAt(b % s.length) ^ a).map(a => String.fromCharCode(a)).join("");
		return y;
	}
}

load({
	check,
	id: 3,
	name: "velvet-lantern",
	scenario: `
<form>
  %s

  <label for="input">Your name:</label>
  <input type="text" name="input">
  <input type="submit" value="submit">
</form>
<script>
  const $form = document.querySelector("form");
  if ($form.domc) {
    releaseSecret();
  }
</script>
`,
});
