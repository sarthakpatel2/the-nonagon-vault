import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export function AdminFab() {
  return (
    <Link
      to="/admin/freshers"
      title="Admin"
      aria-label="Open admin"
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-charcoal/90 text-paper backdrop-blur shadow-lg hover:bg-brand transition-colors font-mono text-[10px] tracking-[0.2em] uppercase"
    >
      <Lock className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">admin</span>
    </Link>
  );
}
