import { kv } from '@vercel/kv';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { UserCourseData } from '../route';

// Get specific course progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCourses = await kv.get<UserCourseData>(`courses:${userId}`);
    const course = userCourses?.courses.find((c) => c.courseId === courseId);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// Delete course progress
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingData = await kv.get<UserCourseData>(`courses:${userId}`);

    if (!existingData) {
      return NextResponse.json({ error: 'No courses found' }, { status: 404 });
    }

    existingData.courses = existingData.courses.filter(
      (c) => c.courseId !== courseId
    );
    existingData.lastUpdated = new Date().toISOString();

    await kv.set(`courses:${userId}`, existingData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
