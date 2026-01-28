// V4 version slices - Terminal/Data Science theme with Prismic data

import dynamic from "next/dynamic";

export const components = {
  biography: dynamic(() => import("./Biography")),
  hero: dynamic(() => import("./Hero")),
  projects: dynamic(() => import("./Projects")),
  tech_list: dynamic(() => import("./TechList")),
  work_experience: dynamic(() => import("./WorkExperience")),
  education: dynamic(() => import("./Education")),
};
