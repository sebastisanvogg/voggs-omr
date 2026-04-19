/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow uploads up to ~110 MB through Server Actions / route handlers.
    serverActions: { bodySizeLimit: "110mb" },
  },
  // Video frame extraction happens in the browser via canvas — no native
  // binaries required on the server.
};

export default nextConfig;
