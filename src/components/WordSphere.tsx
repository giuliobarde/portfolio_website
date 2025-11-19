"use client";

import React, { useEffect } from "react";
import TagCloud, { TagCloudOptions } from "TagCloud";

type wordSphereProps = {
  wordList: string[];
  sphereSize: number;
}

const WordSphere: React.FC<wordSphereProps> = ({ wordList, sphereSize }) => {
  useEffect(() => {
    const container = document.querySelector(".tagcloud") as HTMLElement | null;
    if (!container) return; // Ensure the element exists

    const options: TagCloudOptions = {
      radius: sphereSize,
      maxSpeed: "slow",
      initSpeed: "normal",
      keep: true,
    };

    // Destroy any existing instance to avoid duplication
    container.innerHTML = "";

    // Initialize the TagCloud
    TagCloud([container], wordList, options);
  }, [sphereSize, wordList]);

  return <span className="tagcloud prose prose-slate prose-invert font-bold" />;
};

export default WordSphere;
