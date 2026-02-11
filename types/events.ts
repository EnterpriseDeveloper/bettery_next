export interface TxCreateEvent {
  creator: string;
  question: string;
  answers: string[];
  end_time: number;
  category: string;
}
