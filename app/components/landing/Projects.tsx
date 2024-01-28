import React from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Project } from "@/types/Project";

interface ProjectsProps {
  project: Project;
  odd: number;
}

function Projects({ project, odd }: ProjectsProps) {
  return (
    <div
      className={`flex flex-col gap-x-5 p-2 transition xl:flex-row  ${
        odd && "xl:flex-row-reverse "
      }`}
    >
      <div className="w-full xl:w-1/2">
        <div className="relative aspect-[16/9]">
          <Image
            src={project.wideScreenView.asset.url}
            alt={`Cover image for ${project.name}`}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            blurDataURL={project.wideScreenView.asset.url}
            placeholder="blur"
            priority
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
      <div className="flex xl:w-1/2 flex-col">
        <div className="relative mt-2 flex w-full flex-col justify-between p-3 xl:mt-0 flex-grow">
          <div className="font-serif">
            <div className="mb-2 text-xl font-extrabold tracking-tight md:text-3xl">
              {project.name}
            </div>
            <div className="text-xl ">
              <PortableText value={project.descriptionRaw} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-4">
              {project.tags?.map((tag, key) => (
                <div
                  key={key}
                  className="text-sm font-medium md:text-lg bg-gray-200 rounded-md px-1 py-1.5 text-black"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="space-x-4 mt-2 flex md:flex-row">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open link to ${project.name} website`}
                className="inline-block px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 hover:border border-gray-400 transition duration-300 ease-in-out"
              >
                Website
              </a>
            )}
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open link to ${project.name} Github repository`}
                className="inline-block px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 hover:border border-gray-400 transition duration-300 ease-in-out"
              >
                Repository
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
