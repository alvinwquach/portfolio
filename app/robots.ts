/**
 * Robots.txt Configuration
 * ========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file generates a robots.txt for your website. Robots.txt tells
 * search engine crawlers (like Googlebot) which pages they can access
 * and which pages to ignore.
 *
 * WHY USE A FUNCTION INSTEAD OF A STATIC FILE?
 * ---------------------------------------------
 * You could create a static public/robots.txt file, but using a function:
 *   - Allows dynamic rules based on environment
 *   - Gets TypeScript type checking
 *   - Follows the Next.js App Router pattern
 *   - Auto-generates at build time
 *
 * HOW IT WORKS:
 * -------------
 * 1. Next.js sees app/robots.ts exists
 * 2. At build time, Next.js calls this function
 * 3. The returned object is converted to robots.txt format
 * 4. The file is served at yourdomain.com/robots.txt
 *
 * ROBOTS.TXT FORMAT EXPLAINED:
 * ----------------------------
 * The generated file looks like:
 *
 *   User-agent: *           // Which bots this rule applies to (* = all)
 *   Allow: /                // Allow crawling the homepage and all sub-paths
 *   Disallow: /studio       // Block the Sanity Studio (internal tool)
 *   Disallow: /api/         // Block API routes (not content pages)
 *
 *   Sitemap: https://...    // Tell bots where to find your sitemap
 *
 * RULE LOGIC:
 * -----------
 * - userAgent: "*" means "all search engines"
 * - Could also target specific bots: "Googlebot", "Bingbot", etc.
 * - allow: "/" means crawl everything starting from root
 * - disallow takes precedence for specific paths
 *
 * WHY DISALLOW THESE PATHS?
 * -------------------------
 *
 * /studio:
 *   - Sanity Studio is your content editing interface
 *   - Not meant for public visitors or search engines
 *   - Would confuse search results (admin UI, not content)
 *
 * /api/:
 *   - API routes return JSON, not HTML pages
 *   - Not useful for search engine indexing
 *   - Could expose internal implementation details
 *   - Draft mode routes shouldn't be crawled
 *
 * WHAT SHOULD YOU ALLOW?
 * ----------------------
 * - Homepage: /
 * - Projects: /projects/*
 * - Blog posts: /blog/*
 * - Any content pages you want in search results
 *
 * WHAT ELSE TO DISALLOW?
 * ----------------------
 * Common patterns:
 *   - /admin (if you have admin routes)
 *   - /preview (if you have preview routes)
 *   - /_next (Next.js internals, already blocked by default)
 *   - /private (any private content)
 *
 * SITEMAP REFERENCE:
 * ------------------
 * The sitemap URL tells search engines where to find your sitemap.xml
 * This helps them discover all your content pages efficiently.
 *
 * TESTING YOUR ROBOTS.TXT:
 * ------------------------
 * 1. Run your dev server: npm run dev
 * 2. Visit: http://localhost:3000/robots.txt
 * 3. You should see the generated robots.txt content
 *
 * After deploying:
 *   - Google Search Console → robots.txt tester
 *   - Enter URLs to check if they're blocked or allowed
 *
 * IMPORTANT NOTES:
 * ----------------
 * - robots.txt is a SUGGESTION, not enforcement
 * - Well-behaved bots follow it, malicious ones ignore it
 * - Don't use robots.txt for security (use auth instead)
 * - It's public - anyone can view your robots.txt
 *
 * RELATED FILES:
 * --------------
 * - app/sitemap.ts: Generates the sitemap referenced here
 * - app/layout.tsx: Contains metadata for SEO
 *
 * DOCUMENTATION:
 * --------------
 * - https://nextjs.org/docs/app/api-reference/file-conventions/robots
 * - https://developers.google.com/search/docs/crawling-indexing/robots/intro
 */

import { MetadataRoute } from "next";

/**
 * Generate robots.txt configuration
 *
 * MetadataRoute.Robots is the return type from Next.js
 * It provides type safety for the robots.txt structure
 *
 * @returns Robots.txt configuration object
 */
export default function robots(): MetadataRoute.Robots {
  return {
    /**
     * RULES ARRAY
     * Define which bots can access which paths
     * Multiple rules can target different user agents
     */
    rules: [
      {
        // Target all search engine bots
        userAgent: "*",

        // Allow crawling from the root (and all sub-paths by default)
        allow: "/",

        // Block these specific paths from being crawled
        disallow: [
          "/studio",   // Sanity Studio - internal CMS interface
          "/api/",     // API routes - not content pages
          "/tracker",  // Private job tracker - not public content
        ],
      },
    ],

    /**
     * SITEMAP URL
     * Points search engines to your sitemap.xml
     * Update this to your actual production domain
     */
    sitemap: "https://alvinquach.dev/sitemap.xml",
  };
}
