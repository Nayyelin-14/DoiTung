"use client";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Cloud } from "react-icon-cloud";

// Choose only the icons you need to keep bundle size small
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiGithub,
} from "react-icons/si";

export const cloudProps = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
  },
};

// Map slugs to their corresponding react-icons components
const iconMap = {
  react: <SiReact size={42} />,
  nextdotjs: <SiNextdotjs size={42} />,
  typescript: <SiTypescript size={42} />,
  javascript: <SiJavascript size={42} />,
  tailwindcss: <SiTailwindcss size={42} />,
  github: <SiGithub size={42} />,
};

const renderCustomIcon = (slug) => {
  const icon = iconMap[slug.toLowerCase()];
  if (!icon) return null;

  return (
    <a key={slug} href="#" onClick={(e) => e.preventDefault()}>
      {icon}
    </a>
  );
};

export default function IconCloud({ iconSlugs = [], imageArray = [] }) {
  const { theme } = useTheme();

  const renderedIcons = useMemo(() => {
    return iconSlugs.map((slug) => renderCustomIcon(slug));
  }, [iconSlugs, theme]);

  return (
    // @ts-ignore
    <Cloud {...cloudProps}>
      <>
        {renderedIcons}
        {imageArray.map((image, index) => (
          <a key={index} href="#" onClick={(e) => e.preventDefault()}>
            <img height="42" width="42" alt="icon" src={image} />
          </a>
        ))}
      </>
    </Cloud>
  );
}
