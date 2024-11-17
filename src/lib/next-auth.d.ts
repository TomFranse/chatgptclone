import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uid: string;
      username?: string;
    } & DefaultSession["user"]
  }

  interface User {
    uid: string;
    username?: string;
    email: string;
    name?: string;
    image?: string;
    emailVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    username?: string;
  }
}
