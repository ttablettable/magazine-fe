import { diffLines } from "diff";

export interface DiffLine {
  type: "add" | "remove" | "context";
  value: string; // line content WITHOUT trailing newline
}

export function computeDiff(oldText: string, newText: string): DiffLine[] {
  const raw = diffLines(oldText, newText);

  const out: DiffLine[] = [];

  for (const part of raw) {
    const lines = part.value.split("\n");

    // diff packages always end value with newline → remove last empty string
    if (lines[lines.length - 1] === "") lines.pop();

    for (const line of lines) {
      out.push({
        type: part.added ? "add" : part.removed ? "remove" : "context",
        value: line,
      });
    }
  }

  return out;
}