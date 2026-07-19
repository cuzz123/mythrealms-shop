import type { NextConfig } from "next";

const noIndexHeaders = [
  { key: "X-Robots-Tag", value: "noindex, follow" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/story",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/collections/luxe-collection",
        destination: "/collections/pearl-series",
        permanent: true,
      },
      {
        source: "/collections/pearl-crystal-series",
        destination: "/collections/pearl-series",
        permanent: true,
      },
      {
        source: "/collections/curated-singles",
        destination: "/collections/pearl-series",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.imgix.net",
      },
    ],
    // Allow unoptimized images for dynamic/external URLs stored in DB
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://s.pinimg.com https://accounts.google.com https://*.paypal.com https://*.paypalobjects.com",
              "style-src 'self' 'unsafe-inline' https://*.paypal.com https://*.paypalobjects.com",
              "img-src 'self' data: https: blob: https://images.unsplash.com https://*.vercel-storage.com https://*.supabase.co https://*.amazonaws.com https://*.cloudinary.com https://*.imgix.net https://www.facebook.com https://ct.pinterest.com https://www.google-analytics.com",
              "font-src 'self'",
              "connect-src 'self' https://*.vercel-storage.com https://*.supabase.co https://*.agnes-ai.space https://www.google-analytics.com https://*.paypal.com https://*.paypalobjects.com https://*.lemonsqueezy.com https://accounts.google.com https://oauth2.googleapis.com",
              "frame-src 'self' https://*.paypal.com https://*.paypalobjects.com https://*.lemonsqueezy.com https://accounts.google.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      ...[
        "/account/:path*",
        "/admin/:path*",
        "/auth/:path*",
        "/cart",
        "/checkout/:path*",
        "/pinterest/:path*",
        "/returns",
        "/search",
        "/studio/:path*",
        "/track-order",
        "/unsubscribe",
        "/wishlist",
      ].map((source) => ({ source, headers: noIndexHeaders })),
    ];
  },
};

export default nextConfig;
