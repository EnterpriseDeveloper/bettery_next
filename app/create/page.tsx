"use client";

import Navbar from "@/components/block/navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { txCreateEvent } from "@/blockchain/cosmos/events";
import { useWalletStore } from "../../store/useWalletStore";
import { categories } from "@/config/config";
import { Info, PlusCircle } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const { address, signer } = useWalletStore();
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const [answersError, setAnswersError] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [category, setCategory] = useState("Market");
  const [submitting, setSubmitting] = useState(false);

  const handleAddAnswer = () => {
    setAnswers((prev) => [...prev, ""]);
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;

      // Live validation for duplicates / empties
      const normalized = next.map((a) => a.trim()).filter((a) => a !== "");
      if (normalized.length < 2) {
        setAnswersError("At least two answers are required");
      } else {
        const lower = normalized.map((a) => a.toLowerCase());
        const unique = new Set(lower);
        setAnswersError(
          unique.size !== lower.length ? "Answers must be unique" : "",
        );
      }

      return next;
    });
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!question.trim()) {
      setQuestionError("Question is required");
      hasError = true;
    }

    if (!endDate) {
      setEndDateError("End date is required");
      hasError = true;
    } else {
      const endMs = new Date(endDate).getTime();
      if (!Number.isFinite(endMs) || endMs <= Date.now()) {
        setEndDateError("End date must be in the future");
        hasError = true;
      } else {
        setEndDateError("");
      }
    }

    const normalized = answers.map((a) => a.trim()).filter((a) => a !== "");
    if (normalized.length < 2) {
      setAnswersError("At least two answers are required");
      hasError = true;
    } else {
      const lower = normalized.map((a) => a.toLowerCase());
      const unique = new Set(lower);
      if (unique.size !== lower.length) {
        setAnswersError("Answers must be unique");
        hasError = true;
      } else {
        setAnswersError("");
      }
    }

    if (hasError) return;

    try {
      setSubmitting(true);
      const epochEndDate = Math.floor(new Date(endDate).getTime() / 1000);

      const txResp = await txCreateEvent(signer!, address!, {
        creator: address!,
        question,
        answers,
        end_time: epochEndDate,
        category,
      });
      console.log("Transaction response:", txResp);

      // If we get here without throwing, navigate to app page
      router.push("/app");
    } catch (err) {
      console.error("Failed to create event", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900 dark:bg-[#0a0b10] dark:text-slate-100">
      <Navbar />

      <main className="flex justify-center py-10 px-4">
        <div className="flex w-full max-w-4xl flex-col gap-10">
          {/* Page header */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#9A6BFF]/10 text-[#9A6BFF] dark:bg-[#9A6BFF]/20">
                Cosmos SDK
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3CE6FF]/10 text-[#3CE6FF] dark:bg-[#3CE6FF]/20">
                AI Verified
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
              Create{" "}
              <span className="bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] bg-clip-text text-transparent">
                New Event
              </span>
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Launch a custom decentralized prediction market with automated AI
              resolution.
            </p>
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            {/* Question */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Question
              </label>
              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (questionError && e.target.value.trim()) {
                    setQuestionError("");
                  }
                }}
                placeholder="What will be the outcome of the next ETH upgrade?"
                className={`min-h-[120px] rounded-xl p-4 text-lg outline-none transition ${
                  questionError
                    ? "border border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500 dark:bg-black/60 dark:text-red-300"
                    : "border border-slate-200 bg-slate-50 text-slate-900 focus:border-[#9A6BFF] focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-black/40 dark:text-slate-100"
                }`}
              />
              {questionError && (
                <p className="text-xs text-red-500">{questionError}</p>
              )}
            </div>

            {/* Category + End date */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#9A6BFF] focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-black/40 dark:text-slate-100 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    ▾
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  End date & time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (endDateError) {
                        setEndDateError("");
                      }
                    }}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full rounded-xl p-3.5 text-sm outline-none transition [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${
                      endDateError
                        ? "border border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500 dark:bg-black/60 dark:text-red-300"
                        : "border border-slate-200 bg-slate-50 text-slate-900 focus:border-[#9A6BFF] focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-black/40 dark:text-slate-100"
                    }`}
                  />
                </div>
                {endDateError && (
                  <p className="text-xs text-red-500">{endDateError}</p>
                )}
              </div>
            </div>

            {/* Answers */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Possible answers
                </label>
                <button
                  type="button"
                  onClick={handleAddAnswer}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#3CE6FF] hover:underline cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add option
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {answers.map((answer, index) => (
                  <div key={index} className="relative flex items-center">
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className={`w-full rounded-xl p-3.5 text-sm outline-none transition ${
                        answersError
                          ? "border border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500 dark:bg-black/60 dark:text-red-300"
                          : "border border-slate-200 bg-slate-50 text-slate-900 focus:border-[#3CE6FF] focus:ring-2 focus:ring-[#3CE6FF]/20 dark:border-white/10 dark:bg-black/40 dark:text-slate-100"
                      }`}
                    />
                    {answers.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAnswer(index)}
                        className="ml-2 text-xs font-semibold text-slate-400 hover:text-red-400 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {answersError && (
                <p className="text-xs text-red-500">{answersError}</p>
              )}
            </div>

            {/* AI info */}
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-white/20 dark:bg-white/5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9A6BFF]/10 text-[#9A6BFF] dark:bg-[#9A6BFF]/20">
                  <Info className="h-4 w-4" />
                </div>
                <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    Advanced AI Resolution:
                  </span>{" "}
                  This market will use real-time data feeds and LLM verification
                  to settle. A protocol fee of 1% will be applied to the total
                  liquidity pool.
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] p-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
              >
                {submitting && (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                )}
                <span>Create Prediction Market</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
