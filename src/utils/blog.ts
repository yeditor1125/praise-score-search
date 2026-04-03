import { BlogType } from "../types";

export function parseBlogType(url: string): BlogType {
  const value = url.toLowerCase();
  if (value.includes("tistory.com")) {
    return "tistory";
  }
  return "naver";
}

export function buildSearchUrl(query: string, key?: string): string {
  const suffix = key ? `${query} ${key} 악보` : `${query} 악보`;
  return `https://www.google.com/search?q=${encodeURIComponent(suffix)}`;
}

export function createId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}
