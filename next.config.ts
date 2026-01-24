/**
 * Next.js Configuration
 * =====================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file configures Next.js build and runtime behavior.
 * It's loaded automatically by Next.js during development and build.
 *
 * WHY CONFIGURE NEXT.JS?
 * ----------------------
 * While Next.js has sensible defaults, you often need to:
 *   - Configure image domains for external images
 *   - Set up redirects and rewrites
 *   - Enable experimental features
 *   - Configure environment-specific behavior
 *   - Optimize the build for production
 *
 * CONFIGURATION OPTIONS (Common ones):
 * ------------------------------------
 *
 * images:
 *   Configure the Image Optimization API
 *   - domains: External image domains to allow
 *   - remotePatterns: More flexible domain patterns
 *   - deviceSizes: Responsive breakpoints
 *   - imageSizes: Additional sizes for srcset
 *
 *   Example:
 *   images: {
 *     remotePatterns: [
 *       {
 *         protocol: 'https',
 *         hostname: 'cdn.sanity.io',
 *         pathname: '/images/**',
 *       },
 *     ],
 *   }
 *
 * redirects:
 *   Permanent or temporary URL redirects
 *   - Runs on the server before the page loads
 *   - Great for URL migrations
 *
 *   Example:
 *   async redirects() {
 *     return [
 *       {
 *         source: '/old-blog/:slug',
 *         destination: '/blog/:slug',
 *         permanent: true,  // 308 status code
 *       },
 *     ]
 *   }
 *
 * rewrites:
 *   URL rewriting without changing the visible URL
 *   - User sees /api/proxy but request goes to external API
 *   - Useful for hiding backend URLs
 *
 *   Example:
 *   async rewrites() {
 *     return [
 *       {
 *         source: '/api/proxy/:path*',
 *         destination: 'https://external-api.com/:path*',
 *       },
 *     ]
 *   }
 *
 * headers:
 *   Custom HTTP headers for routes
 *   - Security headers (CSP, HSTS)
 *   - Cache control
 *   - CORS headers
 *
 *   Example:
 *   async headers() {
 *     return [
 *       {
 *         source: '/(.*)',
 *         headers: [
 *           { key: 'X-Frame-Options', value: 'DENY' },
 *         ],
 *       },
 *     ]
 *   }
 *
 * env:
 *   Expose environment variables to the browser
 *   - Note: Prefer NEXT_PUBLIC_ prefix instead
 *
 * experimental:
 *   Enable experimental Next.js features
 *   - Features may change or be removed
 *   - Check Next.js docs for current options
 *
 * PERFORMANCE OPTIONS:
 * --------------------
 *
 * reactStrictMode: (default: true in Next.js 13+)
 *   - Highlights potential problems in development
 *   - Double-invokes lifecycle methods to detect side effects
 *   - Recommended to keep enabled
 *
 * poweredByHeader: (default: true)
 *   - Adds "X-Powered-By: Next.js" header
 *   - Set to false to hide (minor security benefit)
 *
 * compress: (default: true)
 *   - Enable gzip compression
 *   - Disable if using a CDN that handles compression
 *
 * TYPESCRIPT CONFIGURATION:
 * -------------------------
 * This file uses TypeScript (next.config.ts vs next.config.js)
 *
 * Benefits:
 *   - Type checking for configuration options
 *   - Autocomplete in your editor
 *   - Catches typos in option names
 *
 * The NextConfig type is imported from 'next' package.
 *
 * ENVIRONMENT-SPECIFIC CONFIG:
 * ----------------------------
 * You can use process.env to conditionally configure:
 *
 *   const nextConfig: NextConfig = {
 *     // Only enable in development
 *     ...(process.env.NODE_ENV === 'development' && {
 *       logging: {
 *         fetches: { fullUrl: true },
 *       },
 *     }),
 *   }
 *
 * SANITY-SPECIFIC NOTES:
 * ----------------------
 * For this portfolio with Sanity:
 *
 * 1. Images: Sanity's CDN (cdn.sanity.io) is automatically configured
 *    by the @sanity/image-url package, but you may want to add:
 *
 *    images: {
 *      remotePatterns: [
 *        { protocol: 'https', hostname: 'cdn.sanity.io' },
 *      ],
 *    }
 *
 * 2. Draft Mode: Already configured via API routes, no config needed here
 *
 * 3. Studio Route: Sanity Studio runs at /studio, handled by Next.js
 *    routing automatically
 *
 * COMMON GOTCHAS:
 * ---------------
 * - Changes require dev server restart
 * - Some options only apply to production builds
 * - Images from external domains need explicit configuration
 * - Redirects/rewrites run before pages, not after
 *
 * RELATED FILES:
 * --------------
 * - tsconfig.json: TypeScript configuration
 * - package.json: Next.js version and scripts
 * - app/layout.tsx: Root layout with metadata
 *
 * DOCUMENTATION:
 * --------------
 * https://nextjs.org/docs/app/api-reference/next-config-js
 */

import type { NextConfig } from "next";

/**
 * Next.js Configuration Object
 *
 * Currently using defaults, but this is where you would add:
 *   - Image optimization settings
 *   - Redirects and rewrites
 *   - Security headers
 *   - Experimental features
 *
 * The empty object means "use all Next.js defaults"
 */
const nextConfig: NextConfig = {
  /*
   * Configuration options can be added here as needed.
   *
   * Common additions for a Sanity portfolio:
   *
   * images: {
   *   remotePatterns: [
   *     {
   *       protocol: 'https',
   *       hostname: 'cdn.sanity.io',
   *       pathname: '/images/**',
   *     },
   *   ],
   * },
   *
   * For security headers, redirects, etc., add the
   * appropriate configuration objects as documented above.
   */
};

export default nextConfig;
