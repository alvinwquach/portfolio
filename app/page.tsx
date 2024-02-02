"use client";

import { useQuery } from "@apollo/client";
import { useState } from "react";

import { Project } from "@/types/Project";
import { GET_PROJECTS } from "@/graphql/queries";
import { bungee_outline } from "../utils/fonts";
import Projects from "./components/landing/Projects";
import Header from "./components/common/Header";
import BackToTopButton from "./components/ui/BackToTopButton";

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
  const [isEnvelopeIconClosed, setIsEnvelopeIconClosed] = useState(false);

  const handleMouseToggle = () => {
    setIsEnvelopeIconClosed((prev) => !prev);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { data: projectData } = useQuery<ProjectsQueryResult>(GET_PROJECTS);

  const projects = projectData?.allProjects;

  const sortedProjects = projects?.slice().sort((a: Project, b: Project) => {
    const orderA = projectOrder[a.name] || Infinity;
    const orderB = projectOrder[b.name] || Infinity;
    return orderA - orderB;
  });

  return (
    <main>
      <section className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 ">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <Header
            isEnvelopeIconClosed={isEnvelopeIconClosed}
            handleMouseToggle={handleMouseToggle}
            isMobile={isMobile}
          />
          <BackToTopButton />
          <section
            id="projects"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="Selected projects"
          >
            <div>
              <h3
                className={`${bungee_outline.className} mt-12 text-white animate-neon text-5xl font-bold text-center leading-1`}
              >
                PROJECTS
              </h3>
              <div>
                {sortedProjects?.map((project: Project) => (
                  <Projects key={project.name} project={project} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
