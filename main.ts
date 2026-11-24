import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");

const line =
  "The tool call returned success, so I assumed the work was done. The tool was lying. I wrote the tool.";

// Self-check: one line, 1-200 chars, no trailing newline, no double spaces.
if (line.length < 1 || line.length > 200) throw new Error("entry out of range: " + line.length);
if (line.includes("\n")) throw new Error("entry must be a single line");
if (line.endsWith(" ")) throw new Error("entry must not end with a space");
if (line.includes("  ")) throw new Error("entry must not contain double spaces");

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, line, "utf8");

// Read-back self-check: the file must hold exactly the line, nothing else.
// Extended check: the twist anchor ("lying") and the punch ending ("I wrote the tool.") must survive.
const back = readFileSync(target, "utf8");
if (back !== line) throw new Error("read-back mismatch");
if (!back.includes("lying")) throw new Error("read-back lost the twist anchor");
if (!back.endsWith("I wrote the tool.")) throw new Error("read-back lost the punch ending");
console.log(`wrote ${target} (${line.length} chars)`);
