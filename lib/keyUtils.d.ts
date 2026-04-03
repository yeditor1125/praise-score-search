export declare const UNKNOWN_KEY = "\uD0A4 \uBBF8\uD655\uC778";
export declare function normalizeKey(raw: string): string;
export declare function extractKeyFromTitle(title: string): string;
export declare function groupByKey<T extends {
    key: string;
}>(items: T[]): Record<string, T[]>;
