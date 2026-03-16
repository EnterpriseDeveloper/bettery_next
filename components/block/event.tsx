"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWalletStore } from "@/store/useWalletStore";
import { getMoneyFromEvent } from "@/blockchain/cosmos/participate";
import { refreshWalletBalance } from "@/lib/balance";
import { RefundSection } from "@/components/ui/refund-section";
import { FinishedSection } from "@/components/ui/finished-section";
import { Spinner } from "@/components/ui/spinner";

type EventCardProps = {
  ev: {
    id: string | number;
    question: string;
    answers: string[];
    answersPool: string[];
    endTime: string;
    category: string;
    status?: string;
    bets?: {
      id: number;
      creator: string;
      answer: string;
      amount: string;
      token?: string;
      increase?: boolean;
      paid?: boolean;
      status?: string;
      /** Reward amount (same units as amount, e.g. /100 for USDT). 0 = lost. */
      result?: number | string;
    }[];
  };
  currentAddress?: string | null;
  selected?: Record<string | number, number | null>;
  handleSelect?: (eventId: number | string, answerIndex: number) => void;
  handleSubmitAnswer?: (
    eventId: number | string,
    amount: string,
    answerIndex: number,
  ) => void;
  handleIncreaseAnswer?: (
    eventId: number | string,
    amount: string,
    partId: number,
  ) => void;
  onRefund?: (eventId: string | number) => void;
  /** When true, show spinner on Increase stake button (e.g. while tx is in progress). */
  increaseStakeLoading?: boolean;
};

function endsInDays(endTimeStr: string): string {
  const endSec = Number(endTimeStr);
  const endMs = endSec * 1000;
  const now = Date.now();
  const diffMs = endMs - now;
  if (diffMs <= 0) return "Ended";
  const oneDayMs = 24 * 60 * 60 * 1000;
  if (diffMs < oneDayMs) {
    const totalSec = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `Ends in ${hours}h ${minutes}m ${seconds}s`;
  }
  const days = Math.ceil(diffMs / oneDayMs);
  return `Ends in ${days} day${days !== 1 ? "s" : ""}`;
}

export default function EventCard({
  ev,
  currentAddress,
  handleSelect,
  handleSubmitAnswer,
  handleIncreaseAnswer,
  onRefund,
  increaseStakeLoading = false,
}: EventCardProps) {
  const { signer, address: walletAddress } = useWalletStore();
  const isRefund = ev.status?.toUpperCase() === "REFUND";
  const isFinished = ev.status?.toUpperCase() === "FINISHED";
  const [amount, setAmount] = useState("");
  const [increaseAmount, setIncreaseAmount] = useState("");
  const [walletError, setWalletError] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const [rewardLoading, setRewardLoading] = useState(false);

  const pools = (ev.answersPool ?? []).map((p) => BigInt(p));
  const totalPool = pools.reduce((s, p) => s + p, 0n);
  const percentages = ev.answers.map((_, i) =>
    totalPool > 0n
      ? Math.round(Number((pools[i] ?? 0n) * 100n) / Number(totalPool))
      : 0,
  );

  const userBet = ev.bets?.filter((b) => b.creator === currentAddress);
  const hasBet = userBet && userBet.length > 0;
  /** First bet (increase: false) holds the main amount and refund status */
  const firstBet = userBet?.find((b) => b.increase === false) ?? userBet?.[0];
  const isRefunded = firstBet?.paid === true;

  useEffect(() => {
    if (currentAddress) setWalletError("");
  }, [currentAddress]);

  const eventId = String(ev.id);
  const endsLabel = endsInDays(ev.endTime ?? "0");

  function formatAmountUsdt(
    userBet: {
      id: number;
      creator: string;
      answer: string;
      amount: string;
      token?: string;
    }[],
  ): import("react").ReactNode {
    return userBet.reduce((acc, bet) => acc + Number(bet.amount), 0) / 100;
  }

  return (
    <article
      className={`rounded-2xl border p-6 shadow-sm transition ${
        hasBet
          ? "border-[#9A6BFF]/30 bg-white shadow-[0_0_20px_rgba(154,107,255,0.08)] dark:border-[#9A6BFF]/40 dark:bg-white/5 dark:shadow-[0_0_20px_rgba(154,107,255,0.15)]"
          : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
      }`}
    >
      {/* Header: category + ends | total pool */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              hasBet
                ? "bg-[#3CE6FF]/15 text-[#3CE6FF] border border-[#3CE6FF]/30 dark:bg-[#3CE6FF]/10 dark:border-[#3CE6FF]/20"
                : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"
            }`}
          >
            {ev.category}
          </span>
          {isRefund && (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/30">
              Refund
            </span>
          )}
          {hasBet && !isRefund && (
            <span className="rounded-full bg-[#9A6BFF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Your participation
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {endsLabel}
          </span>
        </div>
      </div>
      <div className="mb-2 w-full text-right text-sm font-medium text-slate-600 dark:text-slate-300">
        Total pool:{" "}
        <span className="text-[#9A6BFF]">{Number(totalPool) / 100} USDT</span>
      </div>

      {/* Question */}
      <h2 className="mb-5 text-xl font-bold leading-snug text-slate-900 dark:text-white">
        {ev.question}
      </h2>

      {/* Progress bars */}
      <div className="space-y-3">
        {ev.answers.map((answer, idx) => (
          <div key={idx}>
            <div className="mb-1 flex justify-between text-sm">
              <span
                className={
                  idx % 2 === 0
                    ? "font-semibold text-[#3CE6FF]"
                    : "font-semibold text-[#9A6BFF]"
                }
              >
                {answer}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {percentages[idx] ?? 0}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentages[idx] ?? 0}%`,
                  backgroundColor: idx % 2 === 0 ? "#3CE6FF" : "#9A6BFF",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {isRefund ? (
        <>
          {hasBet && userBet && firstBet ? (
            <div className="mt-5">
              <RefundSection
                amountDisplay={String(Number(firstBet.amount) / 100)}
                token={firstBet.token ?? "USDT"}
                isRefunded={isRefunded}
                loading={refundLoading}
                error={walletError || null}
                onRefundClick={async () => {
                  setWalletError("");
                  if (!signer || !walletAddress) {
                    setWalletError(
                      "Connect your wallet to request a refund.",
                    );
                    return;
                  }
                  const partId = firstBet.id;
                  if (partId == null) return;
                  setRefundLoading(true);
                  try {
                    const result = await getMoneyFromEvent(
                      signer,
                      walletAddress,
                      eventId,
                      String(partId),
                    );
                    if (result) {
                      onRefund?.(eventId);
                      await refreshWalletBalance(walletAddress);
                    } else setWalletError("Refund request failed.");
                  } catch (e) {
                    setWalletError(
                      e instanceof Error
                        ? e.message
                        : "Refund request failed.",
                    );
                  } finally {
                    setRefundLoading(false);
                  }
                }}
              />
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              This event has been refunded.
            </p>
          )}
          <div className="mt-4">
            <Link
              href={`/event/${eventId}`}
              className="inline-block rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Show details
            </Link>
          </div>
        </>
      ) : isFinished ? (
        <>
          <div className="mt-5">
            <FinishedSection
              hasBet={!!firstBet}
              resultDisplay={firstBet ? String(Number(firstBet.result ?? 0) / 100) : "0"}
              amountDisplay={firstBet ? String(Number(firstBet.amount) / 100) : "0"}
              token={firstBet?.token ?? "USDT"}
              paid={firstBet?.paid === true}
              loading={rewardLoading}
              error={walletError || null}
              onClaimClick={async () => {
                if (!firstBet) return;
                setWalletError("");
                if (!signer || !walletAddress) {
                  setWalletError(
                    "Connect your wallet to claim your reward.",
                  );
                  return;
                }
                const partId = firstBet.id;
                if (partId == null) return;
                setRewardLoading(true);
                try {
                  const result = await getMoneyFromEvent(
                    signer,
                    walletAddress,
                    eventId,
                    String(partId),
                  );
                  if (result) {
                    onRefund?.(eventId);
                    await refreshWalletBalance(walletAddress);
                  } else setWalletError("Claim reward failed.");
                } catch (e) {
                  setWalletError(
                    e instanceof Error
                      ? e.message
                      : "Claim reward failed.",
                  );
                } finally {
                  setRewardLoading(false);
                }
              }}
            />
          </div>
          <div className="mt-4">
            <Link
              href={`/event/${eventId}`}
              className="inline-block rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Show details
            </Link>
          </div>
        </>
      ) : hasBet ? (
        <>
          {/* Your bet summary */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Your bet
            </p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-bold text-[#9A6BFF]">
                {userBet?.[0]?.answer}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Locked
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatAmountUsdt(userBet)} {userBet?.[0]?.token ?? "USDT"}
                </span>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {userBet && (
              <>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Add amount (USDT)"
                  value={increaseAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(",", ".");
                    const match = value.match(/^(\d+)?(\.(\d{0,2})?)?$/);
                    if (match || value === "") setIncreaseAmount(value);
                  }}
                  className="w-40 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
                <button
                  type="button"
                  disabled={increaseStakeLoading}
                  onClick={() => {
                    if (!currentAddress) {
                      setWalletError("Connect to the wallet");
                      return;
                    }
                    setWalletError("");
                    if (!increaseAmount || Number(increaseAmount) <= 0) {
                      setWalletError("Enter an amount greater than 0");
                      return;
                    }
                    const idx = ev.answers.indexOf(userBet?.[0]?.answer);
                    if (idx >= 0) {
                      handleIncreaseAnswer?.(
                        eventId,
                        increaseAmount,
                        Number(userBet?.[0]?.id),
                      );
                      setIncreaseAmount("");
                    }
                  }}
                  className="cursor-pointer rounded-xl bg-[#9A6BFF] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {increaseStakeLoading && (
                    <Spinner className="h-4 w-4 text-white" />
                  )}
                  {increaseStakeLoading ? "Increasing…" : "Increase stake"}
                </button>
              </>
            )}
            {walletError && (
              <p className="text-xs text-red-500">{walletError}</p>
            )}
            <div>
              <Link
                href={`/event/${eventId}`}
                className="rounded-xl border-2 border-[#9A6BFF] bg-transparent px-5 py-2.5 text-sm font-bold text-[#9A6BFF] transition hover:bg-[#9A6BFF]/10 dark:text-white dark:border-white/30 dark:hover:bg-white/10"
              >
                Show details
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Amount input */}
          <div className="mt-5">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Amount (USDT)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  const match = value.match(/^(\d+)?(\.(\d{0,2})?)?$/);
                  if (match || value === "") setAmount(value);
                }}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-14 text-slate-900 outline-none transition focus:border-[#9A6BFF] focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-black/40 dark:text-slate-100"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                USDT
              </span>
            </div>
          </div>
          {/* Bet buttons: one per answer, first = cyan, second = purple */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {ev.answers.map((answer, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!currentAddress) {
                    setWalletError("Connect to the wallet");
                    return;
                  }
                  setWalletError("");
                  handleSelect?.(ev.id, idx);
                  handleSubmitAnswer?.(ev.id, amount, idx);
                }}
                className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:opacity-50 ${
                  idx % 2 === 0
                    ? "bg-[#3CE6FF] hover:opacity-90"
                    : "bg-[#9A6BFF] hover:opacity-90"
                }`}
              >
                Bet {answer}
              </button>
            ))}
          </div>
          {walletError && (
            <p className="pt-2 text-center text-xs text-red-500">
              {walletError}
            </p>
          )}
          <div className="mt-3">
            <Link
              href={`/event/${eventId}`}
              className="inline-block rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Show details
            </Link>
          </div>
        </>
      )}
    </article>
  );
}
