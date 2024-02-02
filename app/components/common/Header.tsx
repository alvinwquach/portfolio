import React from "react";
import { animated, useTrail, useSpring } from "@react-spring/web";
import {
  bungee_outline,
  bungee_spice,
  montserrat,
  press_start_2p,
} from "../../../utils/fonts";
import SocialMediaLinks from "./SocialMediaLinks";

interface HeaderProps {
  isEnvelopeIconClosed: boolean;
  handleMouseToggle: () => void;
  isMobile: boolean;
}

function Header({
  isEnvelopeIconClosed,
  handleMouseToggle,
  isMobile,
}: HeaderProps) {
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
          className={` ${
            isMobile ? bungee_outline.className : bungee_spice.className
          } animate-neon mt-5 text-2xl text-white font-bold tracking-tight`}
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
          I&apos;m currently an engineer at Bring The Shreds. My focus is on
          crafting a seamless user experience. Collaborating with our team, I
          design interfaces, optimize performance, and ensure accessibility. At
          Bring The Shreds, we&apos;re committed to delivering an engaging
          platform that makes a difference in users&rsquo; lives.
        </p>
        <p
          className={`${montserrat.className} mt-4 max-w-xs leading-normal text-white `}
        >
          When I&apos;m not coding, you&apos;ll often find me exploring new
          eateries or watching the Golden State Warriors. Go Dubs!
        </p>
        <SocialMediaLinks
          handleMouseToggle={handleMouseToggle}
          isEnvelopeIconClosed={isEnvelopeIconClosed}
        />
      </div>
    </header>
  );
}

export default Header;
