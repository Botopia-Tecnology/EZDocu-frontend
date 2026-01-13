import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getSession } from '@/lib/auth/session';
import { AuthProvider } from '@/lib/auth/auth-context';


export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Parse user from session. In a real app we might want to decode the accessToken here
  // to get the latest roles/accounts, but for now we trust what's in the session object
  // or we can decode session.accessToken if available.

  // Assuming session.user contains basics. 
  // If we want roles, we need to extract them from accessToken potentially.
  // Let's assume for this step we map session.user to AuthContext User roughly.
  // We might need to enhance getSession or just pass what we have.

  // TODO: Decode accessToken to get real roles if not in user object
  const user = session?.user ? {
    ...session.user,
    id: String(session.user.id), // Ensure string
    roles: [], // Placeholder until we decode token
    accounts: [] // Placeholder
  } : null;

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <AuthProvider user={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
