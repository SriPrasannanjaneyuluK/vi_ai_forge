export const ACADEMY = {
  name: "VJ AI Forge",
  tagline: "Code With Confidence",
  caption: "we teach technology",
  email: "hello@vjaiforge.com",
  logo: "/logo.png",
};

export const NAV_LINKS = [
  { label: "Courses", href: "#courses" },
  { label: "Learn & Practice", href: "#practice" },
  { label: "Community", href: "#community" },
  { label: "Contact", href: "#contact" },
] as const;

export const LATEST_COURSE = {
  title: "Production-Ready Full Stack",
  description:
    "Build and deploy apps the way teams do in industry — real repos, real reviews, real shipping.",
  stack: ["React", "Node.js", "PostgreSQL", "Docker"],
  level: "Intermediate",
  duration: "12 weeks",
};

export const COURSES = [
  {
    id: "fullstack",
    title: "Full-Stack Production Patterns",
    description:
      "Learn how production apps are structured, tested, and deployed — not just tutorials.",
    level: "Intermediate",
    duration: "10 weeks",
    icon: "layers" as const,
    tag: "Industrial focus",
  },
  {
    id: "ai-ml",
    title: "AI/ML in Production",
    description:
      "From model training to serving APIs — build AI features teams actually ship.",
    level: "Advanced",
    duration: "8 weeks",
    icon: "brain" as const,
    tag: "Industrial focus",
  },
  {
    id: "system-design",
    title: "System Design Labs",
    description:
      "Architect scalable systems through hands-on labs and real-world case studies.",
    level: "Advanced",
    duration: "6 weeks",
    icon: "network" as const,
    tag: "Industrial focus",
  },
  {
    id: "devops",
    title: "DevOps Playground",
    description:
      "CI/CD, containers, and cloud — practice the toolchain modern teams rely on.",
    level: "Intermediate",
    duration: "8 weeks",
    icon: "terminal" as const,
    tag: "Industrial focus",
  },
  {
    id: "frontend",
    title: "Modern Frontend Craft",
    description:
      "Component architecture, performance, and accessibility at production quality.",
    level: "Beginner",
    duration: "8 weeks",
    icon: "code" as const,
    tag: "Industrial focus",
  },
  {
    id: "backend",
    title: "Backend Engineering Deep Dive",
    description:
      "APIs, databases, caching, and security — code you'd be proud to merge.",
    level: "Intermediate",
    duration: "10 weeks",
    icon: "server" as const,
    tag: "Industrial focus",
  },
];

export const PRACTICE_FEATURES = [
  {
    id: "doubts",
    title: "Doubt Arena",
    description:
      "Ask questions, discuss concepts, and get unstuck — learning happens when you talk it through.",
    icon: "message-circle" as const,
    size: "large" as const,
    cta: "Try Sample",
  },
  {
    id: "labs",
    title: "Hands-on Labs",
    description:
      "Production-style exercises with real codebases. Break things, fix them, learn deeply.",
    icon: "flask-conical" as const,
    size: "medium" as const,
    cta: "Try Sample",
  },
  {
    id: "mocks",
    title: "Mock Tests",
    description:
      "Interview-ready assessments that mirror what companies actually ask.",
    icon: "clipboard-check" as const,
    size: "medium" as const,
    cta: "Coming Soon",
  },
];

export const COMMUNITY_POSTS = [
  {
    id: 1,
    author: "Priya S.",
    avatar: "PS",
    type: "Project Share",
    title: "Built a real-time chat with WebSockets",
    likes: 24,
  },
  {
    id: 2,
    author: "Rahul M.",
    avatar: "RM",
    type: "Doubt Thread",
    title: "How do teams handle database migrations in prod?",
    likes: 18,
  },
  {
    id: 3,
    author: "Ananya K.",
    avatar: "AK",
    type: "Peer Review",
    title: "Code review feedback on my REST API design",
    likes: 31,
  },
];

export const MARQUEE_ITEMS = [
  "REST API Boilerplate",
  "Docker Compose Lab",
  "React Dashboard",
  "Auth Microservice",
  "CI Pipeline Starter",
  "GraphQL Playground",
  "ML Model Server",
  "System Design Kit",
];

export const FOUNDER = {
  name: "VJ",
  role: "Founder & Lead Mentor",
  bio: "Passionate about bridging the gap between learning and industry. With years of experience building production systems, VJ founded VJ AI Forge to create a space where learners write code they're proud to ship.",
  experience: [
    "10+ years building production software at scale",
    "Led engineering teams across full-stack and AI products",
    "Mentored 200+ developers into their first industry roles",
    "Contributor to open-source and community-driven learning",
  ],
  companies: ["TechCorp", "CloudScale", "DataFlow", "InnovateLabs"],
  quote:
    "We don't sell courses — we forge engineers who can walk into any team and contribute from day one.",
};

export const TEAM = [
  {
    name: "Alex Chen",
    role: "Full-Stack Mentor",
    bio: "Former senior engineer. Loves turning complex systems into clear lessons.",
    avatar: "AC",
  },
  {
    name: "Sneha Patel",
    role: "AI/ML Guide",
    bio: "ML engineer who believes the best way to learn is by shipping models.",
    avatar: "SP",
  },
  {
    name: "Marcus Johnson",
    role: "DevOps Coach",
    bio: "Infrastructure nerd. Makes CI/CD feel like a playground.",
    avatar: "MJ",
  },
  {
    name: "Divya Reddy",
    role: "Community Lead",
    bio: "Builds spaces where learners support each other and grow together.",
    avatar: "DR",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Pick a Path",
    description: "Choose a track aligned with your career goals and current skill level.",
  },
  {
    step: 2,
    title: "Lab It Out",
    description: "Work through hands-on labs with production-grade code and tooling.",
  },
  {
    step: 3,
    title: "Test Yourself",
    description: "Validate your skills with mock tests designed around real interviews.",
  },
  {
    step: 4,
    title: "Ship a Project",
    description: "Contribute to the community portfolio — real projects, real impact.",
  },
];

export const STATS = [
  { label: "Courses", value: 12, suffix: "+" },
  { label: "Hands-on Labs", value: 48, suffix: "+" },
  { label: "Community Members", value: 500, suffix: "+" },
  { label: "Projects Shipped", value: 120, suffix: "+" },
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "This isn't another course platform. The labs feel like my first week at a real company — in the best way.",
    author: "Karthik R.",
    role: "Software Engineer",
  },
  {
    id: 2,
    quote:
      "The doubt section alone changed how I learn. I finally understand concepts I struggled with for months.",
    author: "Meera L.",
    role: "Full-Stack Developer",
  },
  {
    id: 3,
    quote:
      "Mock tests prepared me better than any bootcamp. I landed my first dev role within two months.",
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
