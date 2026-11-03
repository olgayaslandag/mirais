"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * YouTube facade: kullanıcı tıklamadan video yüklenmez.
 * Üçüncü taraf çerez uyumu için gerekli, ancak isteğe bağlı davranış.
 */
export default function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [active, setActive] = useState(false);

  if (!videoId) return null;

  if (active) {
    return (
      <div className="video-embed">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="video-facade"
      onClick={() => setActive(true)}
      aria-label={`${title} (video oynat)`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className="video-facade__play" aria-hidden="true">
        <Play size={22} />
      </span>
    </button>
  );
}
