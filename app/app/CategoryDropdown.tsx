"use client";

import { ChevronDown, LayoutGrid } from "lucide-react";
import { categories } from "@/config/config";

type Props = {
  category: string;
  categoryLabel: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (category: string) => void;
};

export function CategoryDropdown({
  category,
  categoryLabel,
  open,
  onToggle,
  onSelect,
}: Props) {
  return (
    <div className="relative mt-6 w-full max-w-xs">
      <button
        type="button"
        onClick={onToggle}
        className="cursor-pointer flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
      >
        <LayoutGrid className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
        <span className="flex-1">{categoryLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform dark:text-slate-400 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden
            onClick={onToggle}
          />
          <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#0a0b10]">
            <button
              type="button"
              onClick={() => onSelect("")}
              className={`w-full px-4 py-2.5 text-left text-sm cursor-pointer ${
                !category
                  ? "bg-[#9A6BFF]/10 text-[#9A6BFF] dark:bg-[#9A6BFF]/20"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.name)}
                className={`w-full px-4 py-2.5 text-left text-sm cursor-pointer ${
                  category === c.name
                    ? "bg-[#9A6BFF]/10 text-[#9A6BFF] dark:bg-[#9A6BFF]/20"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
