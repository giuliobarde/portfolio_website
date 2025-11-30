"use client";

import { useEffect, useRef } from "react";
import { FC } from "react";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";
import Shapes from "./Shapes"
import Bounded from "@/components/Bounded";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const component = useRef(null);
  // Strip # from section_id if present (HTML IDs shouldn't include #)
  const rawSectionId = (slice.primary as { section_id?: string }).section_id || "hero";
  const sectionId = typeof rawSectionId === 'string' ? rawSectionId.replace(/^#+/, '') : rawSectionId;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".name-animation",
        {
          opacity: 0,
          x: (i) => {
            const angle = -90 + i * 30; // Start from top (-90 degrees)
            const radians = angle * (Math.PI / 180);
            const radius = 1500; // Start off-screen above
            return radius * Math.cos(radians);
          },
          y: (i) => {
            const angle = -90 + i * 30; // Start descending in a spiral
            const radians = angle * (Math.PI / 180);
            const radius = 1500;
            return radius * Math.sin(radians);
          },
          rotation: 720, // Start with extra rotation for a spiral effect
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          ease: "power4.out",
          duration: 2,
          stagger: {
            each: 0.1,
            from: "start",
          },
        }
      );

      tl.fromTo(
        ".job-title",
        {
          y: 20,
          opacity: 0,
          scale: 1.2,
        },
        {
          opacity: 1,
          duration: 1,
          scale: 1,
          ease: "elastic.out(1,0.3)",
        }
      );
    }, component);
    return () => ctx.revert();
  }, []);

  const renderLetters = (name: KeyTextField, key: string) => {
    if (!name) return null;
    return name.split("").map((letter, index) => (
      <span
        key={index}
        className={`name-animation name-animation-${key} inline-block opacity-0`}
      >
        {letter}
      </span>
    ));
  };

  return (
    <Bounded
      id={sectionId}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid min-h-[50vh] md:min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center">
        <Shapes />
        <div className="col-start-1 md:row-start-1">
          <h1
            className="mb-8 text-[clamp(3rem,20vmin,20rem)] font-extrabold leading-none tracking-tighter whitespace-nowrap overflow-visible"
            aria-label={slice.primary.first_name + " " + slice.primary.last_name}
          >
            <span className="block whitespace-nowrap overflow-visible pr-4">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="block whitespace-nowrap overflow-visible -mt-[-.2em] text-slate-500">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
          </h1>
          <span
            className="
              job-title
              block bg-gradient-to-tr 
              from-yellow-500 
              via-yellow-200 
              to-yellow-600 
              bg-clip-text 
              text-2xl 
              font-bold 
              uppercase 
              tracking-[.2em] 
              text-transparent 
              opacity-0 
              md:text-4xl
              code-style"
          >
            <span className="code-comment text-slate-500">{"// "}</span>
            {slice.primary.tag_line}
          </span>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
