/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow uploads up to ~110 MB through Server Actions / route handlers.
    serverActions: { bodySizeLimit: "110mb" },
  },
  // The analyzer needs the Node runtime (ffmpeg, fs). We default routes to
  // node and opt-in to edge per-route where it makes sense.
};

export default nextConfig;
