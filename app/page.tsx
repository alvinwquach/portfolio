"use client";

import { useQuery } from "@apollo/client";
import { About } from "@/types/About";
import { Project } from "@/types/Project";
import { aboutQuery, projectsQuery } from "@/graphql/queries";
import { PortableText } from "@portabletext/react";
import Typewriter from "typewriter-effect";
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

  return (
    <main>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-center sm:text-5xl">
          Alvin Quach
        </h1>

        <ul
          className="flex justify-center space-x-1 mt-5"
          aria-label="Social media"
        >
          <li>
            {about?.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub"
                className="hover:scale-110 text-blue-600 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md"
              >
                <span className="sr-only">GitHub</span>
                <FaGithub className="block h-6 w-6" />
              </a>
            )}
          </li>
          <li>
            {about?.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn (opens in a new tab)"
                title="LinkedIn"
                className="hover:scale-110 text-blue-600 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md"
              >
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="block h-6 w-6" />
              </a>
            )}
          </li>
          <li>
            {about?.email && (
              <a
                href={`mailto:${about.email}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email (opens in a new tab)"
                title="Email"
                className="hover:scale-110 text-blue-600 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md"
              >
                <span className="sr-only">Email</span>
                <FaEnvelope className="block h-6 w-6" />
              </a>
            )}
          </li>
        </ul>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 my-3 text-2xl text-center font-medium tracking-tight sm:text-2xl">
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
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1000)
                  .typeString("Sneaker Connoisseur")
                  .start();
              }}
              options={{
                autoStart: true,
                loop: false,
                delay: 75,
              }}
            />
            <Typewriter
              onInit={(typewriter) => {
                typewriter.pauseFor(1000).typeString("Foodie").start();
              }}
              options={{
                autoStart: true,
                loop: false,
                delay: 75,
              }}
            />
          </div>
          <div className="lg:w-1/2 text-left text-xl my-5">
            <PortableText value={about?.storyRaw || []} />
          </div>
        </div>
        <div className="flex justify-between">
          <h2 className="text-left text-3xl font-bold uppercase tracking-wider ">
            Portfolio
          </h2>
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

        {sortedProjects?.map((project: Project, key: number) => (
          <Projects project={project} odd={key % 2} key={project.name} />
        ))}
        <BackToTopButton />
      </section>
    </main>
  );
}