import { NextResponse } from "next/server";
import { fallbackPosts, fetchLivePosts } from "@/lib/instagram";

// Akış verisi saatlik önbellekle sunulur (Instagram kotasını korumak için)
export const revalidate = 3600;

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  // Token tanımlı değilse yedek içerik dön, sayfa boş kalmasın
  if (!token) {
    return NextResponse.json({ source: "fallback", items: fallbackPosts });
  }

  try {
    const items = await fetchLivePosts(token);
    if (items.length === 0) throw new Error("instagram-empty");
    return NextResponse.json({ source: "live", items });
  } catch {
    return NextResponse.json({ source: "fallback", items: fallbackPosts });
  }
}
