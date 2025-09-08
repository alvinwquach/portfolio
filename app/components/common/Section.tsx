import React from "react";
import cn from "clsx";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  bg?: string;
  wrapperStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const Colors = {
  Light: "bg-white",
  Dark: "bg-[#0f172a]",
};

function Section(props: SectionProps) {
  const { children, className, bg = "", wrapperStyle, style } = props;

  return (
    <div className={bg} style={wrapperStyle}>
      <div
        style={style}
        className={cn(
          "max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

(Section as typeof Section & { Colors: typeof Colors }).Colors = Colors;

export default Section as typeof Section & { Colors: typeof Colors };
