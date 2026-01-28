import { NextRequest, NextResponse } from 'next/server';
import { setSession, clearSession, UserType, AccountInfo, SessionUser } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, userType, accounts, token, activeAccountId } = body;

    if (!user || !userType || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const sessionAccounts: AccountInfo[] = Array.isArray(accounts)
      ? accounts.map((a: { id: string; name: string; role?: string; logoUrl?: string }) => ({
          id: a.id,
          name: a.name,
          role: a.role || 'owner',
          logoUrl: a.logoUrl
        }))
      : [];

    await setSession(
      sessionUser,
      userType as UserType,
      sessionAccounts,
      token,
      activeAccountId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
