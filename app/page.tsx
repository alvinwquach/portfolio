"use client";

import { useQuery } from "@apollo/client";
import { Project } from "@/types/Project";
import { projectsQuery } from "@/graphql/queries";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import Projects from "./components/landing/Projects";
import BackToTopButton from "./components/ui/BackToTopButton";
import { rubik_bubbles, vampiro_one } from "../fonts";

const projectOrder: { [key: string]: number } = {
  "Bring The Shreds": 1,
  "Notify Med": 2,
  "Hands on Physiotherapy and Rehab Centre": 3,
  "Shift's Closet": 4,
};

interface ProjectsQueryResult {
  allProjects: Project[];
}

export default function Home() {
  const { data: projectData } = useQuery<ProjectsQueryResult>(projectsQuery);

  const projects = projectData?.allProjects;

  const sortedProjects = projects?.slice().sort((a: Project, b: Project) => {
    const orderA = projectOrder[a.name] || Infinity;
    const orderB = projectOrder[b.name] || Infinity;
    return orderA - orderB;
  });

  return (
    <main>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24">
        <div className="container mx-auto px-2 md:px-4 2xl:px-10">
          <div className="text-center sm:text-left">
            <h1
              className={`${rubik_bubbles.className} text-5xl text-white font-bold tracking-tight`}
            >
              <a href="/">alvin quach</a>
            </h1>
          </div>
          <div className="flex justify-center sm:justify-between mx-0 mb-2 w-full flex-row items-center md:flex">
            <div className="flex flex-row flex-wrap gap-y-2 justify-center gap-x-1.5 text-slate-800 sm:flex sm:justify-center">
              <ul
                className="flex justify-center space-x-1 mt-5"
                aria-label="Social media"
              >
                <li>
                  <a
                    href="https://github.com/alvinwquach"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub (opens in a new tab)"
                    title="GitHub"
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <span className="sr-only">GitHub</span>
                    <FaGithub className="block h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/a-quach/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn (opens in a new tab)"
                    title="LinkedIn"
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <FaLinkedin className="block h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto: alvinwquach@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Email (opens in a new tab)"
                    title="Email"
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <span className="sr-only">Email</span>
                    <FaEnvelope className="block h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a
                    href="/resume/alvin-quach-resume-fullstack.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Resume (Opens in a new tab)"
                    title="Download Resume"
                    download
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <FaFileDownload className="block h-6 w-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-xl my-5 text-white">
          I'm currently an engineer at Bring The Shreds. When I'm not coding,
          you can catch me trying out new restaurants or watching the Golden
          State Warriors. Go Dubs!
        </p>
        <h2
          className={`${vampiro_one.className} text-white animate-neon text-5xl font-bold text-center mb-0 mt-0 leading-1`}
        >
          PROJECTS
        </h2>

        {sortedProjects?.map((project: Project, key: number) => (
          <Projects project={project} odd={key % 2} key={project.name} />
        ))}
        <BackToTopButton />
      </section>
    </main>
  );
}