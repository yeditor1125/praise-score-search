import { extractKeyFromTitle } from "../keyUtils";

export type BlogType = "tistory" | "naver";

export type BlogSource = {
  id: string;
  name: string;
  url: string;
  type: BlogType;
  enabled: boolean;
};

export type SearchItem = {
  title: string;
  url: string;
  key: string;
  source: string;
  publishedAt?: string;
  score: number;
  matchType: "exact" | "similar";
};

export const defaultSources: BlogSource[] = [
  {
    id: "music-in",
    name: "music-in tistory",
    url: "https://music-in.tistory.com/category/찬양팀 악보",
    type: "tistory",
    enabled: true
  },
  {
    id: "god-is-with-me",
    name: "god-is-with-me tistory",
    url: "https://god-is-with-me.tistory.com/category/찬양악보",
    type: "tistory",
    enabled: true
  },
  {
    id: "godinthebible",
    name: "godinthebible naver",
    url: "https://blog.naver.com/godinthebible",
    type: "naver",
    enabled: true
  },
  {
    id: "relishsky",
    name: "relishsky naver",
    url: "https://m.blog.naver.com/PostList.naver?blogId=relishsky&categoryName=CCM&categoryNo=50",
    type: "naver",
    enabled: true
  }
];

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTag(text: string): string {
  return decodeHtml(text.replace(/<[^>]*>/g, "")).trim();
}

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\uac00-\ud7a3]+/gi, "")
    .trim();
}

function classifyMatch(title: string, query: string): "exact" | "similar" {
  const normalizedTitle = normalizeForMatch(title);
  const normalizedQuery = normalizeForMatch(query);
  if (normalizedQuery && normalizedTitle.includes(normalizedQuery)) {
    return "exact";
  }
  return "similar";
}

function relevanceScore(title: string, query: string): number {
  const loweredTitle = title.toLowerCase();
  const loweredQuery = query.toLowerCase();
  if (loweredTitle === loweredQuery) {
    return 120;
  }
  if (loweredTitle.includes(loweredQuery)) {
    return 90;
  }

  const words = loweredQuery.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const word of words) {
    if (loweredTitle.includes(word)) {
      score += 24;
    }
  }
  return score;
}

function getRootUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url;
  }
}

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT }
    });
    if (!response.ok) {
      return "";
    }
    return await response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        ...(headers ?? {})
      }
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function parseTistoryRss(xml: string, source: BlogSource, query: string): SearchItem[] {
  const items: SearchItem[] = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  for (const block of blocks) {
    const title = stripTag((block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim());
    const link = (block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? "").trim();
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "").trim();
    const score = relevanceScore(title, query);
    if (!title || !link || score <= 0) {
      continue;
    }

    items.push({
      title,
      url: link,
      key: extractKeyFromTitle(title),
      source: source.name,
      publishedAt: pubDate,
      score,
      matchType: classifyMatch(title, query)
    });
  }

  return items;
}

function parseTistoryHtml(html: string, source: BlogSource, query: string): SearchItem[] {
  const items: SearchItem[] = [];
  const matches = html.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) ?? [];
  const root = getRootUrl(source.url);

  for (const block of matches) {
    const href = block.match(/href="([^"]+)"/i)?.[1]?.trim();
    const title = stripTag(block.match(/>([\s\S]*?)<\/a>/i)?.[1] ?? "");
    if (!href || !title || title.length < 2) {
      continue;
    }

    const score = relevanceScore(title, query);
    if (score <= 0) {
      continue;
    }

    const url = href.startsWith("http") ? href : `${root}${href.startsWith("/") ? "" : "/"}${href}`;
    items.push({
      title,
      url,
      key: extractKeyFromTitle(title),
      source: source.name,
      score,
      matchType: classifyMatch(title, query)
    });
  }

  return items;
}

async function collectFromTistory(source: BlogSource, query: string): Promise<SearchItem[]> {
  const root = getRootUrl(source.url);
  const rss = await fetchText(`${root}/rss`);
  if (rss) {
    const parsed = parseTistoryRss(rss, source, query);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  const html = await fetchText(source.url);
  return html ? parseTistoryHtml(html, source, query) : [];
}

type NaverSearchResponse = {
  items?: Array<{
    title?: string;
    link?: string;
    description?: string;
    postdate?: string;
    bloggername?: string;
  }>;
};

async function searchNaverApi(query: string): Promise<SearchItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return [];
  }

  const endpoint =
    "https://openapi.naver.com/v1/search/blog.json" +
    `?query=${encodeURIComponent(`${query} 악보`)}` +
    "&display=30&sort=sim";

  const response = await fetchJson<NaverSearchResponse>(endpoint, {
    "X-Naver-Client-Id": clientId,
    "X-Naver-Client-Secret": clientSecret
  });
  if (!response?.items?.length) {
    return [];
  }

  return response.items
    .filter((item) => item.title && item.link)
    .map((item) => {
      const title = stripTag(item.title ?? "");
      const link = decodeHtml(item.link ?? "");
      const snippet = stripTag(item.description ?? "");
      return {
        title,
        url: link,
        key: extractKeyFromTitle(title),
        source: item.bloggername ? `Naver:${item.bloggername}` : "Naver Search",
        score: Math.max(relevanceScore(`${title} ${snippet}`, query), 28),
        publishedAt: item.postdate ?? "",
        matchType: classifyMatch(title, query)
      } satisfies SearchItem;
    });
}

function dedupe(items: SearchItem[]): SearchItem[] {
  const map = new Map<string, SearchItem>();
  for (const item of items) {
    const key = item.url || item.title;
    const existing = map.get(key);
    if (!existing || item.score > existing.score) {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
}

export async function runSearch(query: string, sources?: BlogSource[]): Promise<SearchItem[]> {
  const targetSources = (sources && sources.length > 0 ? sources : defaultSources).filter((source) => source.enabled);
  const tistorySources = targetSources.filter((source) => source.type === "tistory");

  const [tistoryResults, naverApiResults] = await Promise.all([
    Promise.allSettled(tistorySources.map((source) => collectFromTistory(source, query))).then((settled) =>
      settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    ),
    searchNaverApi(query)
  ]);

  const merged = dedupe([...tistoryResults, ...naverApiResults]);
  return merged
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return 0;
    })
    .slice(0, 150);
}
