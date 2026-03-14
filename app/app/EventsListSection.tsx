"use client";

import Link from "next/link";
import EventCard from "@/components/block/event";
import type { Tab } from "./types";

type Props = {
  tab: Tab;
  address: string | null | undefined;
  events: any[];
  selected: Record<number, number | null>;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  loadingMore: boolean;
  noMoreEvents: boolean;
  onSelect: (eventId: number | string, answerIndex: number) => void;
  onSubmitAnswer: (
    eventId: number | string,
    amount: string,
    answerIndex: number,
  ) => void;
};

const createEventLinkClass =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-[0.98] transition";

const emptyStateCopy = (
  <>
    No events yet? Create your new event and earn{" "}
    <span className="font-semibold text-[#9A6BFF] dark:text-[#3CE6FF]">
      1% of the total event pool
    </span>
    .
  </>
);

const noMoreCopy = (
  <>
    No more events found? Create your new event and earn{" "}
    <span className="font-semibold text-[#9A6BFF] dark:text-[#3CE6FF]">
      1% of the total event pool
    </span>
    .
  </>
);

export function EventsListSection({
  tab,
  address,
  events,
  selected,
  loadMoreRef,
  loadingMore,
  noMoreEvents,
  onSelect,
  onSubmitAnswer,
}: Props) {
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
                {emptyStateCopy}
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
                {noMoreCopy}
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
