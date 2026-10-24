"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Instagram } from "lucide-react";
import { fallbackPosts, type InstaPost } from "@/lib/instagram";

const PROFILE_URL = "https://www.instagram.com/mirais/";

// Instagram akışı: canlı API, yoksa yedek gönderiler
export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/instagram")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { items?: InstaPost[] } | null) => {
        if (!cancelled && json?.items?.length) setPosts(json.items);
      })
      .catch(() => {
        // Hata durumunda yedek gönderiler ekranda kalır
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="section instagram"
      id="instagram"
      aria-labelledby="instagram-title"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-left">
            <p className="eyebrow">SOSYAL MEDYA</p>
            <h2 id="instagram-title">Instagram&apos;da MİRAİS</h2>
            <p className="section-desc">
              Üretimden, projelerden ve fabrika yaşamından güncel kareler
              için bizi takip edin.
            </p>
          </div>
          <a
            className="text-link"
            href={PROFILE_URL}
            target="_blank"
            rel="noopener"
          >
            @MIRAİS <ArrowRight size={16} />
          </a>
        </div>

        <div className="insta-grid" aria-live="polite">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="insta-card insta-skeleton"
                  aria-hidden="true"
                />
              ))
            : posts.map((post, i) => (
                <a
                  key={post.id}
                  className="insta-card reveal"
                  data-reveal="deal"
                  style={{ ["--reveal-delay" as string]: `${(i % 6) * 140}ms` }}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Instagram gönderisi: ${post.caption.slice(0, 80)}`}
                >
                  <div className="insta-image">
                    <img
                      src={post.image}
                      alt={post.caption.slice(0, 120) || "Mira İş Sağlığı ve Güvenliği Ekipmanları Instagram gönderisi"}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="insta-badge" aria-hidden="true">
                      <Instagram size={18} />
                    </span>
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
