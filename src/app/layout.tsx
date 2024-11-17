import { getServerSession } from "next-auth";
import Login from "@/components/Login";
import SessionProvider from "@/components/SessionProvider";
import { authOptions } from "./api/auth/authOptions";
import Providers from "@/components/Providers";
import RootLayoutClient from "@/components/RootLayoutClient";
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'ChatGPT Messenger',
  description: 'ChatGPT Clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className={montserrat.className}>
        <Providers>
          <SessionProvider session={session}>
            {!session && !isDevelopment ? (
              <Login />
            ) : (
              <RootLayoutClient 
                session={session} 
                isDevelopment={isDevelopment}
              >
                {children}
              </RootLayoutClient>
            )}
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
