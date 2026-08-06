import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Upload, Loader2, X, Trash2, Play, Camera, Image as ImageIcon } from "lucide-react";
import { VideoViewer } from "@/components/video-viewer";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureVideoThumbnail, captureFrameFromElement } from "@/lib/video-thumb";
import { uploadResumable } from "@/lib/resumable-upload";
import { ThumbCropper } from "@/components/thumb-cropper";
import { DEFAULT_CROP, renderCroppedThumb, type CropState } from "@/lib/thumb-crop";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — The Nonagon Reel" },
      {
        name: "description",
        content:
          "Shaky clips, terrible singing and unplanned chaos — the video reel of nine friends and four years of college.",
      },
      { property: "og:title", content: "Videos — The Nonagon Reel" },
      {
        property: "og:description",
        content: "Shaky clips, terrible singing and unplanned chaos from four years of college.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideosPage,
});

type VideoRow = {
  id: string;
  video_url: string;
  title: string;
  caption: string;
  poster_url: string | null;
  created_at: string;
};

const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

function VideosPage() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);


  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Couldn't load the reel");
    } else {
      setVideos((data ?? []) as VideoRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (v: VideoRow) => {
    if (!confirm(`Delete "${v.title || "this clip"}"?`)) return;
    const { error } = await supabase.from("videos").delete().eq("id", v.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Clip removed");
    load();
  };

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-10 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          06 / The Reel
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.2rem,7vw,5.5rem)] text-balance">
          Moving pictures, <span className="italic text-brand">terrible singing</span>.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Photos freeze it. Videos replay it — the laughs, the noise, the bad camera work.
        </p>

        <button
          onClick={() => setShowUpload(true)}
          className="mt-8 inline-flex items-center gap-2 bg-brand text-paper px-5 py-3 font-mono text-xs tracking-[0.25em] uppercase hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add a video
        </button>
      </header>

      <section className="px-4 md:px-10 pb-24 max-w-7xl mx-auto">
        {loading ? (
          <div className="py-20 grid place-items-center text-charcoal/50">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <p className="py-16 text-center font-hand text-2xl text-charcoal/50">
            No clips yet. Be the first to embarrass everyone.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {videos.map((v) => (
              <figure key={v.id} className="group relative paper-card p-3 pb-6">
                <span
                  className="tape left-1/2 -translate-x-1/2 -top-3 w-20 h-5 rotate-[-3deg]"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => setActiveId(v.id)}
                  aria-label={`Play ${v.title || "clip"}`}
                  className="relative block w-full aspect-video bg-charcoal/90 overflow-hidden rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {v.poster_url ? (
                    <img
                      src={v.poster_url}
                      alt={v.title || "Video thumbnail"}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video
                      src={v.video_url}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-charcoal/20 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity">
                    <span className="grid place-items-center w-14 h-14 rounded-full bg-paper/90 text-charcoal">
                      <Play className="w-6 h-6 translate-x-[1px]" />
                    </span>
                  </span>
                </button>

                <figcaption className="mt-4 px-1">
                  <p className="font-hand text-xl leading-tight text-charcoal">
                    {v.title || "Untitled clip"}
                  </p>
                  {v.caption && (
                    <p className="mt-1 text-sm text-charcoal/60">{v.caption}</p>
                  )}
                </figcaption>
                <button
                  onClick={() => remove(v)}
                  aria-label="Delete video"
                  className="absolute top-4 right-4 grid place-items-center w-9 h-9 rounded-full bg-paper/80 text-charcoal/70 hover:bg-brand hover:text-paper transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </figure>
            ))}
          </div>
        )}
      </section>

      {activeId && (
        <VideoViewer
          videos={videos}
          activeId={activeId}
          onSelect={setActiveId}
          onClose={() => setActiveId(null)}
        />
      )}


      {showUpload && (
        <UploadDialog
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
            load();
          }}
        />
      )}

      <SiteFooter />
    </main>
  );
}

function UploadDialog({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [thumb, setThumb] = useState<{ blob: Blob; url: string } | null>(null);
  const [thumbSource, setThumbSource] = useState<"auto" | "frame" | "custom">("auto");
  const [crop, setCrop] = useState<CropState>(DEFAULT_CROP);
  const [thumbing, setThumbing] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    return () => {
      if (thumb) URL.revokeObjectURL(thumb.url);
    };
  }, [thumb]);

  const applyThumb = (blob: Blob, source: "auto" | "frame" | "custom") => {
    setThumb((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { blob, url: URL.createObjectURL(blob) };
    });
    setThumbSource(source);
    setCrop(DEFAULT_CROP);
  };

  const onFile = async (f: File | null) => {
    if (f && f.size > MAX_BYTES) {
      toast.error("That clip is over 500 MB — trim it a bit first");
      return;
    }
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
    if (thumb) URL.revokeObjectURL(thumb.url);
    setThumb(null);
    setThumbSource("auto");
    if (!f) return;

    setThumbing(true);
    const shot = await captureVideoThumbnail(f);
    setThumbing(false);
    if (shot) applyThumb(shot.blob, "auto");
  };

  const useCurrentFrame = async () => {
    const el = videoRef.current;
    if (!el) return;
    setThumbing(true);
    const blob = await captureFrameFromElement(el);
    setThumbing(false);
    if (!blob) {
      toast.error("Couldn't grab that frame — try another moment");
      return;
    }
    applyThumb(blob, "frame");
    toast.success("Thumbnail set from this frame");
  };

  const onCustomImage = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Pick an image file");
      return;
    }
    applyThumb(f, "custom");
    toast.success("Custom thumbnail set");
  };


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Pick a video first");
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const id = crypto.randomUUID();
      const ext = file.name.split(".").pop() || "mp4";

      setStage("Uploading video");
      const videoUrl = await uploadResumable(
        "gallery",
        `videos/${id}.${ext}`,
        file,
        setProgress,
      );

      let posterUrl: string | null = null;
      const raw = thumb?.blob ?? (await captureVideoThumbnail(file))?.blob ?? null;
      if (raw) {
        setStage("Saving thumbnail");
        const shot = await renderCroppedThumb(raw, crop);
        try {
          posterUrl = await uploadResumable("gallery", `videos/${id}-poster.jpg`, shot);
        } catch (thumbErr) {
          console.warn("[thumbnail] upload failed", thumbErr);
        }
      }

      const { error: insErr } = await supabase.from("videos").insert({
        video_url: videoUrl,
        poster_url: posterUrl,
        title: title.trim().slice(0, 120),
        caption: caption.trim().slice(0, 280),
      });
      if (insErr) throw insErr;
      toast.success("Clip added to the reel!");
      onUploaded();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setStage("");
    }
  };


  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-charcoal/90 backdrop-blur-sm grid place-items-center p-4 animate-reveal overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="paper-card p-6 pb-8 max-w-md w-full relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full hover:bg-charcoal/10 text-charcoal"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-2">
          Add to the reel
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-5">Upload a video</h2>

        <label className="block">
          <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60">
            Video (max 500 MB)
          </span>
          <div className="mt-2 border-2 border-dashed border-charcoal/20 hover:border-brand transition-colors aspect-video w-full overflow-hidden bg-charcoal/5 grid place-items-center cursor-pointer">
            {preview ? (
              <video
                ref={videoRef}
                src={preview}
                controls
                playsInline
                crossOrigin="anonymous"
                onClick={(e) => e.preventDefault()}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-charcoal/50 font-mono text-xs">
                <Upload className="w-6 h-6 mx-auto mb-2" />
                Click to choose a video
              </div>
            )}
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </label>

        {file && (
          <div className="mt-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60">
              Cover thumbnail
            </span>
            <div className="mt-2">
              {thumbing ? (
                <div className="w-full aspect-video bg-charcoal/10 grid place-items-center rounded-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-charcoal/50" />
                </div>
              ) : thumb ? (
                <ThumbCropper src={thumb.url} crop={crop} onChange={setCrop} />
              ) : (
                <div className="w-full aspect-video bg-charcoal/10 grid place-items-center rounded-sm text-charcoal/40">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={useCurrentFrame}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-charcoal/25 hover:border-brand hover:text-brand px-3 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                Use current frame
              </button>
              <label className="flex-1 inline-flex items-center justify-center gap-2 border border-charcoal/25 hover:border-brand hover:text-brand px-3 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer">
                <ImageIcon className="w-3.5 h-3.5" />
                Upload an image
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => onCustomImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-widest uppercase text-charcoal/45">
              {thumbing
                ? "Grabbing a frame…"
                : thumbSource === "custom"
                  ? "Custom image — drag & zoom to frame it"
                  : thumbSource === "frame"
                    ? "Picked frame — drag & zoom to frame it"
                    : "Auto-picked — scrub the video, pick a frame, then drag to frame it"}
            </p>
          </div>
        )}


        <label className="block mt-4">
          <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60">
            Title
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="e.g. Canteen dance-off"
            className="mt-1 w-full bg-transparent border-b border-charcoal/30 focus:border-brand outline-none font-hand text-xl py-1"
          />
        </label>

        <label className="block mt-4">
          <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60">
            Caption
          </span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={280}
            placeholder="Set the scene…"
            className="mt-1 w-full bg-transparent border-b border-charcoal/30 focus:border-brand outline-none text-sm py-2"
          />
        </label>

        {busy && (
          <div className="mt-5">
            <div className="h-1.5 w-full bg-charcoal/10 overflow-hidden rounded-full">
              <div
                className="h-full bg-brand transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-widest uppercase text-charcoal/50">
              {stage} · {progress}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !file}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-brand text-paper px-5 py-3 font-mono text-xs tracking-[0.25em] uppercase disabled:opacity-50 hover:bg-charcoal transition-colors"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {busy ? "Uploading…" : "Add to reel"}
        </button>
      </form>
    </div>
  );
}
