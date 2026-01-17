# Setting Up Work Experience & Education Slices in Prismic

This guide will walk you through creating the **Work Experience** and **Education** custom slices in your Prismic repository.

## 📋 Overview

You need to create two new shared slices:
1. **Work Experience** - For displaying your professional experience
2. **Education** - For showing your academic background

## 🚀 Step-by-Step Setup

### Step 1: Access Slice Machine

1. Go to your **Prismic dashboard**: https://prismic.io
2. Select your repository
3. Click on **"Slice Machine"** or **"Custom Types"** in the sidebar
4. Click **"Create a Slice"**

---

## 📊 Creating the Work Experience Slice

### Basic Configuration
- **Slice Name:** `Work Experience`
- **API ID:** `work_experience` (important - must match exactly!)
- **Description:** "Display professional work experience in timeline format"

### Fields to Add

#### Non-Repeatable Zone (Primary)

1. **Section ID** (Optional)
   - Field Type: `Key Text`
   - API ID: `section_id`
   - Placeholder: "work"
   - Description: "Custom anchor ID for navigation"

2. **Heading**
   - Field Type: `Key Text`
   - API ID: `heading`
   - Placeholder: "Work Experience"
   - Description: "Section title"

3. **Description** (Optional)
   - Field Type: `Rich Text`
   - API ID: `description`
   - Description: "Optional section description"
   - Allowed formats: Bold, Italic, Links

#### Repeatable Zone (Items) - "Experiences"
Click **"Add a repeatable zone"** and name it `experiences`

Add these fields to the repeatable zone:

1. **Company**
   - Field Type: `Key Text`
   - API ID: `company`
   - Placeholder: "Company Name Inc."

2. **Position**
   - Field Type: `Key Text`
   - API ID: `position`
   - Placeholder: "Software Engineer"

3. **Location**
   - Field Type: `Key Text`
   - API ID: `location`
   - Placeholder: "San Francisco, CA"

4. **Start Date**
   - Field Type: `Date`
   - API ID: `start_date`

5. **End Date**
   - Field Type: `Date`
   - API ID: `end_date`

6. **Is Current** (Optional)
   - Field Type: `Boolean`
   - API ID: `is_current`
   - Description: "Check if this is your current position"

7. **Description**
   - Field Type: `Rich Text`
   - API ID: `description`
   - Description: "Job description and responsibilities"
   - Allowed formats: Bold, Italic, Lists, Links

8. **Achievements**
   - Field Type: `Rich Text`
   - API ID: `achievements`
   - Description: "Key achievements and accomplishments"
   - Allowed formats: Bold, Italic, Lists, Links

9. **Technologies**
   - Field Type: `Key Text`
   - API ID: `technologies`
   - Placeholder: "React, TypeScript, Node.js, AWS"
   - Description: "Comma-separated list of technologies used"

**Save the slice!**

---

## 🎓 Creating the Education Slice

### Basic Configuration
- **Slice Name:** `Education`
- **API ID:** `education` (important - must match exactly!)
- **Description:** "Display educational background and academic achievements"

### Fields to Add

#### Non-Repeatable Zone (Primary)

1. **Section ID** (Optional)
   - Field Type: `Key Text`
   - API ID: `section_id`
   - Placeholder: "education"
   - Description: "Custom anchor ID for navigation"

2. **Heading**
   - Field Type: `Key Text`
   - API ID: `heading`
   - Placeholder: "Education"
   - Description: "Section title"

3. **Description** (Optional)
   - Field Type: `Rich Text`
   - API ID: `description`
   - Description: "Optional section description"
   - Allowed formats: Bold, Italic, Links

#### Repeatable Zone (Items) - "Education Items"
Click **"Add a repeatable zone"** and name it `education_items`

Add these fields to the repeatable zone:

1. **Degree**
   - Field Type: `Key Text`
   - API ID: `degree`
   - Placeholder: "Bachelor of Science in Computer Science"

2. **Field of Study** (Optional)
   - Field Type: `Key Text`
   - API ID: `field_of_study`
   - Placeholder: "Specialization in Artificial Intelligence"

3. **School**
   - Field Type: `Key Text`
   - API ID: `school`
   - Placeholder: "University Name"

4. **Location**
   - Field Type: `Key Text`
   - API ID: `location`
   - Placeholder: "Boston, MA"

5. **Start Date**
   - Field Type: `Date`
   - API ID: `start_date`

6. **End Date**
   - Field Type: `Date`
   - API ID: `end_date`

7. **GPA** (Optional)
   - Field Type: `Key Text`
   - API ID: `gpa`
   - Placeholder: "3.9/4.0"

8. **Description** (Optional)
   - Field Type: `Rich Text`
   - API ID: `description`
   - Description: "Additional details, honors, etc."
   - Allowed formats: Bold, Italic, Lists, Links

9. **Coursework**
   - Field Type: `Key Text`
   - API ID: `coursework`
   - Placeholder: "Machine Learning, Data Structures, Algorithms, Computer Vision"
   - Description: "Comma-separated list of relevant courses"

10. **Achievements**
    - Field Type: `Rich Text`
    - API ID: `achievements`
    - Description: "Academic achievements, awards, leadership roles"
    - Allowed formats: Bold, Italic, Lists, Links

**Save the slice!**

---

## ✅ Adding Slices to Your Homepage

After creating both slices:

1. Go to **Documents** → **Homepage**
2. Scroll to the **Slice Zone**
3. Click **"Add a slice"**
4. You'll now see:
   - Hero
   - Projects
   - TechList
   - Biography
   - **Work Experience** ← New!
   - **Education** ← New!
5. Add them in your preferred order
6. Fill in the content
7. **Publish** your changes

---

## 📝 Recommended Slice Order

For best visual flow, arrange slices like this:

1. **Hero** - Landing section
2. **Biography** - About you
3. **Work Experience** - Professional history
4. **Projects** - Portfolio pieces
5. **TechList** - Skills
6. **Education** - Academic background

---

## 📖 Example Content

### Work Experience Example:

**Company:** "Acme Corporation"
**Position:** "Senior AI Engineer"
**Location:** "San Francisco, CA"
**Start Date:** Jan 2023
**End Date:** (leave empty if current)
**Is Current:** ✓
**Description:**
- Led development of ML recommendation system
- Managed team of 5 engineers
- Improved model accuracy by 25%

**Achievements:**
- Deployed production ML pipeline processing 10M+ events/day
- Reduced inference latency by 40%
- Published paper at NeurIPS 2024

**Technologies:** "Python, TensorFlow, AWS SageMaker, Docker, Kubernetes"

---

### Education Example:

**Degree:** "Bachelor of Science in Computer Science"
**Field of Study:** "Specialization in Artificial Intelligence"
**School:** "Stanford University"
**Location:** "Stanford, CA"
**Start Date:** Sep 2020
**End Date:** Jun 2024
**GPA:** "3.9/4.0"
**Description:** "Graduated with honors. Focus on machine learning and artificial intelligence."
**Coursework:** "Machine Learning, Deep Learning, Computer Vision, NLP, Data Structures, Algorithms, Database Systems"
**Achievements:**
- Dean's List all semesters
- Published 2 research papers
- President of AI/ML Club
- Winner of University Hackathon 2023

---

## 🔧 After Setup

Once you've created these slices and added content:

1. **Publish** your homepage in Prismic
2. Restart your dev server: `npm run dev`
3. Visit: http://localhost:3000/v4
4. You should see your Work Experience and Education sections!

---

## 🐛 Troubleshooting

### Slices not appearing?
- Verify API IDs match exactly: `work_experience` and `education`
- Make sure slices are added to the Homepage document
- Check that you **published** (not just saved) in Prismic
- Clear Next.js cache: `rm -rf .next && npm run dev`

### TypeScript errors?
- After creating slices, Prismic will regenerate types
- Run: `npx prismic-types`
- This updates `prismicio-types.d.ts` with new slice types

### Content not showing?
- Verify you filled in required fields (Company, Position, Degree, School)
- Check console for errors: `npm run dev`
- Ensure dates are in proper format

---

## 📚 What You Created

### v4 Slice Components
✅ [src/slices/v4/WorkExperience/index.tsx](src/slices/v4/WorkExperience/index.tsx)
✅ [src/slices/v4/Education/index.tsx](src/slices/v4/Education/index.tsx)
✅ [src/slices/v4/index.ts](src/slices/v4/index.ts) - Updated registry

### Design Features
- **Work Experience:** Timeline layout with alternating cards
- **Education:** Stacked cards with decorative styling
- Both use Framer Motion animations
- Fully responsive
- Dark/light theme support
- Apple-like design aesthetic

---

## 🎉 You're Done!

Once you complete the Prismic setup:
1. All 6 sections will be live
2. All content managed through Prismic CMS
3. Full Apple-like design system
4. Dark/light theme toggle
5. Smooth animations throughout

Need help? Check the console for errors or re-read this guide!
