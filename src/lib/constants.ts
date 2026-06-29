/**
 * Site copy and marketing content — edit here to update the public website.
 * Courses are managed in the admin portal (database).
 */

export const ACADEMY = {
  name: "VJ AI Forge",
  tagline: "Code With Confidence",
  caption: "Professional technology education",
  email: "hello@vjaiforge.com",
  logo: "/logo.png",
} as const;

/** Public marketing navigation (home + browse + contact) */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "#courses" },
  { label: "Contact", href: "#contact" },
] as const;

/** Logged-in learner hub — one place for progress, enrollments, dashboard */
export const MY_LEARNING_PATH = "/dashboard";
export const MY_LEARNING_LABEL = "My Learnings";

export const SECTIONS = {
  hero: {
    eyebrow: "Professional Courses Platform",
    browseCoursesLabel: "Browse Courses",
    viewLatestCourseLabel: "View Latest Course",
    latestCourseLabel: "Latest Course",
    viewCourseDetailsLabel: "View Course Details",
  },
  courses: {
    eyebrow: "Courses",
    title: "Industry-aligned programs",
    subtitle:
      "Structured curricula focused on production patterns, professional tooling, and career-ready skills.",
  },
  founder: {
    eyebrow: "The Team",
    title: "Led by industry experts",
    subtitle:
      "Led by people who've built production systems and mentored engineers into industry.",
  },
  learnings: {
    eyebrow: "Learnings",
    title: "A structured path to mastery",
    subtitle:
      "From course enrollment to applied projects — a clear, professional learning journey.",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "From our learners",
    subtitle:
      "Professionals and students who advanced their careers through our courses.",
  },
  cta: {
    title: "Enroll in our courses",
    subtitle:
      "Join the waitlist for early access to structured courses and professional learnings at VJ AI Forge.",
    emailPlaceholder: "you@email.com",
    submitLabel: "Join Waitlist",
    successMessage: "You're on the list! We'll be in touch soon.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in touch",
    subtitle: "Questions about courses, enrollments, or partnerships? We are here to help.",
    location: "Remote-first, globally accessible",
    messagePlaceholder: "How can we assist you?",
  },
} as const;

/** Hero slide 2 — used when API has no featured course yet */
export const HERO_FEATURED_COURSE = {
  title: "Production-Ready Full Stack",
  description:
    "Build and deploy applications the way engineering teams do in industry — real repos, code reviews, and production workflows.",
  stack: ["React", "Node.js", "PostgreSQL", "TypeScript"],
  level: "Intermediate",
  duration: "12 weeks",
} as const;

export const FOUNDER = {
  name: "VJ",
  role: "Founder & Lead Instructor",
  bio: "Dedicated to delivering professional technology education. With extensive experience building production systems, VJ established VJ AI Forge to provide structured courses that prepare learners for industry careers.",
  experience: [
    "10+ years building production software at scale",
    "Led engineering teams across full-stack and AI products",
    "Mentored 200+ professionals into industry roles",
    "Contributor to professional and academic learning programs",
  ],
  companies: ["TechCorp", "CloudScale", "DataFlow", "InnovateLabs"],
  quote:
    "Our mission is to deliver courses that prepare learners to contribute confidently from their first day in the industry.",
};

export const TEAM = [
  {
    name: "Alex Chen",
    role: "Full-Stack Instructor",
    bio: "Former senior engineer focused on translating complex systems into clear, structured lessons.",
    avatar: "AC",
  },
  {
    name: "Sneha Patel",
    role: "AI/ML Instructor",
    bio: "ML engineer specializing in applied machine learning and production model deployment.",
    avatar: "SP",
  },
  {
    name: "Marcus Johnson",
    role: "DevOps Instructor",
    bio: "Infrastructure specialist with expertise in CI/CD pipelines and cloud operations.",
    avatar: "MJ",
  },
  {
    name: "Divya Reddy",
    role: "Program Coordinator",
    bio: "Coordinates course delivery and supports learners throughout their educational journey.",
    avatar: "DR",
  },
];

export const LEARNING_STEPS = [
  {
    step: 1,
    title: "Select a Course",
    description: "Choose a program aligned with your career goals and skill level.",
  },
  {
    step: 2,
    title: "Complete Coursework",
    description:
      "Progress through structured modules with production-grade code and tooling.",
  },
  {
    step: 3,
    title: "Assess Your Progress",
    description:
      "Validate your understanding with assessments designed around industry standards.",
  },
  {
    step: 4,
    title: "Apply Your Skills",
    description:
      "Build portfolio projects that demonstrate real-world engineering capability.",
  },
];

export const STATS = [
  { label: "Courses", value: 12, suffix: "+" },
  { label: "Learning Modules", value: 48, suffix: "+" },
  { label: "Enrolled Learners", value: 500, suffix: "+" },
  { label: "Certifications", value: 120, suffix: "+" },
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "The curriculum is structured like a professional training program. I gained practical skills I use every day at work.",
    author: "Karthik R.",
    role: "Software Engineer",
  },
  {
    id: 2,
    quote:
      "Clear course materials and expert instruction helped me master concepts I had struggled with for months.",
    author: "Meera L.",
    role: "Full-Stack Developer",
  },
  {
    id: 3,
    quote:
      "The assessments prepared me thoroughly. I secured my first developer role within two months of completing the program.",
    author: "Arjun T.",
    role: "Junior Developer",
  },
];

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Discord", href: "https://discord.com" },
];

export const FOOTER = {
  blurb:
    "A professional platform for structured courses, industry-aligned learnings, and career-ready skill development.",
} as const;

/** @deprecated Use ACADEMY and NAV_LINKS — kept for existing imports */
export const STATIC_SITE = {
  ...ACADEMY,
  navLinks: NAV_LINKS,
} as const;
