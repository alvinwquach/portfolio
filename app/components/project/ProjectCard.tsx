import Image from "next/image";
import { Project } from "../../types/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`project-card bg-[#1e293b] hover:bg-[#273449] rounded-xl overflow-hidden shadow-lg transition-all duration-300 p-6 flex flex-col md:flex-row ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-6`}
    >
      <div className="w-full md:w-1/2">
        <Image
          src={
            project?.mainImage?.asset.url ?? `Main image for ${project.title}`
          }
          alt={project.title}
          width={500}
          height={300}
          className="rounded-md object-cover w-full h-64 md:h-80"
        />
      </div>
      <div className="flex-1 w-full md:w-1/2">
        <h3 className="text-2xl font-bold text-green-400 mb-4">
          {project.title}
        </h3>
        <p className="text-slate-300 text-base">{project?.description}</p>
      </div>
    </div>
  );
}
