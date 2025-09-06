import { getClient } from "@/app/lib/client";
import { GET_BLOG_BY_SLUG, GET_BLOGS } from "@/app/lib/queries";
import { Blog } from "@/app/types/types";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ PortableText component styling
const portableTextComponents: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-green-400 mt-8 mb-4">
        {children}
      </h3>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-green-400 pl-4 my-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded font-mono text-sm block whitespace-pre-wrap">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-green-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

// ✅ Static params for dynamic routing
export async function generateStaticParams() {
  const client = getClient();
  try {
    const result = await client.query<{
      allBlog: { slug: { current: string } }[];
    }>({
      query: GET_BLOGS,
    });

    // Ensure we return an array even if result.data.allBlog is undefined
    return (
      result?.data?.allBlog?.map((blog) => ({
        slug: blog.slug.current,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching slugs for generateStaticParams:", error);
    return [];
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;

  if (!rawSlug || typeof rawSlug !== "string") {
    console.error("Invalid or missing slug in params:", resolvedParams);
    notFound();
  }

  const slug = decodeURIComponent(rawSlug);
  const client = getClient();

  try {
    const result = await client.query<{ allBlog: Blog[] }>({
      query: GET_BLOG_BY_SLUG,
      variables: { slug },
    });

    const blog = result?.data?.allBlog[0];

    if (!blog) {
      console.error(`No blog found for slug: ${slug}`);
      notFound();
    }

    return (
      <main className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
        <div className="container max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-green-400 font-semibold hover:underline mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Home
          </Link>
          <h1 className="text-4xl font-bold text-green-400 mb-6">
            {blog.title}
          </h1>
          {blog?.mainImage?.asset?.url && (
            <div className="relative w-full h-[24rem] mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.mainImage.asset.url}
                alt={blog.title || "Blog image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}
          <div className="prose prose-invert prose-lg max-w-none">
            <PortableText
              value={blog.contentRaw}
              components={portableTextComponents}
            />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching blog from Sanity:", error);
    notFound();
  }
}
