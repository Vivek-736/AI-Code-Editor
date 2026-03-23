import { NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
        
        const scrapeResult = await app.scrapeUrl(url, { formats: ["markdown"] });

        if (!scrapeResult.success) {
            return NextResponse.json({ error: "Failed to scrape URL", details: scrapeResult.error }, { status: 500 });
        }

        return NextResponse.json({ data: scrapeResult.markdown });
    } catch (error) {
        console.error("Firecrawl scraping error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}