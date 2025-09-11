import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { fetchSanity } from "@/sanity/lib/fetchSanity";
import { GET_BLOG_BY_SLUG } from "@/app/lib/queries";
import { Blog } from "@/app/types/types";
import MuxVideoPlayer from "@/app/components/blog/MuxVideoPlayer";

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
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:underline"
      >
        {children}
      </a>
    ),
  },
};

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const blog = await fetchSanity<Blog | null>(GET_BLOG_BY_SLUG(slug));

  if (!blog) return notFound();

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
        <h1 className="text-4xl font-bold text-green-400 mb-6">{blog.title}</h1>
        {blog.mainImage?.asset?.url && (
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
        {blog.video?.asset?.playbackId && (
          <MuxVideoPlayer playbackId={blog.video.asset.playbackId} />
        )}
        <div className="prose prose-invert prose-lg max-w-none">
          <PortableText
            value={blog.content}
            components={portableTextComponents}
          />
        </div>
      </div>
    </main>
  );
}
