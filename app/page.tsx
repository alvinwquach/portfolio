"use client";

import { useQuery } from "@apollo/client";
import { useTrail, animated } from "@react-spring/web";
import { useState, useEffect } from "react";
import { About } from "@/types/About";
import { Project } from "@/types/Project";
import { aboutQuery, projectsQuery } from "@/graphql/queries";
import { PortableText } from "@portabletext/react";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import Projects from "./components/landing/Projects";
import BackToTopButton from "./components/ui/BackToTopButton";

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
  const { data: aboutData } = useQuery<AboutQueryResult>(aboutQuery);
  const { data: projectData } = useQuery<ProjectsQueryResult>(projectsQuery);

  const projects = projectData?.allProjects;

  const sortedProjects = projects?.slice().sort((a: Project, b: Project) => {
    const orderA = projectOrder[a.name] || Infinity;
    const orderB = projectOrder[b.name] || Infinity;
    return orderA - orderB;
  });
  const about = aboutData?.allAbout[0];
  const trail = useTrail(1, {
    opacity: 1,
    from: { opacity: 0 },
  });

  return (
    <main>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24">
        <div className="flex justify-between mt-5">
          <h1 className="text-3xl">alvinquach</h1>
        </div>
        <div className="flex justify-betweem mx-0 mb-2 w-full flex-row items-center md:flex">
          <div className="flex flex-row flex-wrap gap-y-2 justify-center gap-x-1.5 text-slate-800">
            {about?.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub"
                className="focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
              >
                <span className="sr-only">GitHub</span>
                <FaGithub className="block h-6 w-6" />
              </a>
            )}
            {about?.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub"
                className="focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
              >
                <span className="sr-only">GitHub</span>
                <FaLinkedin className="block h-6 w-6" />
              </a>
            )}
            {about?.email && (
              <a
                href={about.email}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub"
                className="focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
              >
                <span className="sr-only">Email</span>
                <FaEnvelope className="block h-6 w-6" />
              </a>
            )}
          </div>
          <div className="mb-0 ml-auto flex flex-row items-center justify-center gap-x-3">
            <a
              href="/resume/alvin-quach-resume-fullstack.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume (Opens in a new tab)"
              title="Download Resume"
              download
              className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Resume <FaFileDownload className="ml-2" />
            </a>
          </div>
        </div>

        {trail.map((props, index) => (
          <animated.p key={index} style={props} className="text-2xl">
            I create experiences for the web.
          </animated.p>
        ))}
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 text-left text-xl my-5">
            <PortableText value={about?.storyRaw || []} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center">
          Some Things I've Created
        </h2>

        {sortedProjects?.map((project: Project, key: number) => (
          <Projects project={project} odd={key % 2} key={project.name} />
        ))}

        <BackToTopButton />
      </section>
    </main>
  );
}