import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode route indicator; compile and runtime errors still surface.
  devIndicators: false,
};

export default nextConfig;
