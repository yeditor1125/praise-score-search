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
export declare const defaultSources: BlogSource[];
export declare function runSearch(query: string, sources?: BlogSource[]): Promise<SearchItem[]>;
