/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // The source PNGs in public/images are huge (photos saved as PNG, several
    // over 2000px wide). Letting Next optimize them converts to AVIF/WebP and
    // resizes per device — the difference between shipping ~14MB and ~200KB
    // on the homepage.
    formats: ['image/avif', 'image/webp'],

    // Widths Next is allowed to generate. A `sizes` value that resolves to a
    // width not listed here is rejected with a 400, and the browser has to
    // round up to the next available size — so the small widths our layout
    // actually uses (avatars, cards, bento tiles) are listed explicitly.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384, 400, 600],
    deviceSizes: [640, 750, 828, 1080, 1100, 1200, 1920, 2048, 3840],

    // Cache optimized variants for 30 days instead of the 60s default, so a
    // repeat visit does not re-run the optimizer.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
