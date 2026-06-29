import { CourseCard } from "@/components/courses/CourseCard";
import { useCourses } from "@/context/CoursesContext";
import { SECTIONS } from "@/lib/constants";
import { DataComingSoon } from "@/components/ui/DataComingSoon";
import {
  FadeInStagger,
  SectionHeading,
} from "@/components/motion/FadeIn";

export function Courses() {
  const { courses, loading } = useCourses();
  const section = SECTIONS.courses;
  const hasCourses = courses.length > 0;

  return (
    <section id="courses" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />

        {loading || !hasCourses ? (
          <DataComingSoon loading={loading} label="Courses" />
        ) : (
          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </FadeInStagger>
        )}
      </div>
    </section>
  );
}
