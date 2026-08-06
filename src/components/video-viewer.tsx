import { useCallback, useEffect, useRef } from "react";
import { X, Play } from "lucide-react";
import { VideoSocial } from "@/components/video-social";

export type VideoItem = {
  id: string;
  video_url: string;
  title: string;
  caption: string;
  poster_url: string | null;
  created_at: string;
};

export function VideoViewer({
  videos,
  activeId,
  onSelect,
  onClose,
}: {
  videos: VideoItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const active = videos.find((v) => v.id === activeId);
  const videoRef = useRef<HTMLVideoElement>(null);

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = videos.findIndex((v) => v.id === activeId);
      if (i < 0) return;
      const next = videos[(i + dir + videos.length) % videos.length];
      if (next) onSelect(next.id);
    },
    [videos, activeId, onSelect],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, step]);

  useEffect(() => {
    // Pause any other media on the page (e.g. yearbook background music)
    document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((el) => {
      if (el !== videoRef.current && !el.paused) el.pause();
    });
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    el.load();
    void el.play().catch(() => {
      // autoplay with sound blocked — leave it paused so the user starts it with audio
    });
  }, [activeId]);


  if (!active) return null;
  const related = videos.filter((v) => v.id !== activeId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={active.title || "Video player"}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-charcoal/95 backdrop-blur-md animate-reveal overflow-y-auto"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="fixed top-4 right-4 z-10 grid place-items-center w-11 h-11 rounded-full bg-paper/10 text-paper hover:bg-brand transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="min-h-full w-full max-w-7xl mx-auto px-4 md:px-8 py-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start"
      >
        <div className="min-w-0">
          <video
            ref={videoRef}
            key={active.id}
            src={active.video_url}
            poster={active.poster_url ?? undefined}
            controls
            autoPlay
            playsInline
            className="w-full max-h-[72vh] bg-black object-contain rounded-sm shadow-2xl"
          />
          <h2 className="mt-5 font-hand text-[clamp(1.5rem,4vw,2.4rem)] leading-tight text-paper">
            {active.title || "Untitled clip"}
          </h2>
          {active.caption && (
            <p className="mt-2 max-w-2xl text-paper/70 text-sm md:text-base">{active.caption}</p>
          )}
          <p className="mt-3 font-mono text-[10px] tracking-[0.25em] uppercase text-paper/40">
            {new Date(active.created_at).toLocaleDateString()}
          </p>

          <VideoSocial key={active.id} videoId={active.id} tone="dark" />
        </div>

        {related.length > 0 && (
          <aside className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-paper/50 mb-4">
              More from the reel
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {related.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(v.id)}
                    className="group w-full flex gap-3 text-left p-2 rounded-sm hover:bg-paper/10 focus-visible:bg-paper/10 outline-none focus-visible:ring-2 focus-visible:ring-paper transition-colors"
                  >
                    <span className="relative w-28 shrink-0 aspect-video bg-paper/10 overflow-hidden rounded-sm grid place-items-center">
                      {v.poster_url ? (
                        <img
                          src={v.poster_url}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      <Play className="absolute w-5 h-5 text-paper drop-shadow opacity-80 group-hover:opacity-100" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-hand text-lg leading-tight text-paper truncate">
                        {v.title || "Untitled clip"}
                      </span>
                      {v.caption && (
                        <span className="block text-xs text-paper/60 line-clamp-2">{v.caption}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
