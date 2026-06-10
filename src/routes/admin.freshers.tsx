import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Loader2, Check, Trash2, Pencil, Settings2, AlertTriangle } from "lucide-react";
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

type Row = { friend_slug: string; image_url: string | null; final_image_url: string | null };
type Slot = "then" | "now";

function AdminFreshersPage() {
  const [thenMap, setThenMap] = useState<Record<string, string>>({});
  const [nowMap, setNowMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("freshers_photos")
      .select("friend_slug,image_url,final_image_url");
    if (error) {
      console.error(error);
      toast.error("Couldn't load photos");
    } else {
      const t: Record<string, string> = {};
      const n: Record<string, string> = {};
      (data as Row[] | null)?.forEach((r) => {
        if (r.image_url) t[r.friend_slug] = r.image_url;
        if (r.final_image_url) n[r.friend_slug] = r.final_image_url;
      });
      setThenMap(t);
      setNowMap(n);
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
          Admin / Then vs Now
        </p>
        <h1 className="font-serif font-bold leading-[0.9] tracking-tight text-[clamp(2rem,5vw,3.5rem)]">
          Freshers <span className="italic text-brand">vs</span> Final year.
        </h1>
        <p className="mt-4 max-w-xl text-charcoal/70">
          Click any tile to upload, replace or delete that photo independently. Then-photos and Now-photos are managed separately.
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
                thenUrl={thenMap[m.slug]}
                nowUrl={nowMap[m.slug]}
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
  thenUrl,
  nowUrl,
  onChange,
}: {
  member: CrewMember;
  thenUrl?: string;
  nowUrl?: string;
  onChange: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const hasThen = Boolean(thenUrl);
  const hasNow = Boolean(nowUrl);

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
        <div className="flex gap-1">
          <span
            className={`size-2 rounded-full ${hasThen ? "bg-emerald-500" : "bg-charcoal/15"}`}
            title={hasThen ? "Then set" : "Then missing"}
          />
          <span
            className={`size-2 rounded-full ${hasNow ? "bg-emerald-500" : "bg-charcoal/15"}`}
            title={hasNow ? "Now set" : "Now missing"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="aspect-[4/5] bg-charcoal/5 rounded overflow-hidden grid place-items-center">
          {thenUrl ? (
            <img src={thenUrl} alt={`Then ${member.name}`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-charcoal/40 font-mono text-[9px] tracking-widest uppercase">then —</span>
          )}
        </div>
        <div className="aspect-[4/5] bg-charcoal/5 rounded overflow-hidden grid place-items-center">
          {nowUrl ? (
            <img src={nowUrl} alt={`Now ${member.name}`} className="w-full h-full object-cover" />
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {member.name} <span className="italic text-brand">— then vs now</span>
            </DialogTitle>
            <DialogDescription>
              Upload, replace, or delete each photo independently. Changes save instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <PhotoSlot
              member={member}
              slot="then"
              label="Then"
              currentUrl={thenUrl}
              fallback={null}
              onChange={onChange}
            />
            <PhotoSlot
              member={member}
              slot="now"
              label="Now"
              currentUrl={nowUrl}
              fallback={member.photo}
              onChange={onChange}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PhotoSlot({
  member,
  slot,
  label,
  currentUrl,
  fallback,
  onChange,
}: {
  member: CrewMember;
  slot: Slot;
  label: string;
  currentUrl?: string;
  fallback: string | null;
  onChange: () => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const column = slot === "then" ? "image_url" : "final_image_url";
  const folder = slot === "then" ? "freshers" : "finals";

  const uploadFile = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${folder}/${member.slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);

      const payload = {
        friend_slug: member.slug,
        updated_at: new Date().toISOString(),
        [column]: urlData.publicUrl,
      };

      const { error: insErr } = await supabase
        .from("freshers_photos")
        .upsert(payload as never, { onConflict: "friend_slug" });
      if (insErr) throw insErr;
      toast.success(`${member.name} — ${label} photo saved`);
      await onChange();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setPreview(null);
      URL.revokeObjectURL(localUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onFilePicked = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Pick an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB");
      return;
    }
    // If a photo already exists, ask before replacing.
    if (currentUrl) {
      setPendingFile(file);
      setConfirmReplaceOpen(true);
      return;
    }
    void uploadFile(file);
  };

  const confirmReplace = async () => {
    const file = pendingFile;
    setConfirmReplaceOpen(false);
    setPendingFile(null);
    if (file) await uploadFile(file);
  };

  const cancelReplace = () => {
    setConfirmReplaceOpen(false);
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const confirmRemove = async () => {
    setConfirmDeleteOpen(false);
    if (!currentUrl) return;
    setBusy(true);
    try {
      const updates = { [column]: null, updated_at: new Date().toISOString() } as never;
      const { error } = await supabase
        .from("freshers_photos")
        .update(updates)
        .eq("friend_slug", member.slug);
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

  const openPicker = () => {
    if (busy) return;
    inputRef.current?.click();
  };

  const displayUrl = preview || currentUrl || fallback;
  const hasReal = Boolean(currentUrl);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="font-mono text-[10px] tracking-widest uppercase text-charcoal/50">{label}</p>
        {hasReal && !busy && (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-emerald-700">
            <Check className="w-3 h-3" /> set
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={openPicker}
        disabled={busy}
        aria-label={`Upload ${label} photo for ${member.name}`}
        className="group relative w-full aspect-[4/5] bg-charcoal/5 rounded overflow-hidden grid place-items-center border border-transparent hover:border-brand transition-colors"
      >
        {displayUrl ? (
          <img src={displayUrl} alt={`${label} ${member.name}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-charcoal/40 font-mono text-[10px]">click to add</span>
        )}

        {/* hover overlay */}
        <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 text-paper font-mono text-[10px] tracking-[0.2em] uppercase">
            {busy ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> uploading…
              </>
            ) : hasReal ? (
              <>
                <Pencil className="w-3 h-3" /> replace
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" /> upload
              </>
            )}
          </span>
        </div>

        {busy && (
          <div className="absolute inset-0 bg-paper/60 grid place-items-center">
            <Loader2 className="w-5 h-5 animate-spin text-brand" />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={busy}
        onChange={(e) => onFilePicked(e.target.files?.[0] ?? null)}
      />

      {hasReal && (
        <button
          type="button"
          onClick={() => setConfirmDeleteOpen(true)}
          disabled={busy}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-2 py-1.5 border border-charcoal/15 text-charcoal/70 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors disabled:opacity-50 rounded"
        >
          <Trash2 className="w-3 h-3" /> delete
        </button>
      )}

      {/* Replace confirmation */}
      <AlertDialog
        open={confirmReplaceOpen}
        onOpenChange={(o) => (o ? setConfirmReplaceOpen(true) : cancelReplace())}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif flex items-center gap-2">
              <Pencil className="w-4 h-4 text-brand" /> Replace {label.toLowerCase()} photo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite the current <span className="font-medium">{label}</span> photo for{" "}
              <span className="font-medium">{member.name}</span>. The previous image will no longer appear in the yearbook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelReplace}>Keep current</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReplace}>Replace</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" /> Delete {label.toLowerCase()} photo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Remove the <span className="font-medium">{label}</span> photo for{" "}
              <span className="font-medium">{member.name}</span>? You can re-upload a new one any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
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
