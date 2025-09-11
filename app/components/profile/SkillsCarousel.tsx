"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prata } from "@/app/util/fonts";
import { Skill } from "@/app/types/types";

interface SkillsCarouselProps {
  skills: Skill[];
}

export default function SkillsCarousel({ skills }: SkillsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const originalChildren = Array.from(scroller.children);
    originalChildren.forEach((child) => {
      const clone = child.cloneNode(true);
      scroller.appendChild(clone);
    });

    const totalWidth = scroller.scrollWidth;
    const containerWidth = scroller.clientWidth;

    gsap.to(scroller, {
      x: `-${totalWidth / 2}px`,
      ease: "none",
      duration: (totalWidth / containerWidth) * 20,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(
          (x: number) => parseFloat(x.toString()) % (totalWidth / 2)
        ),
      },
    });

    return () => {
      gsap.killTweensOf(scroller);
    };
  }, [skills]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
      <h3
        className={`${prata.className} text-3xl text-blue-600 mb-2 text-center`}
      >
        My Skills
      </h3>
      <p className="text-slate-600 mb-6 text-center">
        Explore the skills that power my work and creativity.
      </p>
      <div className="relative overflow-hidden w-full">
        <div ref={scrollerRef} className="flex flex-nowrap whitespace-nowrap">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center p-2 transition-transform duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-3 cursor-pointer p-2  transition-all duration-300">
                {skill.image?.asset?.url ? (
                  <div className="relative w-10 h-10  overflow-hidden">
                    <Image
                      src={skill.image.asset.url}
                      alt={skill.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">
                      {skill.name[0]}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-blue-600">
                  {skill.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
