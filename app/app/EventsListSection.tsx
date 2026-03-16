"use client";

import Link from "next/link";
import EventCard from "@/components/block/event";
import type { Tab } from "./types";
import { useConfigStore } from "@/store/useConfigStore";

type Props = {
  tab: Tab;
  address: string | null | undefined;
  events: any[];
  selected: Record<number, number | null>;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  loadingMore: boolean;
  noMoreEvents: boolean;
  increaseStakeLoadingEventId: string | number | null;
  onSelect: (eventId: number | string, answerIndex: number) => void;
  onSubmitAnswer: (
    eventId: number | string,
    amount: string,
    answerIndex: number,
  ) => void;
  onIncreaseAnswer: (
    eventId: number | string,
    amount: string,
    partId: number,
  ) => void;
  onRefund?: (eventId: string | number) => void;
};

const createEventLinkClass =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-[0.98] transition";

export function EventsListSection({
  tab,
  address,
  events,
  selected,
  loadMoreRef,
  loadingMore,
  noMoreEvents,
  increaseStakeLoadingEventId,
  onSelect,
  onSubmitAnswer,
  onIncreaseAnswer,
  onRefund,
}: Props) {
  const { creatorPercent } = useConfigStore();
  const showList = tab !== "my-bets" || address;

  return (
    <div className="mt-10 space-y-6">
      {tab === "my-bets" && !address && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Connect your wallet and see your events here.
          </p>
        </div>
      )}
      {showList && (
        <>
          {events.length === 0 && (
            <div
              className="flex flex-col items-center justify-center"
              style={{ paddingTop: "100px" }}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                No events yet? Create your new event and earn{" "}
                <span className="font-semibold text-[#9A6BFF] dark:text-[#3CE6FF]">
                  {creatorPercent}% of the total event pool
                </span>
                .
              </p>
              <Link href="/create" className={createEventLinkClass}>
                Create New Event
              </Link>
            </div>
          )}
          <div className="flex flex-wrap gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="w-[388px] flex-shrink-0">
                <EventCard
                  ev={ev}
                  currentAddress={address}
                  selected={selected}
                  handleSelect={onSelect}
                  handleSubmitAnswer={onSubmitAnswer}
                  handleIncreaseAnswer={onIncreaseAnswer}
                  onRefund={onRefund}
                  increaseStakeLoading={
                  increaseStakeLoadingEventId != null &&
                  String(increaseStakeLoadingEventId) === String(ev.id)
                }
                />
              </div>
            ))}
          </div>
          {noMoreEvents && (
            <div
              className="flex flex-col items-center justify-center"
              style={{ paddingTop: "100px" }}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                No more events found? Create your new event and earn{" "}
                <span className="font-semibold text-[#9A6BFF] dark:text-[#3CE6FF]">
                  {creatorPercent}% of the total event pool
                </span>
                .
              </p>
              <Link href="/create" className={createEventLinkClass}>
                Create New Event
              </Link>
            </div>
          )}
          <div ref={loadMoreRef} className="h-10 w-full" aria-hidden />
          {loadingMore && (
            <div className="mt-4 flex justify-center py-4 text-sm text-slate-500 dark:text-slate-400">
              Loading more…
            </div>
          )}
        </>
      )}
    </div>
  );
}
