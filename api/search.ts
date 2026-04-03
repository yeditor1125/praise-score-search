import type { VercelRequest, VercelResponse } from "@vercel/node";
import { type BlogSource, runSearch } from "../lib/server/searchService";

function parseBody(input: unknown): { query: string; sources?: BlogSource[] } {
  if (typeof input === "string") {
    try {
      return JSON.parse(input) as { query: string; sources?: BlogSource[] };
    } catch {
      return { query: "" };
    }
  }
  return (input as { query: string; sources?: BlogSource[] }) ?? { query: "" };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const body = parseBody(req.body);
  const query = `${body.query ?? ""}`.trim();
  if (!query) {
    return res.status(400).json({ message: "query is required" });
  }

  const result = await runSearch(query, body.sources);
  return res.status(200).json(result);
}
