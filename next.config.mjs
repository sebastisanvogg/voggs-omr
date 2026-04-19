/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow uploads up to ~110 MB through Server Actions / route handlers.
    serverActions: { bodySizeLimit: "110mb" },
    // Don't let webpack try to bundle these — they ship native binaries and
    // dynamic requires that only work when resolved at runtime from
    // node_modules. Externalizing preserves the raw CJS `require()` calls.
    serverComponentsExternalPackages: ["ffmpeg-static", "fluent-ffmpeg"],
  },
  // Bundle ffmpeg binary into the analyze-ad lambda. Without this, Vercel's
  // output file tracing misses it and runtime spawns fail with
  // "Cannot find ffmpeg".
  outputFileTracingIncludes: {
    "/api/analyze-ad": ["./node_modules/ffmpeg-static/**"],
  },
  // The analyzer needs the Node runtime (ffmpeg, fs). We default routes to
  // node and opt-in to edge per-route where it makes sense.
};

export default nextConfig;
