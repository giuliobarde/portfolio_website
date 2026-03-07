// V4 version slices - Terminal/Data Science theme with Prismic data
// Note: education and work_experience are handled by BranchingTimeline
// in page.tsx and are excluded from the SliceZone components map.

import dynamic from "next/dynamic";

export const components = {
  biography: dynamic(() => import("./Biography")),
  hero: dynamic(() => import("./Hero")),
  projects: dynamic(() => import("./Projects")),
  tech_list: dynamic(() => import("./TechList")),
};
