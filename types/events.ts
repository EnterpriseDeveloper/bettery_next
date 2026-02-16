export interface TxCreateEvent {
  creator: string;
  question: string;
  answers: string[];
  end_time: number;
  category: string;
}

export interface Events {
  id: number;
  creator: string;
  question: string;
  answers: string[];
  answersPool: number[];
  endTime: number;
  startTime: number;
  category: string;
  status: string;
  participants: string[];
  participant: Participant | undefined;
}

export interface Participant {
  id: number;
  creator: string;
  eventId: number;
  answer: string;
  amount: number;
  token: string;
  result: number;
}
