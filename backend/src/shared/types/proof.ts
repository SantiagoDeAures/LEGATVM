export interface Proof {
  id: string;
  chapterId: string;
  questions: Question[];
  timeLimit: number;
}

export interface Question {
  id: string;
  ProofId: string;
  question: string;
  options: Option[];
  correctAnswers: string[];
}

export interface Option {
  id: string;
  text: string;
}
