import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Repo already has agent instructions. Do not generate a second AGENTS.md.
  agentRules: false,
  headers: async () => [
    {
      source: "/media/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
