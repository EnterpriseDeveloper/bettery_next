export interface CreateEvent {
  creator: string;
  id: string;
  question: string;
  answers: string[];
  end_time: number;
  category: string;
}
