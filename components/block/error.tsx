"use client";

import { useEffect } from "react";

type ErrorBlockProps = {
  error: Error & { digest?: string };
  reset: () => void;
  message?: string;
};

export default function ErrorBlock({
  error,
  reset,
  message = "Something went wrong.",
}: ErrorBlockProps) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#0a0b10] flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-slate-600 dark:text-slate-400 text-center">
        {message}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        Try again
      </button>
    </div>
  );
}
