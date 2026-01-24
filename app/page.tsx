/**
 * Home Page Component
 * ===================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This is the homepage of your portfolio - the first page visitors see
 * when they visit your root URL (e.g., https://alvinquach.dev/).
 *
 * In Next.js App Router:
 *   - app/page.tsx = the "/" route (homepage)
 *   - app/about/page.tsx = the "/about" route
 *   - app/projects/page.tsx = the "/projects" route
 *
 * FILE NAMING CONVENTION:
 * -----------------------
 * Next.js App Router uses special filenames:
 *   - page.tsx: The actual page content (required for a route)
 *   - layout.tsx: Wrapper that persists across navigation
 *   - loading.tsx: Loading UI shown while page loads
 *   - error.tsx: Error boundary for this route
 *   - not-found.tsx: 404 page for this route segment
 *
 * SERVER COMPONENT BY DEFAULT:
 * ----------------------------
 * Notice there's no "use client" at the top. This means:
 *   - This component runs on the SERVER first
 *   - HTML is generated on the server and sent to browser
 *   - Better for SEO (search engines see full content)
 *   - Faster initial page load
 *   - Can fetch data directly (async/await in component)
 *
 * If you need interactivity (useState, useEffect, onClick):
 *   - Add "use client" at the top, OR
 *   - Create a separate Client Component and import it here
 *
 * CURRENT STATE:
 * --------------
 * This is the default Next.js starter page. You'll replace this with
 * your actual portfolio content, likely fetching from Sanity:
 *
 * EXAMPLE WITH SANITY:
 * --------------------
 * import { sanityFetch } from '@/sanity/lib/live'
 *
 * export default async function Home() {
 *   const { data: profile } = await sanityFetch({
 *     query: `*[_type == "profile"][0]{ name, headline, bio }`
 *   })
 *
 *   const { data: projects } = await sanityFetch({
 *     query: `*[_type == "project" && featured == true] | order(order asc) {
 *       _id, name, tagline, slug, image
 *     }`
 *   })
 *
 *   return (
 *     <main>
 *       <h1>{profile.name}</h1>
 *       <p>{profile.headline}</p>
 *       {projects.map(project => (
 *         <ProjectCard key={project._id} project={project} />
 *       ))}
 *     </main>
 *   )
 * }
 *
 * TAILWIND CSS CLASSES EXPLAINED:
 * --------------------------------
 * The className strings use Tailwind CSS utility classes:
 *
 * Layout:
 *   - flex: Display as flexbox
 *   - flex-col: Stack children vertically
 *   - items-center: Center items on cross-axis
 *   - justify-center: Center items on main-axis
 *   - justify-between: Space items with equal gaps
 *   - min-h-screen: Minimum height of full viewport
 *
 * Spacing:
 *   - py-32: Padding top and bottom (32 = 8rem = 128px)
 *   - px-16: Padding left and right (16 = 4rem = 64px)
 *   - gap-6: Gap between flex children (6 = 1.5rem = 24px)
 *
 * Sizing:
 *   - w-full: Width 100%
 *   - max-w-3xl: Maximum width (48rem = 768px)
 *   - h-12: Height (12 = 3rem = 48px)
 *
 * Typography:
 *   - text-3xl: Font size (1.875rem)
 *   - font-semibold: Font weight 600
 *   - leading-10: Line height (10 = 2.5rem)
 *   - tracking-tight: Letter spacing (-0.025em)
 *
 * Colors:
 *   - bg-zinc-50: Light gray background
 *   - text-black: Black text
 *   - dark:bg-black: Black background in dark mode
 *   - dark:text-zinc-50: Light text in dark mode
 *
 * Responsive:
 *   - sm:items-start: Align left on small screens and up
 *   - sm:text-left: Left-align text on small screens and up
 *   - md:w-[158px]: Fixed width on medium screens and up
 *
 * Interactive:
 *   - hover:bg-[#383838]: Background color on hover
 *   - transition-colors: Smooth color transitions
 *
 * NEXT/IMAGE COMPONENT:
 * ---------------------
 * import Image from "next/image" provides:
 *   - Automatic optimization (WebP, sizing)
 *   - Lazy loading by default
 *   - Prevents layout shift (requires width/height)
 *   - priority: Preload this image (use for above-fold content)
 *   - dark:invert: Invert colors in dark mode (SVG trick)
 *
 * LINK ATTRIBUTES:
 * ----------------
 * target="_blank": Open in new tab
 * rel="noopener noreferrer": Security best practice
 *   - noopener: Prevents new page from accessing window.opener
 *   - noreferrer: Prevents sending referrer header
 *
 * NEXT STEPS - BUILDING YOUR PORTFOLIO:
 * -------------------------------------
 * 1. Replace this content with your actual portfolio
 * 2. Fetch profile data from Sanity
 * 3. Display featured projects
 * 4. Add navigation to other pages
 * 5. Style according to your design
 *
 * RELATED FILES:
 * --------------
 * - app/layout.tsx: Root layout wrapping this page
 * - sanity/lib/live.ts: sanityFetch for data fetching
 * - sanity/schemaTypes/profile.ts: Profile schema
 * - sanity/schemaTypes/project.ts: Project schema
 */

import Image from "next/image";

/**
 * Home Page Component
 *
 * This is a SERVER COMPONENT (no "use client" directive).
 * It renders the homepage content at the "/" route.
 *
 * COMPONENT PATTERN:
 * - export default: Makes this the main export of the file
 * - function Home(): Named function for better debugging
 * - Returns JSX: The UI to render
 */
export default function Home() {
  return (
    /**
     * OUTER CONTAINER
     * Centers content on the page with a light gray background.
     * Dark mode: Switches to black background.
     */
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/**
       * MAIN CONTENT AREA
       * - max-w-3xl: Limits width for readability
       * - Responsive: Centers on mobile, aligns left on desktop
       */}
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/**
         * LOGO IMAGE
         * - priority: Preloads this image (important for LCP)
         * - dark:invert: Inverts SVG colors in dark mode
         */}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        {/**
         * HERO CONTENT
         * - Title and description
         * - Responsive: Centers on mobile, aligns left on larger screens
         */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>

        {/**
         * CALL-TO-ACTION BUTTONS
         * - Primary (filled): "Deploy Now" - stands out
         * - Secondary (outlined): "Documentation" - less prominent
         * - Responsive: Stacks on mobile, side-by-side on desktop
         */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {/* Primary CTA Button */}
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>

          {/* Secondary CTA Button */}
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
