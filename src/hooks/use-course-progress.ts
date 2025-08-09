import { useState, useEffect, useCallback } from 'react';
import { CourseProgress } from '@/app/api/courses/route';

interface UseCourseProgressReturn {
  courses: CourseProgress[];
  loading: boolean;
  error: string | null;
  updateCourseProgress: (
    courseId: string,
    progress: number,
    currentStep?: number,
    totalSteps?: number
  ) => Promise<void>;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  deleteCourse: (courseId: string) => Promise<void>;
  refreshCourses: () => Promise<void>;
}

export function useCourseProgress(): UseCourseProgressReturn {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/courses');

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourseProgress = useCallback(
    async (
      courseId: string,
      progress: number,
      currentStep?: number,
      totalSteps?: number
    ) => {
      try {
        setError(null);

        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            courseId,
            progress,
            currentStep,
            totalSteps
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update course progress');
        }

        const data = await response.json();

        // Update local state
        setCourses((prev) => {
          const index = prev.findIndex((c) => c.courseId === courseId);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = data.course;
            return updated;
          } else {
            return [...prev, data.course];
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error updating course:', err);
        throw err;
      }
    },
    []
  );

  const getCourseProgress = useCallback(
    (courseId: string) => {
      return courses.find((course) => course.courseId === courseId);
    },
    [courses]
  );

  const deleteCourse = useCallback(async (courseId: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Update local state
      setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error deleting course:', err);
      throw err;
    }
  }, []);

  const refreshCourses = useCallback(async () => {
    await fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    updateCourseProgress,
    getCourseProgress,
    deleteCourse,
    refreshCourses
  };
}
