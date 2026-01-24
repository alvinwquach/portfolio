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
 * variable: Creates a CSS custom property (--font-geist-sans)
 * subsets: Which character sets to include (reduces file size)
 */
import { Geist, Geist_Mono } from "next/font/google";

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

/**
 * SanityLive:
 * - Custom component that sets up real-time content updates
 * - Uses Sanity's Live Content API
 * - When content changes in Sanity, page updates automatically
 */
import { SanityLive } from "@/sanity/lib/live";

/**
 * Font Configuration:
 * - Geist: Sans-serif font for body text
 * - Geist_Mono: Monospace font for code
 *
 * variable property creates CSS custom property:
 * - --font-geist-sans can be used in CSS/Tailwind
 * - Tailwind config can reference these: fontFamily: { sans: ['var(--font-geist-sans)'] }
 */
const geistSans = Geist({
  variable: "--font-geist-sans",  // CSS variable name
  subsets: ["latin"],             // Only include latin characters
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
export const metadata: Metadata = {
  // Base URL for canonical links and OpenGraph
  metadataBase: new URL("https://alvinquach.dev"),

  // Title configuration - template applies to all pages
  title: {
    default: "Alvin Quach | Full Stack Developer | React, Next.js, TypeScript",
    template: "%s | Alvin Quach",
  },

  // Primary description - appears in search results
  description:
    "Full Stack Developer in San Francisco specializing in React, Next.js, TypeScript, and PostgreSQL. Building performant web applications with modern tech stacks. Open to Full Stack Developer, Software Engineer, Web Developer, UX Engineer, and DevOps roles.",

  // Extensive keywords for search discovery
  keywords: [
    // Name variations
    "Alvin Quach",
    "Alvin W Quach",
    "alvinwquach",

    // Primary roles
    "Full Stack Developer",
    "Full Stack Engineer",
    "Software Engineer",
    "Web Developer",
    "Web Engineer",
    "Frontend Developer",
    "Backend Developer",
    "UX Engineer",
    "UI Engineer",

    // Secondary roles
    "DevOps Engineer",
    "Data Engineer",
    "Data Analyst",
    "Developer Advocate",
    "Community Manager",
    "Product Manager",
    "Program Manager",

    // Location
    "San Francisco",
    "Bay Area",
    "California",
    "SF Developer",
    "Bay Area Engineer",

    // Frontend skills
    "React",
    "React.js",
    "Next.js",
    "Next.js 15",
    "TypeScript",
    "JavaScript",
    "TailwindCSS",
    "Tailwind CSS",
    "CSS",
    "HTML",
    "Zustand",
    "React Query",
    "Material UI",
    "Gatsby",
    "D3.js",
    "Three.js",
    "Mapbox",
    "CodeMirror",

    // Backend skills
    "Node.js",
    "Express.js",
    "FastAPI",
    "Python",
    "GraphQL",
    "REST API",
    "WebSockets",
    "Drizzle ORM",
    "Docker",

    // Database skills
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "SQLite",
    "Firebase",
    "pgvector",
    "Vector Database",
    "Database Design",

    // AI/ML skills
    "OpenAI",
    "AI Integration",
    "LLM",
    "RAG",
    "Machine Learning",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "XGBoost",
    "Jupyter Notebooks",

    // Testing
    "Jest",
    "Cypress",
    "Playwright",
    "Testing",
    "E2E Testing",
    "Unit Testing",

    // DevOps & Tools
    "Git",
    "GitHub",
    "CI/CD",
    "Vercel",
    "Docker",
    "Sentry",
    "Amplitude",

    // CMS & Content
    "Sanity",
    "Headless CMS",
    "Content Management",

    // Payments & APIs
    "Stripe",
    "Payment Integration",
    "OAuth",
    "API Integration",

    // Soft skills
    "Technical Writing",
    "Documentation",
    "Developer Relations",
    "Public Speaking",
    "Community Management",
    "User Research",
    "A/B Testing",

    // Project types
    "Web Applications",
    "SaaS",
    "E-commerce",
    "Data Visualization",
    "Real-time Applications",
    "Performance Optimization",

    // Career keywords
    "Hire Developer",
    "Hire Engineer",
    "Available for Work",
    "Portfolio",
    "Stanford",
  ],

  // Author information
  authors: [{ name: "Alvin Quach", url: "https://github.com/alvinwquach" }],
  creator: "Alvin Quach",
  publisher: "Alvin Quach",

  // OpenGraph for social sharing (LinkedIn, Facebook)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alvinquach.dev",
    siteName: "Alvin Quach | Full Stack Developer",
    title: "Alvin Quach | Full Stack Developer | React, Next.js, TypeScript",
    description:
      "Full Stack Developer in San Francisco building performant web applications with React, Next.js, TypeScript, and PostgreSQL. Experienced in AI integration, real-time features, and data visualization. Open to developer and engineering roles.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alvin Quach - Full Stack Developer",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Alvin Quach | Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, TypeScript, and PostgreSQL. Building performant web applications in San Francisco.",
    images: ["/og-image.png"],
    creator: "@alvinwquach",
  },

  // Robots directives
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

  // Verification for search consoles (add your IDs when you have them)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // Alternate languages (if you add translations later)
  alternates: {
    canonical: "https://alvinquach.dev",
  },

  // Category for better classification
  category: "technology",
};

/**
 * JSON-LD Structured Data
 * =======================
 * Rich snippets for Google search results.
 * This helps search engines understand who you are and what you do.
 * Can result in enhanced search listings with additional info.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alvin Quach",
  url: "https://alvinquach.dev",
  image: "https://alvinquach.dev/profile-photo.jpg",
  sameAs: [
    "https://github.com/alvinwquach",
    "https://www.linkedin.com/in/a-quach/",
  ],
  jobTitle: "Full Stack Developer",
  worksFor: {
    "@type": "Organization",
    name: "Available for Hire",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
  email: "alvinwquach@gmail.com",
  description:
    "Full Stack Developer specializing in React, Next.js, TypeScript, and PostgreSQL. Building performant web applications with modern tech stacks.",
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
    "REST APIs",
    "TailwindCSS",
    "Python",
    "FastAPI",
    "Docker",
    "Git",
    "OpenAI",
    "Machine Learning",
    "Data Visualization",
    "D3.js",
    "Sanity CMS",
    "Stripe",
    "WebSockets",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Full Stack Developer",
    occupationLocation: {
      "@type": "City",
      name: "San Francisco",
    },
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Python",
      "GraphQL",
      "Docker",
    ],
  },
  seeks: {
    "@type": "JobPosting",
    title: "Full Stack Developer",
    description:
      "Seeking Full Stack Developer, Software Engineer, Web Developer, or UX Engineer roles",
    employmentType: ["FULL_TIME", "CONTRACT"],
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Francisco",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
  },
};

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Page content from child routes */}
        {children}

        {/**
         * SanityLive Component:
         * - Sets up real-time content subscriptions
         * - Content updates appear without page refresh
         * - Uses Sanity's Live Content API
         */}
        <SanityLive />

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
