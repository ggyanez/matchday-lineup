import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Every page here fetches live data on mount (players, favorite
    // formations, ...). Next's client-side Router Cache would otherwise
    // reuse a page visited in the last 5 minutes (the default for static
    // pages) instead of refetching, so an edit made on one page could
    // still look stale after navigating to another and back.
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
};

export default nextConfig;
