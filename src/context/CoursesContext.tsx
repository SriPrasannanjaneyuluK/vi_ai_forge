import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchPublicCourses } from "@/lib/api";
import type { PublicCoursesData } from "@/types/site";

interface CoursesContextValue {
  courses: PublicCoursesData["courses"];
  latestCourse: PublicCoursesData["latestCourse"];
  loading: boolean;
  error: string | null;
}

const CoursesContext = createContext<CoursesContextValue | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<PublicCoursesData["courses"]>([]);
  const [latestCourse, setLatestCourse] =
    useState<PublicCoursesData["latestCourse"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublicCourses()
      .then((data) => {
        if (!cancelled) {
          setCourses(data.courses);
          setLatestCourse(data.latestCourse);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setCourses([]);
          setLatestCourse(null);
          setError(
            err instanceof Error ? err.message : "Failed to load courses"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CoursesContext.Provider value={{ courses, latestCourse, loading, error }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error("useCourses must be used within CoursesProvider");
  }
  return context;
}
