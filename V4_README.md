# Portfolio v4 - Setup Complete! 🎉

Your new portfolio redesign has been successfully set up at `/v4`!

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   cd /Users/g/Desktop/Projects/Portfolio/my-portfolio
   npm run dev
   ```

2. **Visit your new portfolio:**
   - Navigate to: http://localhost:3000/v4
   - Current site (v3): http://localhost:3000/v3
   - Main site: http://localhost:3000

## 📁 Project Structure

```
src/
├── app/v4/
│   ├── page.tsx           # Main v4 page
│   ├── layout.tsx         # v4 layout with theme provider
│   └── globals.css        # v4 styles with Apple-inspired design
├── components/v4/
│   ├── Navbar.tsx         # Navigation with smooth animations
│   ├── ThemeProvider.tsx  # Theme context provider
│   ├── ThemeToggle.tsx    # Dark/Light mode toggle
│   ├── BackgroundEffects.tsx  # Animated background with orbs
│   ├── sections/
│   │   ├── HeroSection.tsx        # Landing section
│   │   ├── ProjectsSection.tsx    # Projects showcase
│   │   ├── WorkExperienceSection.tsx  # Work timeline
│   │   ├── SkillsSection.tsx      # Skills with progress bars
│   │   └── EducationSection.tsx   # Education cards
│   └── ui/
│       └── grid-background.tsx    # Aceternity UI components
└── lib/
    └── utils.ts           # Utility functions (cn helper)
```

## ✨ Features Implemented

### 🎨 Design System
- **Apple-like aesthetic** with clean typography and smooth animations
- **Dynamic theme switching** (Dark/Light mode) with persistent preference
- **Animated background** with floating gradient orbs
- **Glass morphism effects** throughout the UI

### 📱 Sections
1. **Hero Section** - Eye-catching landing with animated greeting
2. **Projects Section** - Showcase up to 4 featured projects with tags and links
3. **Work Experience** - Timeline layout with alternating cards
4. **Skills & Technologies** - 6 categories with animated progress bars
5. **Education** - Academic background with coursework and achievements

### 🔧 Technologies Used
- **Next.js 15** with TypeScript
- **Framer Motion** for smooth animations
- **next-themes** for theme management
- **Tailwind CSS** with custom design tokens
- **Aceternity UI** components (grid backgrounds)

## 🎯 Customization Guide

### 1. Update Personal Information

**Hero Section** ([src/components/v4/sections/HeroSection.tsx](src/components/v4/sections/HeroSection.tsx))
```tsx
// Line 34: Update your name
<span className="...">Your Name</span>

// Line 43: Update your title
Computer Science & AI Engineering Student

// Line 48: Update your description
Passionate about building intelligent systems...
```

### 2. Add Your Projects

**Projects Section** ([src/components/v4/sections/ProjectsSection.tsx](src/components/v4/sections/ProjectsSection.tsx))
```tsx
// Line 7: Replace with your actual projects
const projects = [
  {
    id: 1,
    title: "Your Project Title",
    description: "Project description...",
    tags: ["Python", "TensorFlow", "React"],
    image: "/path/to/image.jpg",  // Add images to /public folder
    link: "https://yourproject.com",
    github: "https://github.com/you/project",
  },
  // Add more projects...
];
```

### 3. Update Work Experience

**Work Section** ([src/components/v4/sections/WorkExperienceSection.tsx](src/components/v4/sections/WorkExperienceSection.tsx))
```tsx
// Line 7: Replace with your experience
const experiences = [
  {
    company: "Your Company",
    position: "Your Role",
    duration: "Jan 2025 - Present",
    location: "Location",
    description: "What you did...",
    achievements: [
      "Achievement 1",
      "Achievement 2",
    ],
    tags: ["Python", "AWS"],
  },
];
```

### 4. Customize Skills

**Skills Section** ([src/components/v4/sections/SkillsSection.tsx](src/components/v4/sections/SkillsSection.tsx))
```tsx
// Line 7: Update with your skills
const skillCategories = [
  {
    category: "Your Category",
    skills: [
      { name: "Skill Name", level: 90 },  // 0-100
    ],
  },
];
```

### 5. Update Education

**Education Section** ([src/components/v4/sections/EducationSection.tsx](src/components/v4/sections/EducationSection.tsx))
```tsx
// Line 7: Replace with your education
const education = [
  {
    degree: "Your Degree",
    school: "Your University",
    duration: "2022 - 2026",
    gpa: "3.9/4.0",
    // ... add your details
  },
];
```

## 🎨 Theme Customization

### Colors
Edit [src/app/v4/globals.css](src/app/v4/globals.css) to change color scheme:

```css
:root {
  --accent: 217 91% 60%;  /* Blue accent - change to your brand color */
  /* Adjust other colors as needed */
}
```

### Typography
Currently using **Inter** font. To change:

Edit [src/app/v4/layout.tsx](src/app/v4/layout.tsx):
```tsx
import { YourFont } from "next/font/google";

const yourFont = YourFont({
  subsets: ["latin"],
  variable: "--font-custom",
});
```

### Background Effects
Customize the animated orbs in [src/components/v4/BackgroundEffects.tsx](src/components/v4/BackgroundEffects.tsx):
- Change `bg-accent/20` to adjust color
- Modify animation duration and scale values

## 📝 Next Steps

1. **Add your images:**
   - Create project screenshots
   - Add them to `/public/images/` folder
   - Update image paths in ProjectsSection

2. **Add more Aceternity UI components:**
   - Visit: https://ui.aceternity.com/components
   - Copy components you like
   - Add them to `/src/components/v4/ui/`

3. **Set up contact form:**
   - Create a new `ContactSection.tsx`
   - Add it to the main page

4. **Add resume download:**
   - Add your resume PDF to `/public/`
   - Update the link in EducationSection (line ~147)

5. **Deploy:**
   - Push to GitHub
   - Deploy to Vercel: https://vercel.com

## 🐛 Troubleshooting

### Theme not persisting?
The theme preference is saved to localStorage automatically. Clear your browser cache if having issues.

### Animations not smooth?
Make sure you're running the dev server with `npm run dev --turbopack` for better performance.

### Sections not linking properly?
Check that section IDs match the navbar hrefs:
- `#home` → `id="home"`
- `#projects` → `id="projects"`
- etc.

## 📚 Resources

- **Aceternity UI**: https://ui.aceternity.com/components
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Next.js**: https://nextjs.org/docs

## 🎉 You're All Set!

Your portfolio v4 is ready to customize. Replace the placeholder content with your actual information and deploy when ready!

---

**Note**: The v3 version remains untouched at `/v3`, so you can compare designs and migrate gradually.
