import { fallbackPosts } from "@/lib/instagram";

export async function GET() {
  return new Response(
    JSON.stringify({ items: fallbackPosts }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}