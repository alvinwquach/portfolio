import React from "react";
import { PortableText } from "@portabletext/react";
import { Project } from "@/types/Project";

interface TextBoxProps {
  project: Project;
}

function TextBox({ project }: TextBoxProps) {
  return (
    <div className="relative mt-2 flex w-full flex-col justify-between p-3 xl:mt-0">
      <div>
        <div className="mb-2 text-2xl font-extrabold tracking-tight md:text-3xl">
          {project.name}
        </div>
        <div className="font-serif text-gray-500">
          <div className="text-xl leading-8">
            <PortableText value={project.descriptionRaw} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-4">
            {project.tags?.map((tag, key) => (
              <div
                key={key}
                className="text-sm font-medium md:text-lg bg-gray-200 rounded-md p-2 text-black"
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="space-x-4  mt-2 flex md:flex-row">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open link to ${project.name} website`}
                className="inline-block px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
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
                className="inline-block px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
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

export default TextBox;
