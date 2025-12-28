"use client";

import { useState } from "react";
import { InlineDiff } from "./InlineDiff";
import { ViewDiff } from "./ViewDiff";

export default function DiffTest() {
  const [mode, setMode] = useState<"inline" | "side">("inline");

  const oldText = `
Hello world
This is version one
It has three lines
`;

  const newText = `
Hello world!!
This is version two
It has four lines now
Extra line here
`;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setMode("inline")}>Inline</button>
      <button onClick={() => setMode("side")}>Side-by-side</button>

      {mode === "inline" ? (
        <InlineDiff oldText={oldText} newText={newText} />
      ) : (
        <ViewDiff oldText={oldText} newText={newText} />
      )}
    </div>
  );
}
