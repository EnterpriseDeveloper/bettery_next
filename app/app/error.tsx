"use client";

import ErrorBlock from "@/components/block/error";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBlock error={error} reset={reset} />;
}
