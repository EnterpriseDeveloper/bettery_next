"use client";

type RefundSectionProps = {
  /** Formatted amount string (e.g. "123.45") */
  amountDisplay: string;
  token?: string;
  isRefunded: boolean;
  loading: boolean;
  error: string | null;
  onRefundClick: () => void;
};

export function RefundSection({
  amountDisplay,
  token = "USDT",
  isRefunded,
  loading,
  error,
  onRefundClick,
}: RefundSectionProps) {
  if (isRefunded) {
    return (
      <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-400/20 dark:bg-amber-500/10 text-center text-sm font-medium text-slate-900 dark:text-white">
        Refunded: {amountDisplay} {token}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-400/20 dark:bg-amber-500/10">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Your amount
        </p>
        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {amountDisplay} {token}
        </p>
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={onRefundClick}
        className="cursor-pointer w-full rounded-xl bg-amber-500 py-3 px-4 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
      >
        {loading ? "Refunding…" : `Refund money (${amountDisplay} ${token})`}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
