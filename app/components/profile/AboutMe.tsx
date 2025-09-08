"use client";

import {
  PortableText,
  PortableTextBlock,
  PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";

const portableTextComponents: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-green-400 mt-8 mb-4">
        {children}
      </h3>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-green-400 pl-4 my-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded font-mono text-sm block whitespace-pre-wrap">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-green-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

interface AboutMeProps {
  name: string;
  profileImageUrl: string;
  bio: PortableTextBlock[];
}

export default function AboutMe({ name, profileImageUrl, bio }: AboutMeProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center gap-12">
      <div className="flex flex-col md:flex-row items-center gap-12 w-full">
        <div className="w-48 h-48 relative rounded-full overflow-hidden flex-shrink-0 shadow-lg ring-4 ring-green-400/50">
          <Image
            src={profileImageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold text-green-400 mb-4">{name}</h2>
          <div className="text-slate-300 text-lg leading-relaxed">
            <PortableText value={bio} components={portableTextComponents} />
          </div>
        </div>
      </div>
    </div>
  );
}
