import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { crew, type CrewMember } from "@/lib/crew";

export type AvatarFilter = "none" | "bw" | "warm" | "contrast";

export const FILTER_LABELS: Record<AvatarFilter, string> = {
  none: "Original",
  bw: "B&W",
  warm: "Warm",
  contrast: "Contrast",
};

export const FILTER_CSS: Record<AvatarFilter, string> = {
  none: "none",
  bw: "grayscale(1) contrast(1.05)",
  warm: "sepia(0.35) saturate(1.25) hue-rotate(-8deg) brightness(1.02)",
  contrast: "contrast(1.2) saturate(1.15) brightness(1.02)",
};

export type CrewAvatar = {
  slug: string;
  image_url: string | null;
  crop_x: number; // 0..100
  crop_y: number; // 0..100
  crop_scale: number; // >=1
  filter: AvatarFilter;
};

export type ResolvedAvatar = {
  slug: string;
  src: string;
  crop_x: number;
  crop_y: number;
  crop_scale: number;
  filter: AvatarFilter;
  isCustom: boolean;
};

export function defaultAvatarFor(m: CrewMember): ResolvedAvatar {
  return {
    slug: m.slug,
    src: m.photo,
    crop_x: 50,
    crop_y: 50,
    crop_scale: 1,
    filter: "none",
    isCustom: false,
  };
}

export function avatarImgStyle(a: ResolvedAvatar): CSSProperties {
  return {
    objectPosition: `${a.crop_x}% ${a.crop_y}%`,
    transform: a.crop_scale > 1 ? `scale(${a.crop_scale})` : undefined,
    transformOrigin: `${a.crop_x}% ${a.crop_y}%`,
    filter: FILTER_CSS[a.filter],
  };
}

type Row = {
  slug: string;
  image_url: string;
  crop_x: number;
  crop_y: number;
  crop_scale: number;
  filter: string;
};

function toResolved(row: Row, m: CrewMember): ResolvedAvatar {
  const f = (["none", "bw", "warm", "contrast"] as const).includes(row.filter as AvatarFilter)
    ? (row.filter as AvatarFilter)
    : "none";
  return {
    slug: m.slug,
    src: row.image_url || m.photo,
    crop_x: row.crop_x ?? 50,
    crop_y: row.crop_y ?? 50,
    crop_scale: row.crop_scale ?? 1,
    filter: f,
    isCustom: !!row.image_url,
  };
}

export function useCrewAvatars(): Record<string, ResolvedAvatar> {
  const [map, setMap] = useState<Record<string, ResolvedAvatar>>(() => {
    const base: Record<string, ResolvedAvatar> = {};
    for (const m of crew) base[m.slug] = defaultAvatarFor(m);
    return base;
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("crew_avatars" as never)
        .select("slug,image_url,crop_x,crop_y,crop_scale,filter");
      if (cancelled || error || !data) return;
      setMap((prev) => {
        const next = { ...prev };
        for (const row of data as unknown as Row[]) {
          const m = crew.find((c) => c.slug === row.slug);
          if (m) next[row.slug] = toResolved(row, m);
        }
        return next;
      });
    };
    void load();
    const ch = supabase
      .channel("crew_avatars_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "crew_avatars" },
        () => void load(),
      )
      .subscribe();
    return () => {
      cancelled = true;
      void supabase.removeChannel(ch);
    };
  }, []);

  return map;
}
