export function extractBlockquotes(markdown: string): string[] {
  const regex = /<blockquote>([\s\S]*?)<\/blockquote>/gi;
  const results: string[] = [];

  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const text = match[1].trim();
    if (text.length > 0) results.push(text);
  }

  return results;
}
