import { BlogSource, SearchItem, SearchRequest } from "../types";

export async function searchPosts(query: string, sources: BlogSource[]): Promise<SearchItem[]> {
  const payload: SearchRequest = { query, sources };
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = (await response.json()) as SearchItem[];
  return data;
}
