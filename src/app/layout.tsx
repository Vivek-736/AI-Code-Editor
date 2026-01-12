// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { dark } from "@clerk/themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Orbit - AI Powered Cloud-based Code-Editor",
  description:
    "Orbit is an AI-powered cloud-based code editor that enhances your coding experience with intelligent features and code completion, with popular development tools.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        theme: dark
      }}
    >
      <html 
        lang="en" 
        suppressHydrationWarning={true}
      >
        <body 
          className={`${inter.variable} ${plexMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem
          >
            <header>
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-rose-500 text-white p-2 rounded">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}