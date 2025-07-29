import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Lulu Diary',
  description: 'Mi diario personal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav className="bg-indigo-600 text-white p-4 flex space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
          <Link href="/diary" className="hover:underline">
            Diary
          </Link>
        </nav>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
