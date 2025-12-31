// /**
//  * NextAuth Type Extensions
//  * Extends NextAuth types to include custom properties
//  */

import "next-auth";
import "next-auth/jwt";
import { UserRole } from "./auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    error?: string;
    user: {
      id: string;
      role: UserRole;
      firstName: string;
      lastName: string;
      phoneNo: string;
    } & DefaultSession["user"];
  }


  interface User {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phoneNo: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    firstName: string;
    lastName: string;
    phoneNo: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}