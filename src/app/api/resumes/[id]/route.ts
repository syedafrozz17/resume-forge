import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await db.execute({
      sql: 'SELECT id, title, data, userId, createdAt, updatedAt FROM Resume WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    if (row.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, data: { ...row, data: JSON.parse(row.data as string) } },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Get resume error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await db.execute({
      sql: 'SELECT id, userId FROM Resume WHERE id = ?',
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    if (existing.rows[0].userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, data } = body;

    // Build update query dynamically
    const updates: string[] = [];
    const args: (string | null)[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      args.push(title);
    }
    if (data !== undefined) {
      updates.push('data = ?');
      args.push(typeof data === 'string' ? data : JSON.stringify(data));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push("updatedAt = datetime('now')");
    args.push(id);

    await db.execute({
      sql: `UPDATE Resume SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    // Fetch updated resume
    const updated = await db.execute({
      sql: 'SELECT id, title, data, userId, createdAt, updatedAt FROM Resume WHERE id = ?',
      args: [id],
    });

    const row = updated.rows[0];
    return NextResponse.json(
      { success: true, data: { ...row, data: JSON.parse(row.data as string) } },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Update resume error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await db.execute({
      sql: 'SELECT id, userId FROM Resume WHERE id = ?',
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    if (existing.rows[0].userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await db.execute({
      sql: 'DELETE FROM Resume WHERE id = ?',
      args: [id],
    });

    return NextResponse.json(
      { success: true, data: { message: 'Resume deleted successfully' } },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Delete resume error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
