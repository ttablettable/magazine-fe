import { diffArrays } from "diff";

export function computeChangedBlockIndexes(
  oldText: string,
  newText: string
): Set<number> {

  const oldBlocks = oldText.split("\n\n");
  const newBlocks = newText.split("\n\n");

  const diffs = diffArrays(oldBlocks, newBlocks);

  const changed = new Set<number>();
  let newIndex = 0;

  diffs.forEach((part, i) => {
    const count = part.value.length;

    if (part.added) {
      for (let j = 0; j < count; j++) {
        changed.add(newIndex + j);
      }
      newIndex += count;
    } else if (part.removed) {
      if (newIndex > 0) {
        changed.add(newIndex - 1);
      }
      if (newIndex < newBlocks.length) {
        changed.add(newIndex);
      }
    } else {
      newIndex += count;
    }
  });

  return changed;
}
