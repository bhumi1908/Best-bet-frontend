// /**
//  * NextAuth API Route
//  * Credentials provider configuration for NextAuth
//  */

// import NextAuth, { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { apiClient } from '@/utilities/axios/instance';
// import { LoginCredentials, AuthResponse } from '@/types/auth';
// import { cookies } from 'next/headers';

// /**
//  * NextAuth configuration
//  */
// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Email and password are required');
//         }

//         try {

//           // Call your API to authenticate user
//           const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', {
//             email: credentials.email,
//             password: credentials.password,
//           } as LoginCredentials);

//           const data = response.data.data;


//           // if (!data || !data.user) return null;
//           const cookieStore = await cookies();

//           cookieStore.set('accessToken', data.token.accessToken, {
//             httpOnly: true,
//             path: '/',
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',

//           });

//           // Refresh token cookie (if your API returns it)
//           if (data.token.refreshToken) {
//             cookieStore.set('refreshToken', data.token.refreshToken, {
//               httpOnly: true,
//               path: '/',
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'lax',
//             });
//           }

//           return {
//             id: data.user.id,
//             email: data.user.email,
//             name: `${data.user.firstName} ${data.user.lastName}`,
//             role: data.user.role || 'USER',
//             accessToken: data.token.accessToken,
//           };
//         } catch (error: any) {
//           const errorMessage =
//             error.response?.data?.message || 'Invalid credentials';
//           throw new Error(errorMessage);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       // Initial sign in
//       if (user) {
//         token.accessToken = (user as any).accessToken;
//         token.id = user.id;
//         token.role = (user as any).role || 'USER';
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Send properties to the client
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role || 'USER';
//         (session as any).accessToken = token.accessToken;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/login',
//     error: '/auth/login',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };



import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AuthRefreshResponse, AuthResponse, UserRole } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { routes } from "@/utilities/routes";
import { signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

async function refreshAccessToken(data: any) {
  try {
    const response = await axios.post<AuthRefreshResponse>(
      `${API_URL}${routes.api.auth.refreshToken}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${data.refreshToken}`,
        },
      }
    );

    const decoded = jwtDecode<DecodedToken>(
      response.data.data.accessToken
    );

    data.accessToken = response.data.data.accessToken;
    data.accessTokenExpires = decoded.exp * 1000;
    data.refreshToken = data.refreshToken;


    return data;
  } catch (error) {
    console.error("Refresh token failed", error);
    data.error = "RefreshAccessTokenError";
    await signOut({ callbackUrl: "/auth/login" });
    return data;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) return null;

          const res = await axios.post<{ data: AuthResponse }>(
            `${API_URL}/auth/login`,
            credentials
          );

          const data = res.data.data;
          const decoded: { exp: number } = jwtDecode(data.token.accessToken);

          return {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            role: data.user.role ?? 'USER',
            accessToken: data.token.accessToken,
            refreshToken: data.token.refreshToken,
            accessTokenExpires: decoded.exp,
          };
        }
        catch (error: any) {
          const message =
            error.response?.data?.message || 'Login failed. Please try again.';
          throw new Error(message);
        }
      }
    },
    ),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {

      // Initial login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;

        return token;
      }

      if (trigger === "update" && session?.user) {
        token.firstName = session.user.firstName;
        token.lastName = session.user.lastName;
      }

      // Access token still valid
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - 30000
      ) {
        return token;
      }

      // Access token expired → refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as UserRole,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
      };

      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;

      return session;
    }


  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
