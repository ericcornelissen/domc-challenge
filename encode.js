import * as process from "node:process";

if (process.argv.length !== 4) {
	console.log("usage:");
	console.log("  node encode.js <key> <value>");
	console.log();
	console.log("- key: the encryption key, this should be somehow part of the solution");
	console.log("- value: the value to encrypt, this is the secret for the next challenge");
	process.exit(0);
}

const key = process.argv[2];
const value = process.argv[3];

function enc(key, value) {
	const k = [], c = [];
	for (let i = 0; i < Math.max(key.length, value.length); i++) {
		k.push(key.charCodeAt(i % key.length));
		c.push(key.charCodeAt(i % key.length) ^ value.charCodeAt(i % value.length));
	}
	return c;
}

const c = enc(key, value);
console.log(`
function check() {
	if ([TODO(condition)]) {
		const s = [TODO(key)];
		const z = s+${c.map(c=>c+10).map(c => `0o${c.toString(8)}`).join("+")};
		const y = z.slice(s.length).match(/\\d{2}/g).map(a=>Number.parseInt(a)-10).map((a, b)=>s.charCodeAt(b % s.length) ^ a).map(a=>String.fromCharCode(a)).join("");
		return y;
	}
}
`);
