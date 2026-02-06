export type MostReadItem = {
  slug: string;
  views: number;
};

type ClickyPageItem = {
  url: string;
  value: number;
};

export async function getMostReadSlugs(): Promise<MostReadItem[]> {
  const siteId = process.env.CLICKY_SITE_ID;
  const siteKey = process.env.CLICKY_SITE_KEY;

  if (!siteId || !siteKey) {
    console.warn("Clicky env vars missing");
    return [];
  }

  const url = `https://api.clicky.com/api/stats/4?site_id=${siteId}&sitekey=${siteKey}&type=pages&date=last-7-days&limit=100&output=json`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("Clicky API error:", res.status);
    return [];
  }

  const data = await res.json();

  const pages: ClickyPageItem[] =
    data?.[0]?.dates?.[0]?.items ?? [];

  function extractSlug(url: string): string | null {
    try {
      const parsed = new URL(url);
      if (!parsed.pathname.startsWith("/story/")) return null;
      return parsed.pathname.replace("/story/", "");
    } catch {
      return null;
    }
  }

  return pages
    .map((p) => {
      const slug = extractSlug(p.url);
      return slug
        ? { slug, views: p.value }
        : null;
    })
    .filter(
      (item): item is MostReadItem =>
        Boolean(item && item.views >= 5)
    )
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}
