"use client";

import { useQuery } from "@apollo/client";
import { animated, useTrail, useSpring } from "@react-spring/web";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import { Project } from "@/types/Project";
import { GET_PROJECTS } from "@/graphql/queries";
import {
  bungee_outline,
  bungee_spice,
  montserrat,
  press_start_2p,
} from "../utils/fonts";
import Projects from "./components/landing/Projects";
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
  const { data: projectData } = useQuery<ProjectsQueryResult>(GET_PROJECTS);

  const projects = projectData?.allProjects;

  const sortedProjects = projects?.slice().sort((a: Project, b: Project) => {
    const orderA = projectOrder[a.name] || Infinity;
    const orderB = projectOrder[b.name] || Infinity;
    return orderA - orderB;
  });

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
    delay: 500,
  });

  const text = "Software Engineer";
  const config = { mass: 5, tension: 2000, friction: 200 };
  const trail = useTrail(text.length, {
    config,
    opacity: 1,
    x: 0,
    from: { opacity: 0, x: 20 },
    delay: 500,
  });

  return (
    <main>
      <section className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 ">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
            <div>
              <p className={`${montserrat.className} text-slate-200 text-2xl`}>
                Hi, my name is
              </p>
              <h1
                className={`${press_start_2p.className} text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl"`}
              >
                <a href="/">Alvin.</a>
              </h1>
              <animated.h2
                style={fadeIn}
                className={` ${bungee_outline.className} animate-neon mt-5 text-2xl text-white font-bold tracking-tight`}
              >
                {trail.map(({ x, opacity }, index) => (
                  <animated.span
                    key={index}
                    style={{
                      opacity,
                      transform: x.to((x) => `translate3d(${x}px,0,0)`),
                    }}
                  >
                    {text[index]}
                  </animated.span>
                ))}
              </animated.h2>
              <p
                className={`${montserrat.className} mt-4 max-w-xs leading-normal text-white `}
              >
                I&apos;m currently an engineer at Bring The Shreds. My focus is
                on crafting a seamless user experience. Collaborating with our
                team, I design interfaces, optimize performance, and ensure
                accessibility. At Bring The Shreds, we&apos;re committed to
                delivering an engaging platform that makes a difference in
                users&rsquo; lives.
              </p>
              <p
                className={`${montserrat.className} mt-4 max-w-xs leading-normal text-white `}
              >
                When I&apos;m not coding, you&apos;ll often find me exploring
                new eateries or watching the Golden State Warriors. Go Dubs!
              </p>
              <ul
                className="flex items-center ml-1 mt-8"
                aria-label="Social media"
              >
                <li className="mr-5 text-xs shrink-0">
                  <a
                    href="https://github.com/alvinwquach"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub (opens in a new tab)"
                    title="GitHub"
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <span className="sr-only">GitHub</span>
                    <FaGithub className="block h-6 w-6" />
                  </a>
                </li>
                <li className="mr-5 text-xs shrink-0">
                  <a
                    href="https://www.linkedin.com/in/a-quach/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn (opens in a new tab)"
                    title="LinkedIn"
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <FaLinkedin className="block h-6 w-6" />
                  </a>
                </li>
                <li className="mr-5 text-xs shrink-0">
                  <a
                    href="mailto: alvinwquach@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Email (opens in a new tab)"
                    title="Email"
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <span className="sr-only">Email</span>
                    <FaEnvelope className="block h-6 w-6" />
                  </a>
                </li>
                <li className="mr-5 text-xs shrink-0">
                  <a
                    href="/resume/alvin-quach-resume-fullstack.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Resume (Opens in a new tab)"
                    title="Download Resume"
                    download
                    className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 focus-ring-colors-light-header hover:bg-black/10"
                  >
                    <FaFileDownload className="block h-6 w-6" />
                  </a>
                </li>
              </ul>
            </div>
          </header>
          <BackToTopButton />
          <section
            id="projects"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="Selected projects"
          >
            <div>
              <h3
                className={`${bungee_spice.className} mt-12 text-white animate-neon text-5xl font-bold text-center  leading-1`}
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
