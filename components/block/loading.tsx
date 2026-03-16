type LoadingBlockProps = {
  message?: string;
};

export default function LoadingBlock({ message = "Loading…" }: LoadingBlockProps) {
  return (
    <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#0a0b10] flex items-center justify-center">
      <p className="text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
