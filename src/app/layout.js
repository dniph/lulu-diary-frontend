import './globals.css';

export const metadata = {
  title: 'Lulu Diary',
  description: 'Mi diario personal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
