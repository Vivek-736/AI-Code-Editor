import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, HomeIcon, SearchIcon } from "lucide-react";
import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle
} from "@/components/ui/item";

export default function NotFound() {
    return (
        <div className="relative font-sans min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
            <div className="pointer-events-none absolute -left-10 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
                <div className="w-full max-w-2xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 shadow-lg">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white/10">
                                <Image
                                    src="/favicon.svg"
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

                        <div className="space-y-2">
                            <h1 className="text-8xl font-bold tracking-tighter text-white md:text-9xl">
                                404
                            </h1>
                            <p className="text-xl font-medium text-slate-200 md:text-2xl">
                                Lost in Space
                            </p>
                        </div>
                    </div>

                    <Item variant="muted" className="border-white/10 bg-white/5">
                        <ItemMedia variant="icon" className="bg-white/10 text-white">
                            <AlertCircleIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="text-base font-semibold text-white">
                                Page Not Found <span className="text-sm">: The page you are searching for is lost in the Orbit!</span>
                            </ItemTitle>
                        </ItemContent>
                    </Item>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link href="/">
                            <Button size="lg" className="w-full gap-2 sm:w-auto">
                                <HomeIcon className="h-4 w-4" />
                                Return Home
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button 
                                variant="outline" 
                                size="lg" 
                                className="w-full gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
                            >
                                <SearchIcon className="h-4 w-4" />
                                Browse Projects
                            </Button>
                        </Link>
                    </div>

                    <p className="text-center text-xs text-slate-400">
                        Error Code: <span className="font-mono">404_ORBIT_NOT_FOUND</span>
                    </p>
                </div>
            </div>
        </div>
    );
}