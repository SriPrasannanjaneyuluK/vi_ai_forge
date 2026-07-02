import { useState } from "react";
import { CourseImageFallback } from "@/components/courses/CourseImageFallback";
import { cn } from "@/lib/utils";

type CourseCoverImageProps = {
  src?: string | null;
  title: string;
  tag?: string;
  variant?: "card" | "hero";
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
};

export function CourseCoverImage({
  src,
  title,
  tag,
  variant = "card",
  className,
  imgClassName,
  loading = "lazy",
}: CourseCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    return (
      <CourseImageFallback
        title={title}
        tag={tag}
        variant={variant}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading={loading}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", imgClassName)}
    />
  );
}
