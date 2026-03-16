"use client";

import ErrorBlock from "@/components/block/error";

export default function EventError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBlock
      error={error}
      reset={reset}
      message="Something went wrong loading this event."
    />
  );
}
