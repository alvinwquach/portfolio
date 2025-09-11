import Image from "next/image";
import { Project } from "../../types/types";
import { Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`project-card bg-slate-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300 p-6 flex flex-col md:flex-row ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } items-start gap-6`}
    >
      <div className="w-full md:w-1/2">
        <Image
          src={project.mainImage?.asset?.url || "/placeholder.jpg"}
          alt={`Main image for ${project.title}`}
          width={600}
          height={400}
          className="rounded-md object-cover w-full h-64 md:h-80"
        />
      </div>
      <div className="flex-1 w-full md:w-1/2">
        <h3 className="text-3xl font-bold text-blue-400 mb-4">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-slate-200 text-base mb-6 leading-relaxed">
            {project.description}
          </p>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="bg-blue-700/90 text-white text-xs px-3 py-1 rounded-full tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.title}`}
              className="flex items-center gap-2 text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded transition"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live site for ${project.title}`}
              className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Live</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
