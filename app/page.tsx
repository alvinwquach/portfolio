"use client";

import { useSuspenseQuery } from "@apollo/client";
import ProjectListItem from "./components/landing/ProjectListItem";
import AboutSection from "./components/landing/About";
import { aboutQuery, projectsQuery } from "@/graphql/queries";
import { About } from "@/types/About";
import { Project } from "@/types/Project";

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
      <AboutSection about={about} />
      <div className="mx-auto max-w-[100rem] rounded-md border">
        {sortedProjects.map((project: Project, key: number) => (
          <ProjectListItem project={project} odd={key % 2} key={project.name} />
        ))}
      </div>
    </main>
  );
}
