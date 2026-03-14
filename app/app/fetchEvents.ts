import type { Tab, StatusFilter } from "./types";
import { EVENTS_PAGE_SIZE } from "./types";

export type FetchEventsResult = {
  events: any[];
  totalPages: number;
  page: number;
};

export async function fetchEventsList(
  tab: Tab,
  status: StatusFilter | "",
  category: string,
  address: string | null | undefined,
  page = 0,
): Promise<FetchEventsResult> {
  const params = new URLSearchParams();
  params.set("limit", String(EVENTS_PAGE_SIZE));
  params.set("page", String(page));
  if (status) params.set("status", status);
  if (category) params.set("category", category);

  const res = await fetch(`/api/events?${params.toString()}`);
  if (!res.ok) return { events: [], totalPages: 0, page: 0 };
  const data = await res.json();
  let list = data.events ?? [];
  if (tab === "my-bets" && address) {
    list = list.filter((ev: any) =>
      ev.bets?.some((b: any) => b.creator === address),
    );
  }
  return {
    events: list,
    totalPages: data.totalPages ?? 0,
    page: data.page ?? 0,
  };
}
