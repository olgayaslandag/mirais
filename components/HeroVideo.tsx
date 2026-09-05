"use client";

import { useEffect, useRef } from "react";

// YouTube IFrame Player API tip tanımı (resmi tip paketine bağımlı kalmamak için daraltılmış)
declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState?: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  mute: () => void;
  playVideo: () => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
  getIframe?: () => HTMLIFrameElement | null;
  setOption?: (module: string, option: string, value: unknown) => void;
};

// Altyazı kapatma: cc_load_policy tarayıcı tercihini ezemez,
// bu yüzden captions modülünün parçası boşaltılır
function disableCaptions(player: YTPlayer) {
  try {
    player.setOption?.("captions", "track", {});
  } catch {
    // desteklenmeyen ortamda yoksayılır
  }
}

// Arka plan videosu asla duraklatılmamalı: bu durumlara düşünce sessizce devam et
// UNSTARTED=-1, ENDED=0, PAUSED=2, CUED=5
const RESUME_STATES = new Set([-1, 0, 2, 5]);

// Üretilen iframe'i klavye odağından ve tıklamadan tamamen çıkar
function hardenIframe(player: YTPlayer) {
  try {
    const frame = player.getIframe?.() ?? document.getElementById("hero-yt");
    if (frame instanceof HTMLIFrameElement) {
      frame.setAttribute("tabindex", "-1");
      frame.setAttribute("aria-hidden", "true");
      frame.style.pointerEvents = "none";
    }
  } catch {
    // sertleştirme başarısızsa video yine de oynar
  }
}

// API betiği sayfaya tek kez eklenir, tüm Hero örnekleri aynı sözü paylaşır
let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no-window"));
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => {
      apiPromise = null;
      reject(new Error("youtube-api-load-failed"));
    };
    document.head.appendChild(tag);
    // Güvenlik supabı: API 8 sn içinde hazır olmazsa poster zeminde kal
    window.setTimeout(() => {
      if (!window.YT?.Player) {
        apiPromise = null;
        reject(new Error("youtube-api-timeout"));
      }
    }, 8000);
  });
  return apiPromise;
}

// Hero zemin videosu: iframe HTML'e gömülmez, JS ile YT Player olarak üretilir
export default function HeroVideo({ videoId }: { videoId: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const videoIdRef = useRef(videoId);
  videoIdRef.current = videoId;

  // Player'ı bir kez üret
  useEffect(() => {
    // Hareket azaltma tercihinde video hiç yüklenmez, poster zemin görünür
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;

    loadYouTubeApi()
      .then(() => {
        if (cancelled || !mountRef.current || !window.YT?.Player) return;
        playerRef.current = new window.YT.Player(mountRef.current, {
          videoId: videoIdRef.current,
          playerVars: {
            autoplay: 1,
            mute: 1,
            // Hiçbir oynatıcı arayüzü gösterme
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            cc_load_policy: 0,
            // Tek videoda sonsuz döngü için playlist şart
            loop: 1,
            playlist: videoIdRef.current,
          },
          events: {
            onReady: ({ target }) => {
              // Otomatik oynatma politikası için sesi kapatıp başlat
              target.mute();
              hardenIframe(target);
              disableCaptions(target);
              target.playVideo();
            },
            onStateChange: ({ data, target }) => {
              // PLAYING = 1: video değişimlerinde parça sıfırlanır, altyazıyı yine kapat
              if (data === 1) disableCaptions(target);
              // Duraklatma/ bitiş ekranı hiç belirmesin: anında oynatmaya dön
              if (RESUME_STATES.has(data)) target.playVideo();
            },
          },
        });
      })
      .catch(() => {
        // Yükleme başarısızsa sessizce poster zemine dönülür
        playerRef.current = null;
      });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // destroy sırasında hata yoksayılır
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slayt değişince iframe'i yeniden gömmeden aynı player'a yeni video yükle
  useEffect(() => {
    try {
      playerRef.current?.loadVideoById(videoId);
    } catch {
      // Player henüz hazır değilse ilk videoId ile kurulacaktır
    }
  }, [videoId]);

  return <div ref={mountRef} id="hero-yt" aria-hidden="true" />;
}
