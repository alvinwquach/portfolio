import cn from "clsx";
import s from "./Marquee.module.css";
import FastMarquee from "react-fast-marquee";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  speed?: number;
}

export default function Marquee({
  children,
  className = "",
  pauseOnHover = true,
  speed = 50,
  ...rest
}: MarqueeProps) {
  return (
    <FastMarquee
      gradient={false}
      className={cn(s.root, className)}
      pauseOnHover={pauseOnHover}
      speed={speed}
      {...rest}
    >
      {[<div key={0}>{children}</div>, <div key={1} className="w-[150px]" />]}
    </FastMarquee>
  );
}
