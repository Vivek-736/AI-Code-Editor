import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
    return (
        <nav className="flex justify-between items-center gap-x-2 p-2 bg-sidebar border-b">
            <div className="flex items-center gap-x-2">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink className="flex items-center gap-1.5" asChild>
                            <Button 
                                variant={"ghost"}
                                className="w-fit! p-1.5! h-10!"
                                asChild
                            >
                                <Link href={"/"}>
                                    <Image 
                                        src={"/favicon.svg"}
                                        alt="Favicon Orbit"
                                        width={32}
                                        height={32}
                                    />
                                    <span className={cn("text-2xl font-medium text-white", font.className)}>
                                        Orbit
                                    </span>
                                </Link>
                            </Button>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
        </nav>
    )
}

export default Navbar;
