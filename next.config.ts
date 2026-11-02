import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/mr", destination: "/en", permanent: true },
      { source: "/mr/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
