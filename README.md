# Public website

Visitor site for one school. Content is edited in the dashboard at `/website`. Same API and MongoDB as the dashboard.

```bash
npm install
npm run dev
```

Open http://localhost:3001. The API must be running on port 4000.

Copy `.env.example` to `.env.local` when the API or dashboard URL is not the local default.

`API_PROXY_URL` is the Express origin. `NEXT_PUBLIC_DASHBOARD_URL` is where Login goes. `NEXT_PUBLIC_SITE_URL` is this site, used for the sitemap.
