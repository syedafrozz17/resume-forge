import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { cuid } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await db.execute({
      sql: 'SELECT id, title, data, userId, createdAt, updatedAt FROM Resume WHERE userId = ? ORDER BY updatedAt DESC',
      args: [user.id],
    });

    const resumes = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      data: JSON.parse(row.data as string),
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return NextResponse.json(
      { success: true, data: resumes },
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
      const source = await db.execute({
        sql: 'SELECT data, userId FROM Resume WHERE id = ?',
        args: [sourceId],
      });
      if (source.rows.length > 0 && source.rows[0].userId === user.id) {
        resumeData = source.rows[0].data;
      }
    }

    const id = cuid();
    const dataStr = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData || {});

    await db.execute({
      sql: 'INSERT INTO Resume (id, title, data, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))',
      args: [id, title, dataStr, user.id],
    });

    return NextResponse.json(
      {
        success: true,
        data: { id, title, data: JSON.parse(dataStr), userId: user.id },
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
