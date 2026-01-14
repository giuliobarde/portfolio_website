"use client";

import HeroSection from "@/components/v4/sections/HeroSection";
import ProjectsSection from "@/components/v4/sections/ProjectsSection";
import WorkExperienceSection from "@/components/v4/sections/WorkExperienceSection";
import SkillsSection from "@/components/v4/sections/SkillsSection";
import EducationSection from "@/components/v4/sections/EducationSection";
import BackgroundEffects from "@/components/v4/BackgroundEffects";

export default function V4Page() {
  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <BackgroundEffects />

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <ProjectsSection />
        <WorkExperienceSection />
        <SkillsSection />
        <EducationSection />
      </div>
    </div>
  );
}
