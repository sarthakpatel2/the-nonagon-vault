import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Loader2, Trash2, Settings2, AlertTriangle, Plus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AdminPasskeyGate } from "@/components/admin-passkey-gate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { crew, type CrewMember } from "@/lib/crew";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/freshers")({
  head: () => ({
    meta: [
      { title: "Admin — Then vs Now" },
      { name: "description", content: "Upload then/now photos for each friend." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <AdminPasskeyGate>
      <AdminFreshersPage />
    </AdminPasskeyGate>
  ),
});

type Kind = "then" | "now";
type Item = { id: string; friend_slug: string; kind: Kind; image_url: string; sort_order: number };

function AdminFreshersPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("freshers_photo_items" as never)
      .select("id,friend_slug,kind,image_url,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.error(error);
      toast.error("Couldn't load photos");
    } else {
      setItems((data ?? []) as unknown as Item[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const byFriend = (slug: string, kind: Kind) =>
    items.filter((i) => i.friend_slug === slug && i.kind === kind);

  return (
    <main className="min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-10 pt-16 pb-10 max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4">
          Admin / Then vs Now
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2rem,5vw,3.5rem)]">
          Freshers <span className="italic text-brand">vs</span> Final year.
        </h1>
        <p className="mt-4 max-w-xl text-charcoal/70">
          Add as many Then and Now photos as you like per friend. The slider on the yearbook will pair them up in order.
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
              <FriendCard
                key={m.slug}
                member={m}
                thens={byFriend(m.slug, "then")}
                nows={byFriend(m.slug, "now")}
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

function FriendCard({
  member,
  thens,
  nows,
  onChange,
}: {
  member: CrewMember;
  thens: Item[];
  nows: Item[];
  onChange: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const thenCover = thens[0]?.image_url;
  const nowCover = nows[0]?.image_url;

  return (
    <div className="border border-charcoal/15 rounded-xl p-4 bg-paper">
      <div className="flex items-center gap-3 mb-4">
        <img src={member.photo} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-base leading-tight truncate">{member.name}</p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/50 truncate">
            {member.slug}
          </p>
        </div>
        <div className="flex gap-1 font-mono text-[10px] text-charcoal/60">
          <span className="px-1.5 rounded bg-charcoal/10">T·{thens.length}</span>
          <span className="px-1.5 rounded bg-charcoal/10">N·{nows.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="aspect-[4/5] bg-charcoal/5 rounded overflow-hidden grid place-items-center">
          {thenCover ? (
            <img src={thenCover} alt={`Then ${member.name}`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-charcoal/40 font-mono text-[9px] tracking-widest uppercase">then —</span>
          )}
        </div>
        <div className="aspect-[4/5] bg-charcoal/5 rounded overflow-hidden grid place-items-center">
          {nowCover ? (
            <img src={nowCover} alt={`Now ${member.name}`} className="w-full h-full object-cover" />
          ) : (
            <img
              src={member.photo}
              alt={`Now ${member.name}`}
              className="w-full h-full object-cover opacity-70"
            />
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 bg-charcoal text-paper py-2 rounded font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-brand transition-colors"
          >
            <Settings2 className="w-3 h-3" /> manage photos
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {member.name} <span className="italic text-brand">— then vs now</span>
            </DialogTitle>
            <DialogDescription>
              Add multiple Then and Now photos. They'll be paired in order on the yearbook slider.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <PhotoGroup
              member={member}
              kind="then"
              label="Then"
              items={thens}
              onChange={onChange}
            />
            <PhotoGroup
              member={member}
              kind="now"
              label="Now"
              items={nows}
              onChange={onChange}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PhotoGroup({
  member,
  kind,
  label,
  items,
  onChange,
}: {
  member: CrewMember;
  kind: Kind;
  label: string;
  items: Item[];
  onChange: () => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const folder = kind === "then" ? "freshers" : "finals";

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Pick an image file");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image must be under 8 MB");
    setBusy(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${folder}/${member.slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      const nextSort = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
      const { error: insErr } = await supabase
        .from("freshers_photo_items" as never)
        .insert({
          friend_slug: member.slug,
          kind,
          image_url: urlData.publicUrl,
          sort_order: nextSort,
        } as never);
      if (insErr) throw insErr;
      toast.success(`${label} photo added`);
      await onChange();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const confirmDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    if (!target) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("freshers_photo_items" as never)
        .delete()
        .eq("id", target.id);
      if (error) throw error;
      toast.success(`${label} photo removed`);
      await onChange();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't remove");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-[10px] tracking-widest uppercase text-charcoal/50">
          {label} <span className="text-charcoal/30">· {items.length}</span>
        </p>
        <button
          type="button"
          onClick={() => !busy && inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand text-white font-mono text-[10px] tracking-widest uppercase disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} add
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />

      {items.length === 0 ? (
        <button
          type="button"
          onClick={() => !busy && inputRef.current?.click()}
          disabled={busy}
          className="w-full aspect-[4/5] bg-charcoal/5 rounded grid place-items-center border border-dashed border-charcoal/20 hover:border-brand transition-colors"
        >
          <span className="inline-flex items-center gap-1.5 text-charcoal/50 font-mono text-[10px] tracking-[0.2em] uppercase">
            <Upload className="w-3 h-3" /> click to add
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map((it, idx) => (
            <div key={it.id} className="relative group aspect-[4/5] bg-charcoal/5 rounded overflow-hidden">
              <img src={it.image_url} alt={`${label} ${idx + 1}`} className="w-full h-full object-cover" />
              <span className="absolute top-1 left-1 font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => setDeleteTarget(it)}
                disabled={busy}
                aria-label="Delete photo"
                className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" /> Delete this {label.toLowerCase()} photo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the photo from <span className="font-medium">{member.name}</span>'s {label.toLowerCase()} set. You can re-upload anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
