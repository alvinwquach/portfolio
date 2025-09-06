import { getClient } from "./lib/client";
import { GET_BLOGS, GET_PROJECTS, GET_FEATURED_BLOG } from "./lib/queries";
import BlogCard from "./components/blog/BlogCard";
import ProjectCard from "./components/project/ProjectCard";
import { Blog, Project } from "./types/types";
import Link from "next/link";
import { User } from "lucide-react";

export default async function Home() {
  const client = getClient();
  const [featuredResult, blogsResult, projectsResult] = await Promise.all([
    client.query<{ allBlog: Blog[] }>({ query: GET_FEATURED_BLOG }),
    client.query<{ allBlog: Blog[] }>({ query: GET_BLOGS }),
    client.query<{ allProject: Project[] }>({ query: GET_PROJECTS }),
  ]);

  const featuredBlog = featuredResult?.data?.allBlog?.[0];

  const blogs = blogsResult?.data?.allBlog.filter(
    (b) => b._id !== featuredBlog?._id
  );

  const projects = projectsResult?.data?.allProject;

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans overflow-x-hidden">
      <header className="bg-[#0f172a]/90 sticky top-0 z-50 backdrop-blur-sm border-b border-green-700/50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-green-400" />
            <span className="text-lg font-semibold text-green-400">
              alvinquach
            </span>
          </div>
          <nav className="flex gap-8 text-green-400 font-semibold">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="#projects" className="hover:underline">
              Projects
            </Link>
            <Link href="/blogs" className="hover:underline">
              Blogs
            </Link>
          </nav>
        </div>
        <h1 className="text-center mt-4 text-3xl font-bold text-green-400">
          Full Stack Engineer
        </h1>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        <section id="projects" className="space-y-8">
          <h2 className="text-4xl font-bold text-green-400 mb-10">Projects</h2>
          <div className="space-y-12">
            {projects?.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        </section>
        <section id="blogs" className="space-y-8">
          <h2 className="text-4xl font-bold text-green-400 mb-10">Blogs</h2>
          {featuredBlog && <BlogCard blog={featuredBlog} isFeatured={true} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {blogs?.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
