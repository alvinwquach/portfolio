import React from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Project } from "@/types/Project";
import { FiExternalLink } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

interface ProjectsProps {
  project: Project;
  odd: number;
}

function Projects({ project, odd }: ProjectsProps) {
  return (
    <div
      className={`mt-5 p-6 bg-white border border-gray-200 rounded-lg shadow flex flex-col transition xl:flex-row   ${
        odd && "xl:flex-row-reverse "
      }`}
    >
      <div className="w-full xl:w-5/12 ">
        <div className="relative aspect-[16/9]">
          <Image
            src={project.wideScreenView.asset.url}
            alt={`Cover image for ${project.name}`}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            blurDataURL={project.wideScreenView.asset.url}
            placeholder="blur"
            priority
            className="rounded-lg"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
      <div className="flex xl:w-7/12 flex-col ">
        <div className="relative mt-2 flex w-full flex-col justify-between p-3 xl:mt-0 flex-grow">
          <div className="font-serif">
            <h3 className="text-gray-900  text-2xl font-extrabold mb-2">
              {project.name}
            </h3>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open link to ${project.name} website`}
                className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                {project.url}
                <FiExternalLink className="w-3 h-3 ms-2.5" />
              </a>
            )}

            <div className="flex flex-wrap gap-x-2 mt-2">
              {project.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded-md mb-2"
                >
                  {tag}
                </div>
              ))}
            </div>
            <div className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">
              <PortableText value={project.descriptionRaw} />
            </div>
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open link to ${project.name} Github repository`}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                View repository
                <FaArrowRight className="inline-block ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;