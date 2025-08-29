
export interface Category {
  id: string;
  title: string;
  description: string;
  topics: string;
}

export interface DistractorExplanation {
    option: string;
    explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  distractorExplanations: DistractorExplanation[];
}

export interface QuizResponse {
    quiz: QuizQuestion[];
}

export type UserAnswer = {
    questionIndex: number;
    answer: string;
};

export enum AppView {
    CATEGORY_SELECTION,
    QUIZ,
    RESULTS,
}
