import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Loader2, Trash2, Settings2, AlertTriangle, Plus, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  const [localItems, setLocalItems] = useState<Item[]>(items);
  const inputRef = useRef<HTMLInputElement>(null);
  const folder = kind === "then" ? "freshers" : "finals";

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const uploadOne = async (file: File, sortOrder: number): Promise<boolean> => {
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name}: not an image`);
      return false;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error(`${file.name}: over 8 MB`);
      return false;
    }
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${folder}/${member.slug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: insErr } = await supabase
        .from("freshers_photo_items" as never)
        .insert({
          friend_slug: member.slug,
          kind,
          image_url: urlData.publicUrl,
          sort_order: sortOrder,
        } as never);
      if (insErr) throw insErr;
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? `${file.name}: ${err.message}` : `${file.name}: upload failed`);
      return false;
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    setBusy(true);
    const startSort = localItems.length ? Math.max(...localItems.map((i) => i.sort_order)) + 1 : 0;
    let ok = 0;
    for (let i = 0; i < files.length; i++) {
      const success = await uploadOne(files[i], startSort + i);
      if (success) ok++;
    }
    if (ok > 0) toast.success(`${ok} ${label.toLowerCase()} photo${ok > 1 ? "s" : ""} added`);
    await onChange();
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
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

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = localItems.findIndex((i) => i.id === active.id);
    const newIdx = localItems.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(localItems, oldIdx, newIdx);
    setLocalItems(reordered);
    try {
      const updates = await Promise.all(
        reordered.map((it, idx) =>
          it.sort_order === idx
            ? Promise.resolve({ error: null })
            : supabase
                .from("freshers_photo_items" as never)
                .update({ sort_order: idx, updated_at: new Date().toISOString() } as never)
                .eq("id", it.id),
        ),
      );
      const firstErr = updates.find((u) => u.error);
      if (firstErr?.error) throw firstErr.error;
      await onChange();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save order");
      setLocalItems(items);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-[10px] tracking-widest uppercase text-charcoal/50">
          {label} <span className="text-charcoal/30">· {localItems.length}</span>
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

      {localItems.length === 0 ? (
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={localItems.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-2">
              {localItems.map((it, idx) => (
                <SortablePhoto
                  key={it.id}
                  item={it}
                  index={idx}
                  label={label}
                  disabled={busy}
                  onDelete={() => setDeleteTarget(it)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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

function SortablePhoto({
  item,
  index,
  label,
  disabled,
  onDelete,
}: {
  item: Item;
  index: number;
  label: string;
  disabled: boolean;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-[4/5] bg-charcoal/5 rounded overflow-hidden touch-none"
    >
      <img src={item.image_url} alt={`${label} ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
      <span className="absolute top-1 left-1 font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-white">
        #{index + 1}
      </span>
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="absolute bottom-1 left-1 p-1 rounded bg-black/60 text-white cursor-grab active:cursor-grabbing hover:bg-black/80"
      >
        <GripVertical className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={disabled}
        aria-label="Delete photo"
        className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
