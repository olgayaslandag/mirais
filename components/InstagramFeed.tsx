"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Instagram } from "lucide-react";
import { fallbackPosts, type InstaPost } from "@/lib/instagram";

const PROFILE_URL = "https://www.instagram.com/kayrametal/";

// Tarih etiketi: geçersiz/boş tarihlerde satır gizlenir
function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
            <h2 id="instagram-title">Instagram&apos;da Kayra Metal</h2>
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
            @KAYRAMETAL <ArrowRight size={16} />
          </a>
        </div>

        <div className="insta-grid" aria-live="polite">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
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
                  style={{ ["--reveal-delay" as string]: `${(i % 4) * 140}ms` }}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Instagram gönderisi: ${post.caption.slice(0, 80)}`}
                >
                  <div className="insta-image">
                    <img
                      src={post.image}
                      alt={post.caption.slice(0, 120) || "Kayra Metal Instagram gönderisi"}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="insta-badge" aria-hidden="true">
                      <Instagram size={18} />
                    </span>
                  </div>
                  <div className="insta-body">
                    <p>{post.caption || "@kayrametal"}</p>
                    {formatDate(post.timestamp) && (
                      <time dateTime={post.timestamp}>
                        {formatDate(post.timestamp)}
                      </time>
                    )}
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
