import { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { type BlogSource, runSearch } from "./lib/server/searchService";

function readJsonBody(req: IncomingMessage): Promise<{ query: string; sources?: BlogSource[] }> {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({ query: "" });
        return;
      }
      try {
        resolve(JSON.parse(raw) as { query: string; sources?: BlogSource[] });
      } catch {
        resolve({ query: "" });
      }
    });
    req.on("error", () => resolve({ query: "" }));
  });
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function devApiPlugin(): Plugin {
  return {
    name: "dev-api-search",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/search")) {
          next();
          return;
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          sendJson(res, 405, { message: "Method Not Allowed" });
          return;
        }

        const body = await readJsonBody(req);
        const query = `${body.query ?? ""}`.trim();
        if (!query) {
          sendJson(res, 400, { message: "query is required" });
          return;
        }

        try {
          const result = await runSearch(query, body.sources);
          sendJson(res, 200, result);
        } catch {
          sendJson(res, 500, { message: "Search failed" });
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), devApiPlugin()]
  };
});
