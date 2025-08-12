import './globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import SignOut from '../components/SignOut';
import ProfileLink from '../components/ProfileLink';

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token');
  const isLoggedIn = !!token;
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
          <ProfileLink />
          <Link href="/diary" className="hover:underline">Diary</Link>
          <Link href="/friends" className="hover:underline">Friends</Link>
          {isLoggedIn ? (
            <>
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
