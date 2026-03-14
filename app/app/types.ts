export type Tab = "all" | "my-bets";
export type StatusFilter = "ACTIVE" | "FINISHED" | "REJECTED";

export type PendingZeroBet = {
  eventId: number | string;
  answerIndex: number;
};

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "FINISHED", label: "Finished" },
  { value: "REJECTED", label: "Rejected" },
];

export const EVENTS_PAGE_SIZE = 12;
