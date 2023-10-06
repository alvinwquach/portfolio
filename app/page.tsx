"use client";

import { useSuspenseQuery } from "@apollo/client";
import Image from "next/image";
import ProjectListItem from "./components/landing/ProjectListItem";
import { aboutQuery, projectsQuery } from "@/graphql/queries";
import { About } from "@/types/About";
import { Project } from "@/types/Project";
import { PortableText } from "@portabletext/react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

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
      <section className="mx-auto max-w-[100rem] text-white py-16 text-center">
        <div className="container mx-auto">
          <Image
            src={about.image.asset.url}
            alt="Image of Alvin"
            width={200}
            height={200}
            className="rounded-full mx-auto my-4 border border-white p-2"
          />

          <div className="mx-auto flex items-center justify-center mb-5">
            {about.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open link to Alvin Quach's LinkedIn"
              >
                <FaLinkedin size={30} className="mx-2 hover:scale-110" />
              </a>
            )}
            {about.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open link to Alvin Quach's Github"
              >
                <FaGithub size={30} className="mx-2 hover:scale-110" />
              </a>
            )}
            {about.email && (
              <a
                href={`mailto:${about.email}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email Alvin Quach"
              >
                <FaEnvelope size={30} className="mx-2 hover:scale-110" />
              </a>
            )}
          </div>
          <div className="text-lg">
            <PortableText value={about.storyRaw} />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[100rem] rounded-md border">
        {sortedProjects.map((project: Project, key: number) => (
          <ProjectListItem project={project} odd={key % 2} key={project.name} />
        ))}
      </div>
    </main>
  );
}