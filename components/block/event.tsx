import { useState } from "react";

export default function EventCard({
  ev,
  selected,
  handleSelect,
  handleSubmitAnswer,
}: any) {
  const [amount, setAmount] = useState("0");

  return (
    <div
      key={ev.id}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {ev.question}
        </h2>
        <span className="mt-1 inline-block rounded-full bg-[#9A6BFF]/10 px-2 py-0.5 text-xs font-medium text-[#9A6BFF] dark:bg-[#9A6BFF]/20">
          {ev.category}
        </span>
      </div>

      <div className="space-y-2">
        {ev.answers.map((ans: string, idx: number) => (
          <label
            key={idx}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 py-2 pl-3 dark:border-white/10"
          >
            <input
              type="radio"
              name={`answer-${ev.id}`}
              checked={selected[ev.id] === idx}
              onChange={() => handleSelect(ev.id, idx)}
              className="h-4 w-4 border-slate-300 text-[#9A6BFF] focus:ring-[#9A6BFF]/20 dark:border-white/20"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {ans}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bet amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-[#9A6BFF] focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-black/40 dark:text-slate-100"
        />
      </div>

      <button
        type="button"
        onClick={() => handleSubmitAnswer(ev.id, amount)}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] px-4 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
      >
        Pick Answer
      </button>
    </div>
  );
}
