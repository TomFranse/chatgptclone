import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CustomFirebaseAdapter } from "@/lib/firebase/authAdapter";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: CustomFirebaseAdapter(),
  session: {
    strategy: 'jwt'
  },
}; 