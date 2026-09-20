import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  importedHallOfFame,
  importedNews,
  importedRankings,
  importedShopItems,
} from "@/lib/imported-content";

type Tables = Database["public"]["Tables"];
export type News = Tables["news"]["Row"];
export type EventRow = Tables["events"]["Row"];
export type ServerStatus = Tables["server_status"]["Row"];
export type Ranking = Tables["rankings"]["Row"];
export type GuildSeason = Tables["guild_seasons"]["Row"];
export type HallOfFame = Tables["hall_of_fame"]["Row"];
export type ShopItem = Tables["shop_items"]["Row"];
export type GuideSection = Tables["guide_sections"]["Row"];

/** Lança em caso de erro para que o React Query trate o estado de falha. */
async function run<T>(promise: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as T;
}

function mergeImportedRows<T extends { id: string }>(databaseRows: T[], importedRows: T[]) {
  const rowsById = new Map(importedRows.map((row) => [row.id, row]));
  databaseRows.forEach((row) => rowsById.set(row.id, row));
  return Array.from(rowsById.values());
}

export const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: async () => {
    try {
      const rows = await run<News[]>(
        supabase.from("news").select("*").order("published_at", { ascending: false }),
      );
      return mergeImportedRows(rows, importedNews).sort(
        (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at),
      );
    } catch {
      return importedNews;
    }
  },
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: () =>
    run<EventRow[]>(supabase.from("events").select("*").order("starts_at", { ascending: true })),
});

export const serverStatusQuery = queryOptions({
  queryKey: ["server_status"],
  queryFn: () =>
    run<ServerStatus[]>(
      supabase.from("server_status").select("*").order("server_name", { ascending: true }),
    ),
});

export const rankingsQuery = queryOptions({
  queryKey: ["rankings"],
  queryFn: async () => {
    try {
      const rows = await run<Ranking[]>(
        supabase.from("rankings").select("*").order("position", { ascending: true }),
      );
      return mergeImportedRows(rows, importedRankings);
    } catch {
      return importedRankings;
    }
  },
});

export const guildSeasonsQuery = queryOptions({
  queryKey: ["guild_seasons"],
  queryFn: () =>
    run<GuildSeason[]>(
      supabase
        .from("guild_seasons")
        .select("*")
        .order("season", { ascending: false })
        .order("position", { ascending: true }),
    ),
});

export const hallOfFameQuery = queryOptions({
  queryKey: ["hall_of_fame"],
  queryFn: async () => {
    try {
      const rows = await run<HallOfFame[]>(
        supabase.from("hall_of_fame").select("*").order("season", { ascending: false }),
      );
      return mergeImportedRows(rows, importedHallOfFame);
    } catch {
      return importedHallOfFame;
    }
  },
});

export const shopItemsQuery = queryOptions({
  queryKey: ["shop_items"],
  queryFn: async () => {
    try {
      const rows = await run<ShopItem[]>(
        supabase.from("shop_items").select("*").order("position", { ascending: true }),
      );
      return mergeImportedRows(rows, importedShopItems).sort((a, b) => a.position - b.position);
    } catch {
      return importedShopItems;
    }
  },
});

export const guideSectionsQuery = queryOptions({
  queryKey: ["guide_sections"],
  queryFn: () =>
    run<GuideSection[]>(
      supabase.from("guide_sections").select("*").order("position", { ascending: true }),
    ),
});

export const DOWNLOAD_URL = "https://www.transfernow.net/dl/20260526BUMSzNgh/4nfX8USO";
