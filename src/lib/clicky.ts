export type MostReadItem = {
  slug: string;
  views: number;
  trend: number;
};

type ClickyPageItem = {
  url: string;
  value: string;
  trend?: string;
};

export async function getMostReadSlugs(): Promise<MostReadItem[]> {
  const siteId = process.env.CLICKY_SITE_ID;
  const siteKey = process.env.CLICKY_SITE_KEY;

  if (!siteId || !siteKey) {
    console.warn("Clicky env vars missing");
    return [];
  }

  const url = `https://api.clicky.com/api/stats/4?site_id=${siteId}&sitekey=${siteKey}&type=pages&date=last-7-days&limit=100&output=json&trends=1`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("Clicky API error:", res.status);
    return [];
  }

  const data = await res.json();

  const pages: ClickyPageItem[] = data?.[0]?.dates?.[0]?.items ?? [];

  function extractSlug(url: string): string | null {
    try {
      const parsed = new URL(url);

      // Only allow story URLs
      if (!parsed.pathname.startsWith("/story/")) {
        return null;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      return parts[1] ?? null; // story/[slug]
    } catch {
      return null;
    }
  }

  return pages
    .map((p) => {
      const slug = extractSlug(p.url);
      if (!slug) return null;

      return {
        slug,
        views: Number(p.value),
        trend: p.trend ? Number(p.trend) : 0,
      };
    })
    .filter((item): item is MostReadItem => Boolean(item))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}
