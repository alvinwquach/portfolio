"use client";

import { useState } from "react";
import { Blog } from "@/app/types/types";
import BlogCard from "./BlogCard";

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags || [])));

  const filteredBlogs = selectedTag
    ? blogs.filter((b) => b.tags?.includes(selectedTag))
    : blogs;

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold text-blue-400 mb-6">All Blogs</h2>
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm ${
              !selectedTag
                ? "bg-blue-500 text-white shadow-blue-700/50"
                : "bg-slate-700 text-blue-300 hover:bg-slate-600"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm ${
                selectedTag === tag
                  ? "bg-blue-500 text-white shadow-blue-700/50"
                  : "bg-slate-700 text-blue-300 hover:bg-slate-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              isFeatured={blog.featured || false}
            />
          ))}
        </div>
      ) : (
        <p className="text-slate-400">No blogs match this filter.</p>
      )}
    </section>
  );
}
