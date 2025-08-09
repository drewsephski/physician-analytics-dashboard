import { kv } from '@vercel/kv';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export interface CourseProgress {
  courseId: string;
  completedAt: string;
  progress: number; // 0-100
  currentStep?: number;
  totalSteps?: number;
}

export interface UserCourseData {
  userId: string;
  courses: CourseProgress[];
  lastUpdated: string;
}

// Get user's course progress
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCourses = await kv.get<UserCourseData>(`courses:${userId}`);

    return NextResponse.json({
      courses: userCourses?.courses || [],
      lastUpdated: userCourses?.lastUpdated || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// Update course progress
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, progress, currentStep, totalSteps } = body;

    if (!courseId || progress === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing data
    const existingData = (await kv.get<UserCourseData>(
      `courses:${userId}`
    )) || {
      userId,
      courses: [],
      lastUpdated: new Date().toISOString()
    };

    // Find existing course or create new one
    const courseIndex = existingData.courses.findIndex(
      (c) => c.courseId === courseId
    );
    const courseProgress: CourseProgress = {
      courseId,
      completedAt: new Date().toISOString(),
      progress: Math.min(100, Math.max(0, progress)),
      currentStep,
      totalSteps
    };

    if (courseIndex >= 0) {
      existingData.courses[courseIndex] = courseProgress;
    } else {
      existingData.courses.push(courseProgress);
    }

    existingData.lastUpdated = new Date().toISOString();

    // Save to KV
    await kv.set(`courses:${userId}`, existingData);

    return NextResponse.json({ success: true, course: courseProgress });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}
