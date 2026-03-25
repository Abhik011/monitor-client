import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  /* enable static export */
  output: "export",

  /* required for static hosting */
  trailingSlash: true,

  /* disable Next image optimizer for static builds */
  images: {
    unoptimized: true
  }

};

export default nextConfig;