import { getServerSession } from "next-auth";
import Login from "@/components/Login";
import SessionProvider from "@/components/SessionProvider";
import { authOptions } from "./api/auth/authOptions";
import Providers from "@/components/Providers";
import RootLayoutClient from "@/components/RootLayoutClient";
import { Metadata } from 'next';

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
    <html lang="en">
      <body>
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
