import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CustomFirebaseAdapter } from "@/lib/firebase/authAdapter";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
interface ExtendedSession extends DefaultSession {
  user: {
    uid: string;
    username?: string;
  } & DefaultSession["user"]
}

// Extend the built-in JWT types
interface ExtendedToken extends JWT {
  uid: string;
  username?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: CustomFirebaseAdapter(),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }): Promise<ExtendedToken> {
      if (user) {
        token.uid = user.uid || 'default-uid';
        token.username = user.username;
      }
      return token as ExtendedToken;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      if (session.user) {
        session.user.uid = token.uid;
        session.user.username = token.username;
      }
      return session as ExtendedSession;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 