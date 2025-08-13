import './globals.css';
import Link from 'next/link';
import SignOut from '../components/SignOut';
import ProfileLink from '../components/ProfileLink';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList});
  const isLoggedIn = !!session;
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav className="bg-indigo-600 text-white p-4 flex space-x-4 font-pixel">
          <Link href="/" className="hover:underline">Home</Link>
          {isLoggedIn ? (
            <>
              <ProfileLink />
              <Link href="/diary" className="hover:underline">Diary</Link>
              <Link href="/friends" className="hover:underline">Friends</Link>
              <SignOut />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Register</Link>
            </>
          )}
        </nav>
        <main >{children}</main>
      </body>
    </html>
  );
}