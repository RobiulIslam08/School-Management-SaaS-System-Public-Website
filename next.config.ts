import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Repo already has agent instructions. Do not generate a second AGENTS.md.
  agentRules: false,
};

export default nextConfig;
