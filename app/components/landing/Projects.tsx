import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

import { Project } from "@/types/Project";
import { montserrat } from "../../../utils/fonts";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="mt-5 p-6 bg-slate-800/50 hover:bg-slate-800/90">
      <ul>
        <li className="mb-12 text-white">
          <div className="relative grid gap-4 pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4">
            <div className="sm:col-span-8">
              <Image
                src={project.wideScreenView?.asset?.url}
                alt={`Desktop image for ${project.name}`}
                loading="lazy"
                width={200}
                height={48}
                className="w-full rounded sm:translate-y-1"
              />
            </div>

            <div className="sm:col-span-8 mt-4 sm:mt-0">
              <h3
                className={`${montserrat.className} text-3xl font-bold tracking-tight text-slate-200 sm:text-4xl"`}
              >
                {project.name}
              </h3>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open link to ${project.name} website`}
                  className="inline-flex items-center font-medium text-lg text-teal-300 underline hover:no-underline"
                >
                  {project.url}
                  <FaExternalLinkAlt className="w-3 h-3 ms-2.5" />
                </a>
              )}

              <p
                className={`${montserrat.className} mt-2 text-base leading-normal`}
              >
                <PortableText value={project.descriptionRaw} />
              </p>
              <ul className="mt-2 flex flex-wrap">
                {project.tags?.map((tag, index) => (
                  <li
                    key={index}
                    className={`${montserrat.className} mr-1.5 mt-2 flex items-center bg-teal-400/10 px-2.5 py-0.5 text-sm font-medium leading-5 text-teal-300`}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              {project.repository && (
                <div className="hover:cursor-pointer">
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open link to ${project.name} Github repository`}
                    className="inline-flex mr-1.5 mt-2 items-center rounded-lg bg-sky-400/10 px-3 py-1 text-base font-medium leading-5 text-sky-300  hover:bg-sky-500/20"
                  >
                    View repository
                    <FiExternalLink className="block ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

interface ProjectsProps {
  project: Project;
}

function Projects({ project }: ProjectsProps) {
  return <ProjectCard project={project} />;
}

export default Projects;
