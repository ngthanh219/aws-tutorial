export interface Question {
    id: number;
    question: string;
    answers: string[];
    correctAnswer: number;
    selectedAnswer: number;
    explanation: string;
}

export interface QuestionData {
    en: Question[];
    vi: Question[];
}

export interface SelectedQuestionData {
    qIndex: number;
    aIndex: number;
    value: string;
}
