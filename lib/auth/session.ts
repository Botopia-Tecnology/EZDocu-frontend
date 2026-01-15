import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export type UserType = 'admin' | 'team' | 'member';

export interface AccountInfo {
  id: string;
  name: string;
  role: string;
}

export interface SessionUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface SessionData {
  user: SessionUser;
  userType: UserType;
  accounts: AccountInfo[];
  activeAccountId?: string;
  accessToken?: string;
  expires: string;
}

const authSecret = process.env.AUTH_SECRET;
if (!authSecret || authSecret.length === 0) {
  throw new Error('AUTH_SECRET environment variable is not set or is empty.');
}
const key = new TextEncoder().encode(authSecret);

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as unknown as SessionData;
}

export async function getSession(): Promise<SessionData | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  try {
    return await verifyToken(session);
  } catch {
    return null;
  }
}

export async function setSession(
  user: SessionUser,
  userType: UserType,
  accounts: AccountInfo[],
  accessToken?: string,
  activeAccountId?: string
) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    userType,
    accounts,
    activeAccountId: activeAccountId || accounts[0]?.id,
    accessToken,
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set('session', encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
}

export async function clearSession() {
  (await cookies()).delete('session');
}
