import { defaultSources } from "../constants/defaultSources";
import { BlogSource } from "../types";

const SOURCE_KEY = "praise-search-blog-sources";
const RECENT_KEY = "praise-search-recent-keywords";

export const localStorageManager = {
  getBlogSources(): BlogSource[] {
    const raw = localStorage.getItem(SOURCE_KEY);
    if (!raw) {
      return defaultSources;
    }

    try {
      const parsed = JSON.parse(raw) as BlogSource[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return defaultSources;
      }
      return parsed;
    } catch {
      return defaultSources;
    }
  },

  saveBlogSources(sources: BlogSource[]): void {
    localStorage.setItem(SOURCE_KEY, JSON.stringify(sources));
  },

  getRecentSearches(): string[] {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as string[];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.slice(0, 10);
    } catch {
      return [];
    }
  },

  addRecentSearch(query: string): string[] {
    const list = this.getRecentSearches();
    const next = [query, ...list.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    return next;
  }
};
