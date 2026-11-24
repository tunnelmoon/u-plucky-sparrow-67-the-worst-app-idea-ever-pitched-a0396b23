import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Worst App Idea Ever Pitched: one sentence, at most 240 characters.
// A deadpan founder pitch for an app that solves a problem nobody has:
// knowing the exact moment your fridge light turns off.
const ENTRY =
  "FridgeLight is the app that texts you every time your fridge light turns off, so busy professionals never have to wonder what their leftovers are doing in the dark, and it just raised $4 million in seed funding.";

const MIN_CHARS = 1;
const MAX_CHARS = 240;

function fail(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

const chars = [...ENTRY];
if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
  fail(`length ${chars.length} is outside ${MIN_CHARS}-${MAX_CHARS} characters`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry has leading or trailing whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
  fail("entry contains control characters");
}
if (!ENTRY.endsWith(".")) {
  fail("entry must be a single sentence ending with a period");
}
const inner = ENTRY.slice(0, -1);
if (/[.!?]/.test(inner)) {
  fail("entry must be exactly one sentence");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip read-back: what we wrote must be exactly what we meant.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  fail("round-trip read-back does not match the entry");
}
console.log(`wrote ${outPath} (${chars.length} characters)`);
