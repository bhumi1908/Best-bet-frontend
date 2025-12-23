// /**
//  * Axios Instance
//  * Configured axios client with interceptors for authentication and error handling
//  */

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach access token
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();


  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

// Handle expired session
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: "/auth/login" });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
