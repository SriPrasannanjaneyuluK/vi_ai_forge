export type CourseIcon =
  | "layers"
  | "brain"
  | "network"
  | "terminal"
  | "code"
  | "server";

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  icon: CourseIcon;
  tag: string;
  cardImageUrl: string | null;
}

export interface LatestCourse {
  title: string;
  description: string;
  stack: string[];
  level: string;
  duration: string;
}

export interface PublicCoursesData {
  courses: Course[];
  latestCourse: LatestCourse | null;
}

export interface CurriculumWeek {
  week: number;
  title: string;
  topics: string[];
}

export interface CourseProject {
  title: string;
  description: string;
}

export interface CareerPath {
  title: string;
  description: string;
}

export interface FeeStructure {
  type: "one_time" | "emi";
  amount: number;
  currency: string;
  emi?: { monthly: number; months: number };
  discount?: string;
  scholarship?: string;
}

export interface DemoSession {
  id: number;
  startsAt: string;
  durationMinutes: number;
  mode: "online" | "offline";
  maxSeats: number;
  availableSeats: number;
  instructorName: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  tagline: string;
  level: string;
  duration: string;
  icon: CourseIcon;
  tag: string;
  bannerUrl: string | null;
  cardImageUrl: string | null;
  mode: string;
  hasCertificate: boolean;
  hasPlacementAssistance: boolean;
  instructor: {
    name: string;
    title: string;
    bio: string;
  };
  rating: number | null;
  overview: string;
  audience: string;
  prerequisites: string;
  technologies: string[];
  outcomes: string[];
  curriculum: CurriculumWeek[];
  projects: CourseProject[];
  careers: CareerPath[];
  feeStructure: FeeStructure | null;
  demoSessions: DemoSession[];
}

export interface DemoBookingResult {
  bookingRef: string;
  courseName: string;
  demoDate: string;
  demoTime: string;
  instructorName: string;
  mode: "online" | "offline";
  notifications: {
    emailSent: boolean;
    whatsAppSent: boolean;
  };
}

export interface StudentDemoBooking {
  bookingRef: string;
  status: string;
  courseSlug: string;
  courseName: string;
  demoDate: string;
  demoTime: string;
  instructorName: string;
  mode: "online" | "offline";
  joinLink: string | null;
  startsAt: string;
}
