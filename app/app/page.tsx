"use client";

import EventCard from "@/components/block/event";
import Navbar from "@/components/block/navbar";
import { txParticipateEvent } from "@/blockchain/cosmos/events";
import { useEffect, useState } from "react";
import { useWalletStore } from "../../store/useWalletStore";
import { categories } from "@/config/config";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { parseUnits } from "viem";
import Link from "next/link";
import BetModal from "@/components/modals/betModal";

type Tab = "all" | "my-bets";
type StatusFilter = "ACTIVE" | "FINISHED" | "REJECTED";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "FINISHED", label: "Finished" },
  { value: "REJECTED", label: "Rejected" },
];

type PendingZeroBet = { eventId: number | string; answerIndex: number };

export default function Page() {
  const { address, signer } = useWalletStore();
  const [tab, setTab] = useState<Tab>("all");
  const [status, setStatus] = useState<StatusFilter | "">("ACTIVE");
  const [category, setCategory] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<number, number | null>>({});
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [zeroAmountModal, setZeroAmountModal] = useState<{
    open: boolean;
    pending: PendingZeroBet | null;
  }>({ open: false, pending: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (status) params.set("status", status);
      if (category) params.set("category", category);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok || cancelled) return;
      const data = await res.json();
      let list = data.events ?? [];
      if (tab === "my-bets" && address) {
        list = list.filter((ev: any) =>
          ev.bets?.some((b: any) => b.creator === address),
        );
      }
      if (!cancelled) setEvents(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, status, category, address]);

  const handleSelect = (eventId: number | string, answerIndex: number) => {
    setSelected((s) => ({ ...s, [eventId]: answerIndex }));
  };

  const handleSubmitAnswer = async (
    eventId: number | string,
    amount: string,
    answerIndex: number,
  ) => {
    const ev = events.find((e) => String(e.id) === String(eventId));
    if (!ev) return;
    if (answerIndex < 0) return;
    const answer = ev.answers[answerIndex];
    if (answer == null) {
      alert("Please select an answer");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setZeroAmountModal({ open: true, pending: { eventId, answerIndex } });
      return;
    }
    const amountBigInt = parseUnits(amount, 6);
    const txResp = await txParticipateEvent(
      signer!,
      address!,
      Number(eventId),
      answer,
      amountBigInt,
    );
    console.log(txResp);
  };

  const handleProceedWithZero = async () => {
    const { pending } = zeroAmountModal;
    if (!pending || !signer || !address) {
      setZeroAmountModal({ open: false, pending: null });
      return;
    }
    const ev = events.find((e) => String(e.id) === String(pending.eventId));
    const answer = ev?.answers[pending.answerIndex];
    if (!ev || answer == null) {
      setZeroAmountModal({ open: false, pending: null });
      return;
    }
    setZeroAmountModal({ open: false, pending: null });
    const txResp = await txParticipateEvent(
      signer,
      address,
      Number(pending.eventId),
      answer,
      0n,
    );
    console.log(txResp);
  };

  const categoryLabel = category
    ? (categories.find((c) => c.name === category)?.name ?? "All Categories")
    : "All Categories";

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900 dark:bg-[#0a0b10] dark:text-slate-100">
      <Navbar />

      <BetModal
        open={zeroAmountModal.open}
        onClose={() => setZeroAmountModal({ open: false, pending: null })}
        onProceed={handleProceedWithZero}
      />

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              tab === "all"
                ? "text-[#9A6BFF] border-b-2 border-[#9A6BFF] dark:border-[#9A6BFF]"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setTab("my-bets")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              tab === "my-bets"
                ? "text-[#9A6BFF] border-b-2 border-[#9A6BFF] dark:border-[#9A6BFF]"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            My Bets
          </button>
        </div>

        {/* Title row: title + subtitle on left, status pills on right */}
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
                onClick={() => setStatus(opt.value)}
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

        {/* Category dropdown */}
        <div className="relative mt-6 w-full max-w-xs">
          <button
            type="button"
            onClick={() => setCategoryOpen((o) => !o)}
            className="cursor-pointer flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
          >
            <LayoutGrid className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="flex-1">{categoryLabel}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-500 transition-transform dark:text-slate-400 ${
                categoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {categoryOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setCategoryOpen(false)}
              />
              <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#0a0b10]">
                <button
                  type="button"
                  onClick={() => {
                    setCategory("");
                    setCategoryOpen(false);
                  }}
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
                    onClick={() => {
                      setCategory(c.name);
                      setCategoryOpen(false);
                    }}
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

        {/* Events list */}
        <div className="mt-10 space-y-6">
          {events.length === 0 && (
            <div
              className="flex flex-col items-center justify-center"
              style={{ paddingTop: "100px" }}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                No events yet? Create your new event and earn{" "}
                <span className="font-semibold text-[#9A6BFF] dark:text-[#3CE6FF]">
                  1% of the total event pool
                </span>
                .
              </p>
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-[0.98] transition"
              >
                Create New Event
              </Link>
            </div>
          )}
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              ev={ev}
              currentAddress={address}
              selected={selected}
              handleSelect={handleSelect}
              handleSubmitAnswer={handleSubmitAnswer}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
