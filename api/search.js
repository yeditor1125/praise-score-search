const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const defaultSources = [
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
  }
];

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTag(text) {
  return decodeHtml((text || "").replace(/<[^>]*>/g, "")).trim();
}

function normalizeForMatch(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\uac00-\ud7a3]+/gi, "")
    .trim();
}

function classifyMatch(title, query) {
  const t = normalizeForMatch(title);
  const q = normalizeForMatch(query);
  if (q && t.includes(q)) return "exact";
  return "similar";
}

function relevanceScore(title, query) {
  const loweredTitle = (title || "").toLowerCase();
  const loweredQuery = (query || "").toLowerCase();
  if (loweredTitle === loweredQuery) return 120;
  if (loweredTitle.includes(loweredQuery)) return 90;
  const words = loweredQuery.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const word of words) {
    if (loweredTitle.includes(word)) score += 24;
  }
  return score;
}

function extractKeyFromTitle(title) {
  const text = (title || "")
    .replace(/♭/g, "b")
    .replace(/＃/g, "#")
    .replace(/샵/gi, "#")
    .replace(/플랫/gi, "b");

  const minorWord = text.match(/\b([A-G](?:#|b)?)\s*(?:minor)\b/i);
  if (minorWord) return `${minorWord[1][0].toUpperCase()}${minorWord[1].slice(1)}m`;

  const minorCompact = text.match(/\b([A-G](?:#|b)?)m\b/);
  if (minorCompact) return `${minorCompact[1][0].toUpperCase()}${minorCompact[1].slice(1)}m`;

  const majorWithMarker = text.match(/\b([A-G](?:#|b)?)\s*(?:key|키)\b/i);
  if (majorWithMarker) return `${majorWithMarker[1][0].toUpperCase()}${majorWithMarker[1].slice(1)}`;

  const plain = text.match(/\b([A-G](?:#|b)?)\b/);
  if (plain) return `${plain[1][0].toUpperCase()}${plain[1].slice(1)}`;

  return "키 미확인";
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT }
    });
    if (!response.ok) return "";
    return await response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        ...headers
      }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function getRootUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url;
  }
}

function parseTistoryRss(xml, source, query) {
  const items = [];
  const blocks = (xml || "").match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of blocks) {
    const title = stripTag(((block.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "").trim());
    const link = (((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "").trim());
    const pubDate = (((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "").trim());
    const score = relevanceScore(title, query);
    if (!title || !link || score <= 0) continue;
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

function parseTistoryHtml(html, source, query) {
  const items = [];
  const matches = (html || "").match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];
  const root = getRootUrl(source.url);
  for (const block of matches) {
    const href = (((block.match(/href="([^"]+)"/i) || [])[1] || "").trim());
    const title = stripTag(((block.match(/>([\s\S]*?)<\/a>/i) || [])[1] || ""));
    if (!href || !title || title.length < 2) continue;
    const score = relevanceScore(title, query);
    if (score <= 0) continue;
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

async function collectFromTistory(source, query) {
  const root = getRootUrl(source.url);
  const rss = await fetchText(`${root}/rss`);
  if (rss) {
    const parsed = parseTistoryRss(rss, source, query);
    if (parsed.length > 0) return parsed;
  }
  const html = await fetchText(source.url);
  return html ? parseTistoryHtml(html, source, query) : [];
}

async function searchNaverApi(query) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return [];

  const endpoint =
    "https://openapi.naver.com/v1/search/blog.json" +
    `?query=${encodeURIComponent(`${query} 악보`)}` +
    "&display=30&sort=sim";

  const response = await fetchJson(endpoint, {
    "X-Naver-Client-Id": clientId,
    "X-Naver-Client-Secret": clientSecret
  });

  const items = (response && response.items) || [];
  return items
    .filter((item) => item && item.title && item.link)
    .map((item) => {
      const title = stripTag(item.title || "");
      const link = decodeHtml(item.link || "");
      const snippet = stripTag(item.description || "");
      return {
        title,
        url: link,
        key: extractKeyFromTitle(title),
        source: item.bloggername ? `Naver:${item.bloggername}` : "Naver Search",
        score: Math.max(relevanceScore(`${title} ${snippet}`, query), 28),
        publishedAt: item.postdate || "",
        matchType: classifyMatch(title, query)
      };
    });
}

function dedupe(items) {
  const map = new Map();
  for (const item of items || []) {
    const key = item.url || item.title;
    const existing = map.get(key);
    if (!existing || item.score > existing.score) map.set(key, item);
  }
  return Array.from(map.values());
}

async function runSearch(query, sources) {
  const target = (Array.isArray(sources) && sources.length ? sources : defaultSources).filter((s) => s.enabled);
  const tistorySources = target.filter((s) => s.type === "tistory");

  const [tistoryResults, naverApiResults] = await Promise.all([
    Promise.allSettled(tistorySources.map((source) => collectFromTistory(source, query))).then((settled) =>
      settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    ),
    searchNaverApi(query)
  ]);

  return dedupe([...(tistoryResults || []), ...(naverApiResults || [])])
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.publishedAt && b.publishedAt) return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      return 0;
    })
    .slice(0, 150);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const query = `${body.query || ""}`.trim();
    if (!query) return res.status(400).json({ message: "query is required" });

    const result = await runSearch(query, body.sources);
    return res.status(200).json(result);
  } catch (error) {
    console.error("search-api-error", error);
    return res.status(200).json([]);
  }
};
