/**
 * Root Layout
 * ===========
 *
 * WHAT IS A LAYOUT?
 * - A layout wraps all pages in a route segment
 * - app/layout.tsx is the ROOT layout - wraps the ENTIRE application
 * - Layouts persist across navigation (not re-mounted when changing pages)
 * - Use for: shared UI, global providers, meta tags, fonts
 *
 * THIS IS A SERVER COMPONENT:
 * - No "use client" directive = Server Component by default
 * - Can use async/await directly in the component
 * - Can access server-only features (cookies, headers, database)
 * - Cannot use hooks or browser APIs
 */

/**
 * Metadata Type:
 * TypeScript type for Next.js metadata (title, description, etc.)
 * Provides autocomplete and type checking for SEO fields
 */
import type { Metadata } from "next";

/**
 * next/font/google - Font Optimization
 * ------------------------------------
 * - Downloads fonts at BUILD time, not runtime
 * - Self-hosts fonts (no request to Google at runtime)
 * - Automatically applies size-adjust to minimize CLS (layout shift)
 * - Returns object with className and variable properties
 *
 * variable: Creates a CSS custom property used by globals.css @theme inline
 * subsets: Which character sets to include (reduces file size)
 *
 * MODIFIED(feat/design-system): Late Night Session typography
 *   display → Space Mono   (retro-future headings, brand moments)
 *   body    → DM Sans      (clean geometric sans; Satoshi not on @fontsource)
 *   code    → Fira Code    (ligature-rich monospace for editor + code blocks)
 */
import { Space_Mono, DM_Sans, Fira_Code } from "next/font/google";

/**
 * Global CSS:
 * - Imported here, applies to entire application
 * - Contains Tailwind directives (@tailwind base/components/utilities)
 * - Global styles, CSS variables, base typography
 */
import "./globals.css";

/**
 * VisualEditing from next-sanity:
 * - Enables click-to-edit in Sanity's Presentation Tool
 * - When in draft mode, content elements become clickable
 * - Clicking opens that content in Sanity Studio for editing
 * - Only rendered when draft mode is enabled (see below)
 */
import { VisualEditing } from "next-sanity/visual-editing";

/**
 * draftMode from next/headers:
 * - Check if draft mode is currently enabled
 * - Draft mode is stored as an HTTP-only cookie
 * - When enabled, Sanity fetches draft content instead of published
 */
import { draftMode } from "next/headers";
import { Suspense } from "react";

/**
 * SanityLive:
 * - Custom component that sets up real-time content updates
 * - Uses Sanity's Live Content API
 * - When content changes in Sanity, page updates automatically
 */
import { SanityLive } from "@/sanity/lib/live";
import { getProfile } from "@/lib/graphql/queries";
import { GSAPProvider } from "@/components/animation/GSAPProvider";
import { PostHogPageTracker } from "@/components/providers/PostHogProvider";

/**
 * Font Configuration — Late Night Session typography
 * ---------------------------------------------------
 * Three fonts, three roles:
 *
 * Space Mono  → display  Brand identity, hero headings, section titles.
 *               Retro-future monospace. Signals "engineer who also designs."
 *
 * DM Sans     → body     Body copy, UI labels, nav, prose.
 *               Clean geometric sans — nearest open-source match to Satoshi.
 *               (Satoshi is Fontshare-only; not on npm/@fontsource.)
 *
 * Fira Code   → code     Code editor, inline <code>, terminal output.
 *               Ligature-rich monospace designed specifically for code.
 *
 * Each `variable` creates a CSS custom property consumed by globals.css:
 *   --font-space-mono, --font-dm-sans, --font-fira-code
 * globals.css @theme inline maps those → --font-display/body/code
 */
const spaceMono = Space_Mono({
  variable: "--font-space-mono",  // display role: headings, hero
  weight: ["400", "700"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",     // body role: UI, prose
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",   // code role: editor, mono UI
  subsets: ["latin"],
});

/**
 * Metadata Export:
 * - Defines default meta tags for SEO
 * - Can be overridden by child pages using their own metadata export
 * - Next.js generates <head> content from this
 *
 * COMPREHENSIVE SEO STRATEGY:
 * - Title template for consistent branding across pages
 * - Rich keywords covering all skills and target roles
 * - OpenGraph for social sharing (LinkedIn, Twitter)
 * - Structured data hints for search engines
 */
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  const name = profile?.name ?? "Alvin Quach";
  const headline = profile?.headline ?? "Full Stack Developer";
  const description =
    profile?.seoDescription ??
    `${headline} building production systems with Next.js, TypeScript, and PostgreSQL.`;
  const keywords = profile?.seoKeywords ?? [
    name,
    "Full Stack Developer",
    "Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
  ];

  return {
    metadataBase: new URL("https://alvinquach.dev"),
    title: {
      default: `${name} | ${headline} | Next.js & TypeScript`,
      template: `%s | ${name}`,
    },
    description,
    keywords,
    authors: [{ name, url: profile?.github ?? "https://github.com/alvinwquach" }],
    creator: name,
    publisher: name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://alvinquach.dev",
      siteName: `${name} | ${headline}`,
      title: `${name} | ${headline} | React, Next.js, TypeScript`,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${name} - ${headline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${headline}`,
      description,
      images: ["/og-image.png"],
      creator: "@alvinwquach",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "https://alvinquach.dev",
    },
    category: "technology",
  };
}


/**
 * RootLayout Component
 * --------------------
 *
 * ASYNC COMPONENT:
 * - This is an async Server Component
 * - Can await things directly (like draftMode())
 * - In Next.js 15+, draftMode() is async
 *
 * CHILDREN PROP:
 * - All page content is passed as children
 * - This layout wraps: pages, other layouts, loading/error states
 *
 * READONLY TYPE:
 * - Readonly<{ children: React.ReactNode }> makes props immutable
 * - Good TypeScript practice for component props
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  const name = profile?.name ?? "Alvin Quach";
  const headline = profile?.headline ?? "Full Stack Developer";
  const country = profile?.country ?? "US";
  const sameAs = [profile?.github, profile?.linkedin].filter(Boolean);

  const worksForName = profile?.availabilityLabel;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: "https://alvinquach.dev",
    image: profile?.image?.url,
    sameAs,
    jobTitle: headline,
    worksFor: worksForName
      ? { "@type": "Organization", name: worksForName }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile?.location,
      addressCountry: country,
    },
    email: profile?.email,
    description: profile?.seoDescription,
    seeks: {
      "@type": "JobPosting",
      title: headline,
      description: profile?.openToRoles?.length
        ? `Seeking ${profile.openToRoles.join(", ")} roles`
        : undefined,
      employmentType: profile?.employmentTypes,
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: profile?.location,
          addressCountry: country,
        },
      },
    },
  };

  return (
    /**
     * HTML Element:
     * - lang="en" is required for accessibility
     * - Screen readers and search engines use this
     */
    <html lang="en">
      {/**
       * Head Element:
       * - JSON-LD structured data for rich search results
       * - Injected as a script tag for search engines to parse
       */}
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1D428A" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/**
       * Body Element:
       * - Font CSS variables applied here
       * - Both fonts available throughout app via CSS variables
       * - antialiased: Tailwind class for smoother font rendering
       *
       * Template literal (`${var}`) combines multiple class names
       */}
      <body
        className={`${spaceMono.variable} ${dmSans.variable} ${firaCode.variable} antialiased`}
      >
        {/* Page content from child routes */}
        <GSAPProvider>{children}</GSAPProvider>
        <Suspense fallback={null}>
          <PostHogPageTracker />
        </Suspense>

        {/**
         * SanityLive Component:
         * - Sets up real-time content subscriptions
         * - Content updates appear without page refresh
         * - Uses Sanity's Live Content API
         * - Only enabled in development or draft mode to avoid CORS issues in production
         */}
        {(process.env.NODE_ENV === 'development' || (await draftMode()).isEnabled) && <SanityLive />}

        {/**
         * Conditional Visual Editing:
         * - Only renders VisualEditing when draft mode is enabled
         * - (await draftMode()) returns { isEnabled: boolean }
         * - && is short-circuit: if left side is false, right side not evaluated
         *
         * PATTERN: condition && <Component />
         * - If condition is true, render Component
         * - If condition is false, render nothing
         *
         * WHY AWAIT HERE?
         * - draftMode() is async in Next.js 15+
         * - We're in an async component, so we can await
         */}
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
