/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow uploads up to ~110 MB through Server Actions / route handlers.
    serverActions: { bodySizeLimit: "110mb" },
    // Don't let webpack try to bundle these — they ship native binaries and
    // dynamic requires that only work when resolved at runtime from
    // node_modules. Externalizing preserves the raw CJS `require()` calls.
    serverComponentsExternalPackages: [
      "ffmpeg-static",
      "@ffprobe-installer/ffprobe",
      "fluent-ffmpeg",
    ],
  },
  // Bundle ffmpeg + ffprobe binaries into serverless functions. Without this,
  // Vercel's output file tracing misses them and runtime spawns fail with
  // "Cannot find ffmpeg/ffprobe".
  outputFileTracingIncludes: {
    "/api/analyze-ad": [
      "./node_modules/ffmpeg-static/**",
      "./node_modules/@ffprobe-installer/**",
    ],
  },
  // The analyzer needs the Node runtime (ffmpeg, fs). We default routes to
  // node and opt-in to edge per-route where it makes sense.
};

export default nextConfig;
