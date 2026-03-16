"use client";

type FinishedSectionProps = {
  hasBet: boolean;
  /** Formatted result/reward (e.g. "50.00"). Used for Winner and Get my reward. */
  resultDisplay: string;
  /** Formatted amount (e.g. "10.00"). Used for You lost. */
  amountDisplay: string;
  token?: string;
  paid: boolean;
  loading: boolean;
  error: string | null;
  onClaimClick: () => void;
};

export function FinishedSection({
  hasBet,
  resultDisplay,
  amountDisplay,
  token = "USDT",
  paid,
  loading,
  error,
  onClaimClick,
}: FinishedSectionProps) {
  if (!hasBet) {
    return (
      <p className="text-center text-sm font-semibold text-green-600 dark:text-green-400">
        Event is FINISHED
      </p>
    );
  }

  const resultNum = parseFloat(resultDisplay);
  if (resultNum === 0) {
    return (
      <p className="text-center text-sm font-semibold text-red-600 dark:text-red-400">
        You lost {amountDisplay} {token}
      </p>
    );
  }

  if (paid) {
    return (
      <p className="text-center text-sm font-semibold text-green-600 dark:text-green-400">
        Winner {resultDisplay} {token}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={loading}
        onClick={onClaimClick}
        className="cursor-pointer w-full rounded-xl border-2 border-green-500 bg-green-500/10 py-3 px-4 text-sm font-bold text-green-600 transition hover:bg-green-500/20 disabled:opacity-50 dark:border-green-400 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
      >
        {loading ? "Claiming…" : `Get my reward ${resultDisplay} ${token}`}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
