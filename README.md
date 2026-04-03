# Praise Score Search

React + TypeScript + Vite + Tailwind + Vercel Serverless MVP.

## Run

```bash
npm.cmd install
npm.cmd run dev
```

Build:

```bash
npm.cmd run build
```

## Deploy (Vercel)

1. Push repository to GitHub.
2. Import to Vercel.
3. Framework preset: `Vite`.
4. Deploy.

## Search Sources

Backend merges results from:

- configured blog sources (Tistory RSS/HTML, Naver RSS/HTML)
- Naver Blog Search API (optional, if env is configured)
- Google Custom Search API (optional, if env is configured)

All results are returned in one API and rendered with the same card UI.

## Environment Variables (optional but recommended)

Create `.env` (local) and configure Vercel project env:

```bash
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_CX=your_google_cse_id
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

If these are missing, the app still works using blog source crawling only.

## API

`POST /api/search`

Request:

```json
{
  "query": "주님의 선하심",
  "sources": [],
  "useGoogleFallback": true
}
```

Response item:

```json
{
  "title": "주님의 선하심 악보",
  "url": "https://...",
  "key": "A",
  "source": "Google",
  "publishedAt": "",
  "score": 92,
  "matchType": "exact"
}
```
