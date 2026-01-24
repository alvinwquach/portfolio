/**
 * Sitemap Configuration
 * =====================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file generates a sitemap.xml for your website. A sitemap is an XML
 * file that lists all the pages on your site, helping search engines like
 * Google discover and index your content efficiently.
 *
 * WHY DO YOU NEED A SITEMAP?
 * --------------------------
 * Without a sitemap:
 *   - Search engines find pages by following links
 *   - New or orphaned pages might not be discovered
 *   - Crawling is less efficient
 *
 * With a sitemap:
 *   - Search engines know ALL your pages immediately
 *   - New content is discovered faster
 *   - You can set priority and update frequency hints
 *   - Better SEO coverage
 *
 * HOW IT WORKS:
 * -------------
 * 1. Next.js detects app/sitemap.ts
 * 2. At build time (or on request), calls this function
 * 3. Returns an array of URL objects
 * 4. Next.js converts to XML format
 * 5. Served at yourdomain.com/sitemap.xml
 *
 * SITEMAP XML FORMAT:
 * -------------------
 * The generated XML looks like:
 *
 *   <?xml version="1.0" encoding="UTF-8"?>
 *   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 *     <url>
 *       <loc>https://alvinquach.dev/</loc>
 *       <lastmod>2025-01-24</lastmod>
 *       <changefreq>weekly</changefreq>
 *       <priority>1</priority>
 *     </url>
 *     <url>
 *       <loc>https://alvinquach.dev/projects</loc>
 *       ...
 *     </url>
 *   </urlset>
 *
 * SITEMAP FIELDS EXPLAINED:
 * -------------------------
 *
 * url (required):
 *   - The full URL of the page
 *   - Must be absolute (include https://domain)
 *
 * lastModified (optional):
 *   - When the page was last updated
 *   - Helps search engines prioritize recrawling
 *   - Use actual dates when possible (from CMS)
 *
 * changeFrequency (optional):
 *   - How often content typically changes
 *   - Values: always, hourly, daily, weekly, monthly, yearly, never
 *   - This is a HINT, not a command
 *
 * priority (optional):
 *   - Relative importance (0.0 to 1.0)
 *   - Default is 0.5
 *   - 1.0 = most important (homepage)
 *   - 0.1 = least important (archive pages)
 *   - Only affects YOUR site, not vs other sites
 *
 * DYNAMIC SITEMAPS WITH SANITY:
 * -----------------------------
 * For a portfolio, you want to include dynamic content from Sanity.
 * Here's how to do it:
 *
 * EXAMPLE (make function async):
 * ------------------------------
 * import { client } from '@/sanity/lib/client'
 *
 * export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 *   const baseUrl = "https://alvinquach.dev"
 *
 *   // Fetch all published projects from Sanity
 *   const projects = await client.fetch(`
 *     *[_type == "project" && defined(slug.current)]{
 *       "slug": slug.current,
 *       _updatedAt
 *     }
 *   `)
 *
 *   // Fetch all published blog posts
 *   const posts = await client.fetch(`
 *     *[_type == "knowledgeNode" && defined(slug.current)]{
 *       "slug": slug.current,
 *       _updatedAt
 *     }
 *   `)
 *
 *   // Static pages
 *   const staticPages = [
 *     { url: baseUrl, lastModified: new Date(), priority: 1 },
 *     { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
 *   ]
 *
 *   // Dynamic project pages
 *   const projectPages = projects.map((project: any) => ({
 *     url: `${baseUrl}/projects/${project.slug}`,
 *     lastModified: new Date(project._updatedAt),
 *     changeFrequency: 'monthly' as const,
 *     priority: 0.7,
 *   }))
 *
 *   return [...staticPages, ...projectPages]
 * }
 *
 * BEST PRACTICES:
 * ---------------
 * 1. Only include pages you want indexed (no 404s, no private pages)
 * 2. Use accurate lastModified dates from your CMS
 * 3. Keep your sitemap under 50,000 URLs (50MB uncompressed)
 * 4. For large sites, use sitemap index files
 * 5. Reference your sitemap in robots.txt
 *
 * TESTING YOUR SITEMAP:
 * ---------------------
 * 1. Run dev server: npm run dev
 * 2. Visit: http://localhost:3000/sitemap.xml
 * 3. You should see XML output
 *
 * After deploying:
 *   - Submit to Google Search Console
 *   - Submit to Bing Webmaster Tools
 *   - Check for errors in the sitemap validation
 *
 * THE MAP FUNCTION EXPLAINED:
 * ---------------------------
 * routes.map((route) => ({ ... }))
 *
 * This transforms the routes array:
 *   ["", "/projects", "/experience", ...]
 *
 * Into sitemap objects:
 *   [
 *     { url: "https://...", lastModified: Date, ... },
 *     { url: "https://.../projects", lastModified: Date, ... },
 *     ...
 *   ]
 *
 * The ternary operator:
 *   route === "" ? 1 : 0.8
 *
 * Means: "if route is empty (homepage), priority is 1, otherwise 0.8"
 *
 * TYPESCRIPT NOTE:
 * ----------------
 * "weekly" as const
 *
 * TypeScript needs to know this is the literal "weekly", not just any string.
 * `as const` tells TypeScript to treat it as a specific value.
 *
 * RELATED FILES:
 * --------------
 * - app/robots.ts: References this sitemap
 * - sanity/lib/client.ts: For fetching dynamic content
 *
 * DOCUMENTATION:
 * --------------
 * - https://nextjs.org/docs/app/api-reference/file-conventions/sitemap
 * - https://www.sitemaps.org/protocol.html
 */

import { MetadataRoute } from "next";

/**
 * Generate sitemap.xml configuration
 *
 * MetadataRoute.Sitemap is the return type from Next.js
 * It's an array of URL objects with optional metadata
 *
 * @returns Array of sitemap URL entries
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * BASE URL
   * The production domain for your site
   * All URLs are built from this base
   */
  const baseUrl = "https://alvinquach.dev";

  /**
   * ROUTE DEFINITIONS
   * Array of route paths (without the domain)
   *
   * "" = homepage (/)
   * "/projects" = /projects
   * etc.
   *
   * Add new routes here as you build pages
   */
  const routes = [
    "",           // Home - most important page
    "/projects",  // Projects page - showcase work
    "/experience",// Experience page - work history
    "/skills",    // Skills page - technical abilities
    "/contact",   // Contact page - how to reach you
  ];

  /**
   * TRANSFORM ROUTES TO SITEMAP ENTRIES
   *
   * .map() iterates over each route and returns an object
   * with the sitemap metadata
   */
  return routes.map((route) => ({
    // Full URL = base + route (e.g., "https://alvinquach.dev/projects")
    url: `${baseUrl}${route}`,

    // Current date as last modified (update when you have real dates)
    lastModified: new Date(),

    // Weekly updates - adjust based on how often you update
    changeFrequency: "weekly" as const,

    // Homepage (empty route) gets priority 1.0, others get 0.8
    priority: route === "" ? 1 : 0.8,
  }));
}
