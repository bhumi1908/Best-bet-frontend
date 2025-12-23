import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContextProvider } from "@/components/providers/UserContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Bet - Pick 3 Predictions & Draw History",
  description: "The Most Accurate Pick 3 Predictions On The Planet! Real-time draw history and live predictions daily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-white`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <SessionProvider >
            <UserContextProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="dark-toast"
              />
            </UserContextProvider>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}




//! middleware in routing
//! complete auth flow