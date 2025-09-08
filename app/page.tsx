import BlogCard from "./components/blog/BlogCard";
import ProjectCard from "./components/project/ProjectCard";
import AboutMe from "./components/profile/AboutMe";
import SkillsCarousel from "./components/profile/SkillsCarousel";
import Section from "./components/common/Section";
import { Blog, Project, Profile } from "./types/types";
import {
  GET_FEATURED_BLOG,
  GET_BLOGS,
  GET_PROJECTS,
  GET_PROFILE,
} from "./lib/queries";
import { fetchSanity } from "@/sanity/lib/fetchSanity";

export default async function Home() {
  const [featuredBlog, blogs, projects, profile] = await Promise.all([
    fetchSanity<Blog | null>(GET_FEATURED_BLOG),
    fetchSanity<Blog[]>(GET_BLOGS),
    fetchSanity<Project[]>(GET_PROJECTS),
    fetchSanity<Profile | null>(GET_PROFILE),
  ]);

  const filteredBlogs = blogs.filter((b) => b._id !== featuredBlog?._id);

  const bio = profile?.bio
    ? Array.isArray(profile.bio)
      ? profile.bio
      : [
          {
            _type: "block",
            style: "normal",
            children: [{ _type: "span", text: profile.bio }],
          },
        ]
    : [];

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans overflow-x-hidden">
      <main className="space-y-24">
        {profile && (
          <Section id="about" bg={Section.Colors.Dark}>
            <AboutMe
              name={profile.name || ""}
              profileImageUrl={profile.profileImage?.asset?.url || ""}
              bio={bio}
            />
          </Section>
        )}
        {profile?.skills && (
          <Section id="skills" bg={Section.Colors.Light}>
            <SkillsCarousel skills={profile.skills} />
          </Section>
        )}
        <Section id="projects" bg={Section.Colors.Dark} className="space-y-8">
          <h2 className="text-4xl font-bold text-green-400 mb-10 text-center">
            Projects
          </h2>
          <div className="space-y-12">
            {projects?.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        </Section>
        <Section id="blogs" bg={Section.Colors.Light} className="space-y-8">
          <h2 className="text-4xl font-bold text-green-400 mb-10 text-center">
            Blogs
          </h2>
          {featuredBlog && <BlogCard blog={featuredBlog} isFeatured={true} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {filteredBlogs?.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
