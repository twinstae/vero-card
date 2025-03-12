export type LearningHistory = {
    id: string;
    createdAt: Date;
    cardId: string;
    problemId: string;
    answer: string;
    isRight: boolean;
    learnerId: string;
}