"use client";

import type { Tab } from "./types";

type Props = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabClass = (active: boolean) =>
  active
    ? "text-[#9A6BFF] border-b-2 border-[#9A6BFF] dark:border-[#9A6BFF]"
    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300";

export function EventsPageTabs({ tab, onTabChange }: Props) {
  return (
    <div className="flex gap-8 border-b border-slate-200 dark:border-white/10">
      <button
        type="button"
        onClick={() => onTabChange("all")}
        className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${tabClass(tab === "all")}`}
      >
        All Events
      </button>
      <button
        type="button"
        onClick={() => onTabChange("my-bets")}
        className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${tabClass(tab === "my-bets")}`}
      >
        My Bets
      </button>
    </div>
  );
}
