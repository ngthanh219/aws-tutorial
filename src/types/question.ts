export interface Question {
    id: number;
    question: string;
    answers: string[];
    correct_answer: number;
    selected_answer: number | null;
    explanation: string;
}

export interface INewQuestion{
    en: Question;
    vi: Question;
}

export interface SelectedQuestionData {
    qIndex: number;
    aIndex: number;
    value: string;
}
