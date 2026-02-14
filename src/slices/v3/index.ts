// V3 version slices - re-exports root slices (subset without Education/WorkExperience)

import dynamic from "next/dynamic";

export const components = {
  biography: dynamic(() => import("../Biography")),
  hero: dynamic(() => import("../Hero")),
  projects: dynamic(() => import("../Projects")),
  tech_list: dynamic(() => import("../TechList")),
};
