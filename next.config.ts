// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing configurations might be here (like reactStrictMode)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "", // Keep empty unless Contentful uses a specific port (unlikely)
        pathname: "/**", // Allow any path under this hostname
      },
      {
        protocol: "https",
        hostname: "downloads.ctfassets.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
