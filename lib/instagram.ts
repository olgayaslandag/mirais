// Instagram veri katmanı: canlı API + yedek içerik
// Canlı akış için INSTAGRAM_ACCESS_TOKEN gerekir (bkz. .env.example).
// Token yoksa/geçersizse site yine de yedek gönderilerle ayakta kalır.

export type InstaPost = {
  id: string;
  caption: string;
  image: string;
  permalink: string;
  timestamp: string;
};

type RawMedia = {
  id: string;
  caption?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
};

const PROFILE_URL = "https://www.instagram.com/martor_world/";

// Token tanımlanmadan önce gösterilen yedek gönderiler
export const fallbackPosts: InstaPost[] = [
  {
    id: "martor-1",
    caption: "Martor'dan: Profesyonel seguridad kesici ürünlerimizden kareler — mühendislik ve kalite.",
    image: "/assets/img/instagram/martor-1.jpg",
    permalink: "https://www.instagram.com/p/DZ76QOjlnW2/",
    timestamp: "",
  },
  {
    id: "martor-2",
    caption: "Martor'dan: Yeni seri Knife-Hacks gösterme — pratik ve güvenli kesme çözümleri.",
    image: "/assets/img/instagram/martor-2.jpg",
    permalink: "https://www.instagram.com/p/Dfj2y8ND_X9/",
    timestamp: "",
  },
  {
    id: "martor-3",
    caption: "Martor'dan: Profesyonel paslanmaz çelik kesici keskinleştirme — törpü teknolojisi.",
    image: "/assets/img/instagram/martor-3.jpg",
    permalink: "https://www.instagram.com/p/DfW-0oAo7lT/",
    timestamp: "",
  },
  {
    id: "martor-4",
    caption: "Martor'dan: Ergonomic safety grip collection — güvenli ve rahat kesim deneyimi.",
    image: "/assets/img/instagram/martor-4.jpg",
    permalink: "https://www.instagram.com/p/DfR1OjzEcJu/",
    timestamp: "",
  },
  {
    id: "martor-5",
    caption: "Martor'dan: Professional training program — secure cutting techniques ve iş güvenliği.",
    image: "/assets/img/instagram/martor-5.jpg",
    permalink: "https://www.instagram.com/p/DfKpMAUiBeu/",
    timestamp: "",
  },
  {
    id: "martor-6",
    caption: "Martor'dan: R&D innovation showcase — yeni güvenlik kesici teknolojileri.",
    image: "/assets/img/instagram/martor-6.jpg",
    permalink: "https://www.instagram.com/p/DfKADUIjvI1/",
    timestamp: "",
  },
];

// Ham Graph API yanıtını kart modeline indirger
export function normalizeMedia(item: RawMedia): InstaPost | null {
  const image =
    item.media_type === "VIDEO"
      ? (item.thumbnail_url ?? item.media_url)
      : item.media_url;
  if (!item.id || !image || !item.permalink) return null;
  return {
    id: item.id,
    caption: item.caption ?? "",
    image,
    permalink: item.permalink,
    timestamp: item.timestamp ?? "",
  };
}

export async function fetchLivePosts(
  token: string,
  limit = 12
): Promise<InstaPost[]> {
  const params = new URLSearchParams({
    fields: "id,caption,media_url,media_type,thumbnail_url,permalink,timestamp",
    limit: String(limit),
    access_token: token,
  });
  const res = await fetch(`https://graph.instagram.com/me/media?${params}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`instagram-api-${res.status}`);
  const json = (await res.json()) as { data?: RawMedia[] };
  return (json.data ?? [])
    .map(normalizeMedia)
    .filter((p): p is InstaPost => p !== null)
    .slice(0, limit);
}
