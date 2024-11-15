import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...(process.env.NODE_ENV === 'development' 
      ? [
          CredentialsProvider({
            id: "development",
            name: "Development",
            credentials: {},
            async authorize(credentials, req): Promise<User> {
              return {
                id: "development-user",
                name: "Development User",
                email: "dev@example.com",
                image: "https://ui-avatars.com/api/?name=Dev+User",
                uid: "development-user",
                username: "developmentuser",
              };
            },
          }),
        ]
      : []),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.username = session.user.name
          ?.split(" ")
          .join("")
          .toLocaleLowerCase();

        session.user.uid = token.sub || 'development-user';
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
