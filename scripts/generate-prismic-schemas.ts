#!/usr/bin/env node

/**
 * Generates and logs the Prismic JSON schemas for the `skill` and
 * `work_experience` custom types so they can be pasted into the
 * Prismic dashboard.
 *
 * Usage:  node scripts/generate-prismic-schemas.js
 *    or:  npx tsx scripts/generate-prismic-schemas.ts
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const skillSchema = JSON.parse(
  fs.readFileSync(path.resolve(ROOT, "customtypes/skill/index.json"), "utf-8"),
);

const workExperienceSchema = JSON.parse(
  fs.readFileSync(
    path.resolve(ROOT, "customtypes/work_experience/index.json"),
    "utf-8",
  ),
);

console.log("=".repeat(60));
console.log("SKILL CUSTOM TYPE");
console.log("=".repeat(60));
console.log(JSON.stringify(skillSchema, null, 2));

console.log("\n" + "=".repeat(60));
console.log("WORK EXPERIENCE CUSTOM TYPE");
console.log("=".repeat(60));
console.log(JSON.stringify(workExperienceSchema, null, 2));
