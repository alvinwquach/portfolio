/**
 * Next.js Configuration
 * =====================
 * Optimized configuration for production portfolio
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for Sanity CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking - use CSP frame-ancestors instead of X-Frame-Options
          // to allow SoundCloud widget iframe while blocking others
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Content Security Policy - allow SoundCloud iframe and scripts
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://w.soundcloud.com https://api.soundcloud.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdn.sanity.io https://*.sndcdn.com https://i1.sndcdn.com",
              "media-src 'self' https://*.sndcdn.com https://*.soundcloud.com blob:",
              "frame-src https://w.soundcloud.com https://api.soundcloud.com",
              "connect-src 'self' https://api.soundcloud.com https://*.sndcdn.com https://*.sanity.io wss://*.sanity.io",
              "font-src 'self' data:",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enable XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Hide X-Powered-By header
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Experimental features for performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'd3', 'gsap'],
  },
};

export default nextConfig;
