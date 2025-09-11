import { Metadata } from "next";
import { GET_BLOGS, GET_FEATURED_BLOG } from "@/app/lib/queries";
import { Blog } from "@/app/types/types";
import BlogList from "../components/blog/BlogList";
import FeaturedBlogCard from "../components/blog/FeaturedBlogCard";
import { getClient } from "../lib/client";

export const metadata: Metadata = {
  title: "Blogs - Alvin Quach | Full Stack Engineer",
  description:
    "Read the latest blogs by Alvin Quach, Full Stack Engineer, covering React, Next.js, TypeScript, GraphQL, and full-stack web development.",
  keywords: [
    "Alvin Quach",
    "Full Stack Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "GraphQL",
    "Blogs",
    "Web Development",
    "Frontend",
    "Backend",
  ],
  authors: [{ name: "Alvin Quach", url: "https://www.alvinquach.me" }],
  openGraph: {
    title: "Blogs - Alvin Quach | Full Stack Engineer",
    description:
      "Explore blogs by Alvin Quach, covering React, Next.js, TypeScript, GraphQL, and full-stack web development projects.",
    url: "https://www.alvinwquach.me/blogs",
    siteName: "Alvin Quach Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs - Alvin Quach | Full Stack Engineer",
    description:
      "Explore blogs by Alvin Quach on React, Next.js, TypeScript, GraphQL, and web development.",
    site: "@alvinquach",
    creator: "@alvinquach",
  },
};

export default async function BlogsPage() {
  const client = getClient();

  const [featuredResult, blogsResult] = await Promise.all([
    client.query<{ allBlog: Blog[] }>({ query: GET_FEATURED_BLOG }),
    client.query<{ allBlog: Blog[] }>({ query: GET_BLOGS }),
  ]);

  const featuredBlog = featuredResult?.data?.allBlog?.[0] || null;
  const blogsArray = blogsResult?.data?.allBlog || [];

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {featuredBlog && (
          <section>
            <h2 className="text-4xl font-bold text-blue-400 mb-6">
              Featured Blog
            </h2>
            <FeaturedBlogCard blog={featuredBlog} />
          </section>
        )}
        <BlogList blogs={blogsArray} />
      </main>
    </div>
  );
}
