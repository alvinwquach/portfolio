import React from "react";
import Image from "next/image";
import TextBox from "./TextBox";
import { Project } from "@/types/Project";

interface ProjectListItemProps {
  project: Project;
  odd: number;
}

function ProjectListItem({ project, odd }: ProjectListItemProps) {
  return (
    <div
      className={`flex flex-col gap-x-5 p-2 transition xl:flex-row ${
        odd && "border-b border-t xl:flex-row-reverse"
      }`}
    >
      <div className="w-full xl:w-9/12">
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
      <div className="flex xl:w-1/4">
        <TextBox project={project} />
      </div>
    </div>
  );
}

export default ProjectListItem;
