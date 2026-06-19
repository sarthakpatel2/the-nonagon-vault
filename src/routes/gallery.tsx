import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus, Upload, Loader2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { photos as staticPhotos, pickRandomRotation, type Photo } from "@/lib/photos";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — The Polaroid Wall" },
      { name: "description", content: "A wall of polaroids from four years of college friendships, captured candidly." },
      { property: "og:title", content: "Gallery — The Polaroid Wall" },
      { property: "og:description", content: "A wall of polaroids from four years of college friendships." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [uploaded, setUploaded] = useState<Photo[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const photos: Photo[] = [...uploaded, ...staticPhotos];

  const loadUploaded = useCallback(async () => {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setUploaded(
      (data ?? []).map((row) => ({
        src: row.image_url,
        caption: row.caption || "Untitled",
        date: row.date_label || "NEW",
        rotate: row.rotate || "rotate-0",
      })),
    );
  }, []);

  useEffect(() => {
    loadUploaded();
  }, [loadUploaded]);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-10 max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          02 / The Gallery
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)] text-balance">
          A wall of <span className="italic text-brand">polaroids</span>,
          <br />stuck on with tape.
        </h1>
        <p className="mt-6 max-w-xl text-charcoal/70">
          Hover, tilt, click. Each one a tiny rectangle of a much bigger feeling.
        </p>

        <button
          onClick={() => setShowUpload(true)}
          className="mt-8 inline-flex items-center gap-2 bg-brand text-paper px-5 py-3 font-mono text-xs tracking-[0.25em] uppercase hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add a polaroid
        </button>
      </header>

      <section className="px-4 md:px-10 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 pt-12">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`group relative paper-card p-3 pb-12 ${p.rotate} hover:rotate-0 hover:scale-[1.04] hover:z-10 transition-all duration-500 ease-out text-left cursor-zoom-in`}
            >
              <span className="tape left-1/2 -translate-x-1/2 -top-3 w-20 h-5 rotate-[-3deg]" aria-hidden />
              <div className="w-full aspect-square overflow-hidden bg-charcoal/5 grid place-items-center">
                <img
                  src={p.src}
                  alt={p.caption}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="mt-4 px-1 flex justify-between items-end gap-2">
                <p className="font-hand text-xl leading-tight text-charcoal">{p.caption}</p>
                <span className="font-mono text-[9px] tracking-widest text-charcoal/40 shrink-0">{p.date}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active !== null && (
        <div
          onClick={close}
          className="fixed inset-0 z-[60] bg-charcoal/90 backdrop-blur-sm grid place-items-center p-4 md:p-6 animate-reveal"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-paper/10 hover:bg-brand text-paper hover:text-paper transition-colors border border-paper/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <figure
            onClick={(e) => e.stopPropagation()}
            className="paper-card p-4 pb-16 max-w-3xl w-full"
          >
            <img
              src={photos[active].src}
              alt={photos[active].caption}
              className="w-full max-h-[85vh] object-contain bg-charcoal/5"
            />
            <figcaption className="mt-5 px-2 flex justify-between items-end gap-4">
              <p className="font-hand text-xl md:text-3xl">{photos[active].caption}</p>
              <span className="font-mono text-xs text-charcoal/40 shrink-0">
                {photos[active].date} · {active + 1}/{photos.length}
              </span>
            </figcaption>
          </figure>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-paper/10 hover:bg-brand text-paper hover:text-paper transition-colors border border-paper/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={close}
            aria-label="Close preview"
            className="absolute top-5 right-5 grid place-items-center w-10 h-10 rounded-full bg-paper/10 hover:bg-brand text-paper border border-paper/20 font-mono text-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {showUpload && (
        <UploadDialog
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
            loadUploaded();
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
  const [caption, setCaption] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [busy, setBusy] = useState(false);

  const onFile = (f: File | null) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Pick a photo first");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: insErr } = await supabase.from("gallery_photos").insert({
        image_url: urlData.publicUrl,
        caption: caption.trim() || "Untitled",
        date_label: dateLabel.trim().toUpperCase() || "NEW",
        rotate: pickRandomRotation(),
      });
      if (insErr) throw insErr;
      toast.success("Polaroid pinned to the wall!");
      onUploaded();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-charcoal/90 backdrop-blur-sm grid place-items-center p-4 animate-reveal"
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
          Pin a new polaroid
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-5">Add a memory</h2>

        <label className="block">
          <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60">Photo</span>
          <div className="mt-2 border-2 border-dashed border-charcoal/20 hover:border-brand transition-colors aspect-square w-full overflow-hidden bg-charcoal/5 grid place-items-center cursor-pointer">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-charcoal/50 font-mono text-xs">
                <Upload className="w-6 h-6 mx-auto mb-2" />
                Click to choose an image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </label>

        <label className="block mt-4">
          <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60">Caption</span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={140}
            placeholder="Say something about this moment…"
            className="mt-1 w-full bg-transparent border-b border-charcoal/30 focus:border-brand outline-none font-hand text-xl py-1"
          />
        </label>

        <label className="block mt-4">
          <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/60">Date / Label</span>
          <input
            type="text"
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            maxLength={24}
            placeholder="e.g. 15 SEP 2024 or FAREWELL"
            className="mt-1 w-full bg-transparent border-b border-charcoal/30 focus:border-brand outline-none font-mono text-sm uppercase tracking-widest py-1"
          />
        </label>

        <button
          type="submit"
          disabled={busy || !file}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-brand text-paper px-5 py-3 font-mono text-xs tracking-[0.25em] uppercase disabled:opacity-50 hover:bg-charcoal transition-colors"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {busy ? "Pinning…" : "Pin to wall"}
        </button>
      </form>
    </div>
  );
}
