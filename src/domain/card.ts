export type Card = {
    id: string;
    version: string; // 최신 버전임을 어떻게 알까?
    createdAt: Date;
    type: "concept" | "material"
    title: string;
    content: string;
    links: string[];
    refCardId: string[]; // 연결된 카드의 id
}
