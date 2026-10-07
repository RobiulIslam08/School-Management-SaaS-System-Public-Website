export function apiOrigin(): string {
  return (process.env.API_PROXY_URL ?? "http://localhost:4000").replace(/\/$/, "");
}
