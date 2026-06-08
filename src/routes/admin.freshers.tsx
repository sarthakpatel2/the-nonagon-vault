import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Upload, Loader2, Check, Trash2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { crew, type CrewMember } from "@/lib/crew";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/freshers")({
  head: () => ({
    meta: [
      { title: "Admin — Freshers Photos" },
      { name: "description", content: "Upload freshers photos for each friend." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminFreshersPage,
});

type Row = { friend_slug: string; image_url: string };

function AdminFreshersPage() {
  const [rows, setRows] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("freshers_photos").select("friend_slug,image_url");
    if (error) {
      console.error(error);
      toast.error("Couldn't load freshers photos");
    } else {
      const map: Record<string, string> = {};
      (data as Row[] | null)?.forEach((r) => (map[r.friend_slug] = r.image_url));
      setRows(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-10 max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          Admin / Freshers uploads
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2rem,5vw,3.5rem)]">
          Freshers <span className="italic text-brand">vs</span> Final year.
        </h1>
        <p className="mt-4 max-w-xl text-charcoal/70">
          Drop a freshers-year photo for each friend. It auto-wires into the before/after slider on the yearbook page.
        </p>
      </header>

      <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center gap-2 text-charcoal/60 font-mono text-xs">
            <Loader2 className="w-4 h-4 animate-spin" /> loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {crew.map((m) => (
              <FriendUploadCard
                key={m.slug}
                member={m}
                freshersUrl={rows[m.slug]}
                onChange={load}
              />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

function FriendUploadCard({
  member,
  freshersUrl,
  onChange,
}: {
  member: CrewMember;
  freshersUrl?: string;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Pick an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `freshers/${member.slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: insErr } = await supabase
        .from("freshers_photos")
        .upsert(
          { friend_slug: member.slug, image_url: urlData.publicUrl, updated_at: new Date().toISOString() },
          { onConflict: "friend_slug" },
        );
      if (insErr) throw insErr;
      toast.success(`${member.name} — freshers photo saved`);
      onChange();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setPreview(null);
      URL.revokeObjectURL(localUrl);
    }
  };

  const remove = async () => {
    if (!freshersUrl) return;
    if (!confirm(`Remove freshers photo for ${member.name}?`)) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("freshers_photos").delete().eq("friend_slug", member.slug);
      if (error) throw error;
      toast.success("Removed");
      onChange();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't remove");
    } finally {
      setBusy(false);
    }
  };

  const beforeSrc = preview || freshersUrl;

  return (
    <div className="border border-charcoal/15 rounded-xl p-4 bg-paper">
      <div className="flex items-center gap-3 mb-4">
        <img src={member.photo} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="font-serif text-base leading-tight truncate">{member.name}</p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/50 truncate">
            {member.slug}
          </p>
        </div>
        {freshersUrl && !busy && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-emerald-700">
            <Check className="w-3 h-3" /> set
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-charcoal/50 mb-1">Freshers</p>
          <div className="aspect-[4/5] bg-charcoal/5 rounded overflow-hidden grid place-items-center">
            {beforeSrc ? (
              <img src={beforeSrc} alt="freshers" className="w-full h-full object-cover" />
            ) : (
              <span className="text-charcoal/40 font-mono text-[10px]">none yet</span>
            )}
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-charcoal/50 mb-1">Final</p>
          <div className="aspect-[4/5] bg-charcoal/5 rounded overflow-hidden">
            <img src={member.photo} alt="final year" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <label
          className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 font-mono text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-colors ${
            busy ? "bg-charcoal/20 text-charcoal/50" : "bg-brand text-paper hover:bg-charcoal"
          }`}
        >
          {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {busy ? "uploading…" : freshersUrl ? "replace" : "upload"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {freshersUrl && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            aria-label="Remove freshers photo"
            className="px-3 py-2 border border-charcoal/20 text-charcoal/70 hover:bg-charcoal/5 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
