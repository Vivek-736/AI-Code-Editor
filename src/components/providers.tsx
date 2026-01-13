"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider } from "./theme-provider";
import { UnauthenticatedView } from "./auth/unauthenticated-view";
import { AuthLoadingView } from "./auth/auth-loading-view";

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
                    <Authenticated>
                        {children}
                    </Authenticated>
                    <Unauthenticated>
                        <UnauthenticatedView />
                    </Unauthenticated>
                    <AuthLoading>
                        <AuthLoadingView />
                    </AuthLoading>
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
};