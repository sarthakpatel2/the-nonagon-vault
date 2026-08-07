import { useCallback, useEffect, useState } from "react";
import { Heart, Loader2, MessageCircle, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NAME_KEY } from "@/components/presence-indicator";
import { toast } from "sonner";

type Comment = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

function clientId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("nonagon-client-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("nonagon-client-id", id);
  }
  return id;
}

export function VideoSocial({ videoId, tone = "dark" }: { videoId: string; tone?: "dark" | "light" }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const dark = tone === "dark";
  const text = dark ? "text-paper" : "text-charcoal";
  const muted = dark ? "text-paper/60" : "text-charcoal/60";
  const line = dark ? "border-paper/25" : "border-charcoal/25";

  const load = useCallback(async () => {
    const me = clientId();
    const [likeRes, commentRes] = await Promise.all([
      supabase.from("video_likes").select("client_id").eq("video_id", videoId),
      supabase
        .from("video_comments")
        .select("id,name,message,created_at")
        .eq("video_id", videoId)
        .order("created_at", { ascending: false }),
    ]);
    const rows = likeRes.data ?? [];
    setLikes(rows.length);
    setLiked(rows.some((r) => r.client_id === me));
    setComments((commentRes.data ?? []) as Comment[]);
    setLoading(false);
  }, [videoId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    const saved = localStorage.getItem(NAME_KEY);
    if (saved) setName(saved);
  }, []);


  const toggleLike = async () => {
    const me = clientId();
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    const { error } = next
      ? await supabase.from("video_likes").insert({ video_id: videoId, client_id: me })
      : await supabase.from("video_likes").delete().eq("video_id", videoId).eq("client_id", me);
    if (error) {
      toast.error("Couldn't save that");
      load();
    }
  };

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = message.trim();
    const who = name.trim().slice(0, 60);
    if (!who) {
      toast.error("Add your name first — no anonymous comments");
      return;
    }
    if (!msg) return;
    setSending(true);
    const { error } = await supabase.from("video_comments").insert({
      video_id: videoId,
      name: who,
      message: msg.slice(0, 500),
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    localStorage.setItem(NAME_KEY, who);
    setMessage("");
    load();
  };


  const remove = async (id: string) => {
    const { error } = await supabase.from("video_comments").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    load();
  };

  return (
    <div className={`mt-6 ${text}`}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={liked}
          className={`inline-flex items-center gap-2 border ${line} px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors ${
            liked ? "bg-brand text-paper border-transparent" : "hover:border-brand hover:text-brand"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          {likes} {likes === 1 ? "like" : "likes"}
        </button>
        <span className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase ${muted}`}>
          <MessageCircle className="w-4 h-4" />
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <form onSubmit={post} className="mt-5 grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)_auto] items-end">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
          aria-label="Your name (required)"
          placeholder="Your name *"
          className={`bg-transparent border-b ${line} focus:border-brand outline-none text-sm py-2 ${text}`}
        />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          required
          placeholder="Say something about this clip…"
          className={`bg-transparent border-b ${line} focus:border-brand outline-none text-sm py-2 ${text}`}
        />
        <button
          type="submit"
          disabled={sending || !message.trim() || !name.trim()}
          className="inline-flex items-center justify-center gap-2 bg-brand text-paper px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase disabled:opacity-50 hover:bg-charcoal transition-colors"
        >
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          Post
        </button>
      </form>

      <ul className="mt-5 grid gap-3 max-w-2xl">
        {loading ? (
          <li className={`font-mono text-[10px] tracking-widest uppercase ${muted}`}>Loading…</li>
        ) : comments.length === 0 ? (
          <li className={`font-hand text-lg ${muted}`}>No comments yet — go first.</li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className={`group border-l-2 ${line} pl-3`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-hand text-lg leading-tight">{c.name || "Anonymous"}</p>
                  <p className={`text-sm break-words ${muted}`}>{c.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label="Delete comment"
                  className={`shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 ${muted} hover:text-brand transition-opacity`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
