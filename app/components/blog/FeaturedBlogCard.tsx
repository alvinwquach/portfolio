import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Blog } from "@/app/types/types";

interface FeaturedBlogCardProps {
  blog: Blog;
}

export default function FeaturedBlogCard({ blog }: FeaturedBlogCardProps) {
  return (
    <div className="flex flex-col md:flex-row bg-[#1e293b] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:bg-[#273449]">
      <div className="relative md:w-1/2 h-72 md:h-auto flex-shrink-0">
        {blog?.mainImage?.asset?.url && (
          <Image
            src={blog.mainImage.asset.url ?? `Main image for ${blog.title}`}
            alt={blog.title}
            fill
            className="object-cover md:rounded-l-2xl md:rounded-tr-none rounded-t-2xl"
          />
        )}
      </div>
      <div className="md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-4xl font-bold text-blue-400 mb-4">
            {blog.title}
          </h2>
          <p className="text-lg text-slate-300 mb-4">{blog.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-blue-700/40 text-blue-400 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={`/blog/${blog.slug.current}`}
          className="mt-6 inline-flex items-center font-semibold text-blue-400 text-lg hover:underline"
        >
          Read More <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
