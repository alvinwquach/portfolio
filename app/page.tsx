"use client";

import { useSuspenseQuery } from "@apollo/client";
import Projects from "./components/landing/Projects";
import { aboutQuery, projectsQuery } from "@/graphql/queries";
import { About } from "@/types/About";
import { Project } from "@/types/Project";
import { PortableText } from "@portabletext/react";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import Typewriter from "typewriter-effect";

const projectOrder: { [key: string]: number } = {
  "Bring The Shreds": 1,
  "Notify Med": 2,
  "Hands on Physiotherapy and Rehab Centre": 3,
  "Shift's Closet": 4,
};

interface AboutQueryResult {
  allAbout: About[];
}

interface ProjectsQueryResult {
  allProjects: Project[];
}

export default function Home() {
  const { data: aboutData } = useSuspenseQuery<AboutQueryResult>(aboutQuery);
  const { data: projectData } =
    useSuspenseQuery<ProjectsQueryResult>(projectsQuery);

  const projects = projectData.allProjects;

  const sortedProjects = projects.slice().sort((a: Project, b: Project) => {
    const orderA = projectOrder[a.name] || Infinity;
    const orderB = projectOrder[b.name] || Infinity;
    return orderA - orderB;
  });
  const about = aboutData.allAbout[0];

  return (
    <main>
      <section className=" max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24">
        <h1 className="text-5xl font-bold tracking-tight  sm:text-5xl text-center">
          Hey, I'm Alvin{" "}
          <span role="img" aria-label="Waving hand emoji">
            👋
          </span>
        </h1>
        <div className="mt-3 text-3xl font-medium tracking-tight sm:text-2xl">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .pauseFor(1000)
                .typeString("Full Stack Engineer")
                .start();
            }}
            options={{
              autoStart: true,
              loop: false,
              delay: 75,
            }}
          />
        </div>
        <div className="text-left text-xl my-5">
          <PortableText value={about.storyRaw} />
        </div>

        {sortedProjects.map((project: Project, key: number) => (
          <Projects project={project} odd={key % 2} key={project.name} />
        ))}
        <ul
          className="flex items-center justify-end space-x-4 mt-8"
          aria-label="Social media"
        >
          <li className="text-xs shrink-0">
            {about.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub"
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-6 w-6" />
              </a>
            )}
          </li>
          <li className="text-xs shrink-0">
            {about.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn (opens in a new tab)"
                title="LinkedIn"
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
            )}
          </li>

          <li className="text-xs shrink-0">
            {about.email && (
              <a
                href={`mailto:${about.email}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email (opens in a new tab)"
                title="Email"
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <span className="sr-only">Email</span>
                <FaEnvelope className="h-6 w-6" />
              </a>
            )}
          </li>
          <li className="text-xs shrink-0">
            <a
              href="/resume/alvin-quach-resume-fullstack.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume (Opens in a new tab)"
              title="Download Resume"
              download
              className="text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <span className="sr-only">Download Resume</span>
              <FaFileDownload className="h-6 w-6" />
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}