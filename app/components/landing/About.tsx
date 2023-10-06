import React from "react";
import Image from "next/image";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { About } from "@/types/About";
import { PortableText } from "@portabletext/react";

interface AboutSectionProps {
  about: About;
}

function AboutSection({ about }: AboutSectionProps) {
  return (
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
  );
}

export default AboutSection;
