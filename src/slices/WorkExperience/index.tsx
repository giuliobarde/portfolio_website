import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `WorkExperience`.
 */
export type WorkExperienceProps =
  SliceComponentProps<Content.WorkExperienceSlice>;

/**
 * Component for "WorkExperience" Slices.
 */
const WorkExperience: FC<WorkExperienceProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for work_experience (variation: {slice.variation})
      Slices
    </section>
  );
};

export default WorkExperience;
