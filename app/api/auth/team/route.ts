import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await fetch(
      `${API_URL}/auth/team/${session.activeAccountId}`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch team' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Team retrieval error:', error);
    return NextResponse.json({ error: 'Failed to get team' }, { status: 500 });
  }
}
