export type Problem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cardId: string; // 이 카드 id는 변하는 것인가?
} & (
  | {
      type: 'yes-or-no';
      content: {
        question: string;
        answer: boolean;
      };
    }
  | {
      type: 'short-answer' | 'long-answer';
      content: {
        question: string;
        answer: string;
      };
    }
  | {
      type: 'selection';
      content: {
        question: string;
        options: {
          text: string;
          isAnswer: boolean;
        }[];
      };
    }
);
