import { Metadata } from "next";
import { fetchSanity } from "@/sanity/lib/fetchSanity";
import { GET_BLOGS, GET_FEATURED_BLOG } from "@/app/lib/queries";
import { Blog } from "@/app/types/types";
import BlogList from "../components/blog/BlogList";
import FeaturedBlogCard from "../components/blog/FeaturedBlogCard";

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
  const [featuredBlog, blogs] = await Promise.all([
    fetchSanity<Blog | null>(GET_FEATURED_BLOG),
    fetchSanity<Blog[]>(GET_BLOGS),
  ]);

  const blogsArray = Array.isArray(blogs) ? blogs : [];

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {featuredBlog && (
          <section>
            <h2 className="text-4xl font-bold text-green-400 mb-6">
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
