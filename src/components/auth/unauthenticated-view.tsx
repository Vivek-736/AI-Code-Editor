import Image from "next/image";
import { ShieldAlertIcon } from "lucide-react";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle
} from "@/components/ui/item";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const UnauthenticatedView = () => {
    return (
        <div className="relative min-h-screen flex justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
            <div className="pointer-events-none absolute -left-10 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative z-10 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 shadow-lg">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white/10">
                                <Image
                                    src="/favicon.png"
                                    alt="Orbit icon"
                                    className="object-contain"
                                    width={400}
                                    height={400}
                                    priority
                                />
                            </div>
                            <span className="text-base font-semibold tracking-wide text-white">
                                Orbit
                            </span>
                        </div>

                        <p className="max-w-md text-sm text-muted-foreground">
                            Welcome to Orbit! An AI-Powered cloud code editor designed to elevate your coding experience.
                        </p>
                    </div>

                    <Item variant="muted" className="border-white/10 bg-white/5">
                        <ItemMedia variant="icon" className="bg-white/10 text-white">
                            <ShieldAlertIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="text-base font-semibold text-white">
                                Access required
                            </ItemTitle>
                            <ItemDescription className="text-sm text-slate-200/80">
                                You are not authorized to access this resource. Sign in to re-establish your credentials and continue.
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <SignInButton mode="modal">
                                <Button size="sm">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </ItemActions>
                    </Item>
                </div>
            </div>
        </div>
    )
}