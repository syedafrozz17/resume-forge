import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resumes = await db.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        data: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse data JSON strings for each resume
    const parsedResumes = resumes.map((resume) => ({
      ...resume,
      data: JSON.parse(resume.data),
    }));

    return NextResponse.json(
      { success: true, data: parsedResumes },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get resumes error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, data, sourceId } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // If sourceId is provided, copy data from that resume
    let resumeData = data;
    if (sourceId && !data) {
      const sourceResume = await db.resume.findUnique({
        where: { id: sourceId },
      });
      if (sourceResume && sourceResume.userId === user.id) {
        resumeData = sourceResume.data;
      }
    }

    const resume = await db.resume.create({
      data: {
        title,
        data: typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData || {}),
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        data: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { ...resume, data: JSON.parse(resume.data) },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create resume error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
