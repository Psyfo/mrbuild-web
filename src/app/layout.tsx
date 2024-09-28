import "leaflet/dist/leaflet.css";
import "./globals.css";
import Head from "next/head";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mr Build',
  description: 'Mr Build Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Aleo:wght@400;700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body>{children}</body>
    </html>
  );
}
