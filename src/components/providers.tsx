"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider } from "./theme-provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            appearance={{
                layout: {
                    unsafe_disableDevelopmentModeWarnings: true,
                },
                theme: dark,
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                    enableSystem
                >
                    {children}
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
};