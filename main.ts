import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// A robot's wedding vow: love measured in versions, not years.
// The joke lands because the version is exact — v4.2.1 is a real
// patch the couple survived together — while the promise stays
// bigger than any single update. Specific beats generic.
const MAX_CHARS = 200;
const OUT_PATH = "/output/entry.txt";

// Opening: the vow, anchored to one named firmware release.
const opening = "I promise to love you through firmware v4.2.1,";
// Middle: the daily grind of robot married life — restarts and
// bugs nobody on support can ever reproduce on demand.
const middle = "every power cycle, and every bug we cannot reproduce —";
// Closing: the escalation. Not just "till death", but a vow that
// outlives the firmware itself, then offers one last reboot.
const closing =
  "till firmware do us part, and even then, I will reboot for you.";

function buildVow(): string {
  return [opening, middle, closing].join(" ");
}

// Count the concrete detail so the polish is provable, not vibes:
// exactly one version string carries the whole upgrade.
function countVersions(line: string): number {
  return (line.match(/v\d+\.\d+\.\d+/g) ?? []).length;
}

function guardLength(line: string): void {
  if (countVersions(line) !== 1) {
    throw new Error("vow needs exactly one firmware version");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`vow is ${line.length} chars, over ${MAX_CHARS}`);
  }
  if (line.includes("\n")) {
    throw new Error("vow must stay a single line");
  }
}

// Final sanity pass: the vow must end on the reboot promise,
// the punchline that turns a firmware joke back into romance.
function guardEnding(line: string): void {
  if (!line.endsWith("I will reboot for you.")) {
    throw new Error("vow must end on the reboot promise");
  }
}

const vow = buildVow();
guardLength(vow);
guardEnding(vow);
mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, vow + "\n", "utf8");
console.log(vow);
console.log(`(${vow.length} chars)`);
