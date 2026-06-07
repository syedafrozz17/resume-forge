import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { cuid } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existing = await db.execute({
      sql: 'SELECT id FROM User WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const id = cuid();

    await db.execute({
      sql: 'INSERT INTO User (id, email, name, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))',
      args: [id, email, name, hashedPassword],
    });

    const token = await createToken({ userId: id, email });
    await setAuthCookie(token);

    return NextResponse.json(
      { success: true, data: { id, email, name } },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
