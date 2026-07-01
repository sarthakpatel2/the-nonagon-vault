import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AdminPasskeyGate } from "@/components/admin-passkey-gate";
import { supabase } from "@/integrations/supabase/client";
import { crew, type CrewMember } from "@/lib/crew";
import {
  FILTER_CSS,
  FILTER_LABELS,
  type AvatarFilter,
  useCrewAvatars,
  defaultAvatarFor,
} from "@/lib/crew-avatars";

export const Route = createFileRoute("/admin/avatars")({
  head: () => ({
    meta: [
      { title: "Admin — Crew avatars" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminAvatarsGated,
});

function AdminAvatarsGated() {
  return (
    <AdminPasskeyGate>
      <AdminAvatarsPage />
    </AdminPasskeyGate>
  );
}

function AdminAvatarsPage() {
  const avatars = useCrewAvatars();
  return (
    <main className="min-h-screen bg-paper text-charcoal">
      <SiteNav />
      <header className="px-6 md:px-10 pt-12 pb-6 max-w-6xl mx-auto flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-3">
            Admin // Avatars
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight italic">
            Every face, <span className="text-brand">framed</span>.
          </h1>
          <p className="text-charcoal/60 mt-3 max-w-xl">
            Upload a fresh photo for each friend, then drag to reframe, zoom, and pick a filter.
            Changes ripple to the yearbook and profile pages instantly.
          </p>
        </div>
        <Link
          to="/admin/freshers"
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/60 hover:text-brand"
        >
          → Manage then/now photos
        </Link>
      </header>

      <section className="px-6 md:px-10 py-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {crew.map((m) => (
          <AvatarEditorCard key={m.slug} member={m} initial={avatars[m.slug] ?? defaultAvatarFor(m)} />
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}

type Draft = {
  src: string;
  crop_x: number;
  crop_y: number;
  crop_scale: number;
  filter: AvatarFilter;
  isCustom: boolean;
};

function AvatarEditorCard({
  member,
  initial,
}: {
  member: CrewMember;
  initial: {
    src: string;
    crop_x: number;
    crop_y: number;
    crop_scale: number;
    filter: AvatarFilter;
    isCustom: boolean;
  };
}) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Reset when incoming data changes AND we haven't been edited yet.
  useEffect(() => {
    if (!dirty) setDraft(initial);
  }, [initial, dirty]);

  const style = useMemo(
    () => ({
      objectPosition: `${draft.crop_x}% ${draft.crop_y}%`,
      transform: draft.crop_scale > 1 ? `scale(${draft.crop_scale})` : undefined,
      transformOrigin: `${draft.crop_x}% ${draft.crop_y}%`,
      filter: FILTER_CSS[draft.filter],
    }),
    [draft],
  );

  const update = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Not an image");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Over 8 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `avatars/${member.slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      update({ src: urlData.publicUrl, isCustom: true, crop_x: 50, crop_y: 50, crop_scale: 1 });
      toast.success("Uploaded — now reframe & save");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        slug: member.slug,
        image_url: draft.src,
        crop_x: draft.crop_x,
        crop_y: draft.crop_y,
        crop_scale: draft.crop_scale,
        filter: draft.filter,
      };
      const { error } = await supabase
        .from("crew_avatars" as never)
        .upsert(payload as never, { onConflict: "slug" });
      if (error) throw error;
      setDirty(false);
      toast.success(`${member.name} saved`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm(`Reset ${member.name}'s avatar to the bundled default?`)) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("crew_avatars" as never)
        .delete()
        .eq("slug", member.slug);
      if (error) throw error;
      setDraft({
        src: member.photo,
        crop_x: 50,
        crop_y: 50,
        crop_scale: 1,
        filter: "none",
        isCustom: false,
      });
      setDirty(false);
      toast.success("Reset to default");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  // Drag-to-reframe on the preview
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    update({
      crop_x: Math.max(0, Math.min(100, x)),
      crop_y: Math.max(0, Math.min(100, y)),
    });
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <article className="border border-charcoal/15 rounded-2xl p-5 bg-white">
      <header className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="font-serif text-2xl italic">{member.name}</h2>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50">
            {member.role}
          </p>
        </div>
        <span
          className={`font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-full ${
            draft.isCustom ? "bg-brand/10 text-brand" : "bg-charcoal/5 text-charcoal/50"
          }`}
        >
          {draft.isCustom ? "Custom" : "Default"}
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-5">
        {/* Preview */}
        <div>
          <div
            ref={frameRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative w-full aspect-square rounded-2xl overflow-hidden border border-charcoal/15 bg-charcoal/5 cursor-grab active:cursor-grabbing touch-none select-none"
            title="Drag to reframe"
          >
            <img
              src={draft.src}
              alt={member.name}
              draggable={false}
              style={style}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 pointer-events-none border border-white/40 mix-blend-difference rounded-2xl" />
          </div>
          <p className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/50 text-center">
            Drag preview to reframe
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 block mb-2">
              New photo
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
              className="block w-full text-xs file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-charcoal file:text-paper file:font-mono file:text-[10px] file:tracking-[0.2em] file:uppercase file:cursor-pointer"
            />
            {uploading && <p className="mt-1 text-xs text-charcoal/60">Uploading…</p>}
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 block mb-2">
              Zoom {draft.crop_scale.toFixed(2)}×
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={draft.crop_scale}
              onChange={(e) => update({ crop_scale: parseFloat(e.target.value) })}
              className="w-full accent-brand"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal/50 block mb-2">
              Filter
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(FILTER_LABELS) as AvatarFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => update({ filter: f })}
                  className={`font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border transition ${
                    draft.filter === f
                      ? "bg-brand text-white border-brand"
                      : "border-charcoal/20 text-charcoal/70 hover:border-brand hover:text-brand"
                  }`}
                >
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              className="font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full bg-brand text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(initial);
                setDirty(false);
              }}
              disabled={!dirty}
              className="font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-charcoal/20 text-charcoal/70 disabled:opacity-40 hover:border-brand hover:text-brand transition"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={reset}
              className="ml-auto font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
