import Image from "next/image";
import Link from "next/link";
import { Blog } from "../../types/types";
import Marquee from "../ui/Marquee/Marquee";

interface BlogCardProps {
  blog: Blog;
  isFeatured?: boolean;
}

export default function BlogCard({ blog, isFeatured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${blog._id}`}
      className="relative block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors overflow-hidden"
      style={{ minHeight: "320px" }}
    >
      {isFeatured && (
        <div className="absolute top-0 left-0 w-full z-10">
          <Marquee
            className="bg-green-500 text-white py-1 px-4 text-lg font-bold"
            pauseOnHover={true}
            speed={50}
          >
            Featured
          </Marquee>
        </div>
      )}
      {blog.mainImage?.asset?.url && (
        <div
          className={`relative h-48 mb-4 rounded-lg overflow-hidden ${
            isFeatured ? "mt-6" : ""
          }`}
        >
          <Image
            src={blog.mainImage.asset.url ?? `Main image for ${blog.title}`}
            alt={blog.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold text-green-400 mb-2">
        {blog.title}
      </h3>
      <p className="text-slate-300 line-clamp-3">{blog.excerpt}</p>
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-slate-700 text-green-400 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
