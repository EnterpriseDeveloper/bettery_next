"use client";

import type { StatusFilter } from "./types";
import { STATUS_OPTIONS } from "./types";

type Props = {
  status: StatusFilter | "";
  onStatusChange: (status: StatusFilter) => void;
};

export function EventsPageHeader({ status, onStatusChange }: Props) {
  return (
    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white lg:text-4xl">
          Live Prediction Markets
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Bet on outcomes using decentralized intelligence.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusChange(opt.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              status === opt.value
                ? "bg-[#9A6BFF] text-white"
                : "bg-slate-200/80 text-slate-600 dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/15"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
