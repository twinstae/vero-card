import type { Card } from '../../domain/card';
import type { LearningHistory } from '../../domain/learning-history';
import type { Problem } from '../../domain/problem';
import { readFile, writeFile } from "node:fs/promises";
import type { ICardRepository, ILearningHistoryRepository, IProblemRepository } from './fake-repositories';

async function loadFileStore<T>(name: string){
    const path = "./" + name + ".json";
    const _state = await readFile(path, { encoding: "utf-8" }).then(text => JSON.parse(text)) as Record<string, T>;
    return {
        values(){
            return Object.values(_state)
        },
        get(key: string){
            return _state[key];
        },
        set(key: string, value: T){
            _state[key] = value;
            return writeFile(path, JSON.stringify(_state[key]), { encoding: "utf-8" });
        }
    }

}

export async function createFsCardRepository(): Promise<ICardRepository> {
    const store = await loadFileStore<Card>("cards");
    return {
        async getAllCardList(): Promise<Card[]> {
            return [...store.values()];
        },
        async createCard(newCard: Card): Promise<void> {
            store.set(newCard.id, newCard);
        }
    }
}


export async function createFsProblemRepository(): Promise<IProblemRepository> {
    const store = await loadFileStore<Problem>("problems");
    return {
        async getAllProblemList(): Promise<Problem[]> {
            return [...store.values()];
        },
        async getProblemById(problemId) {
            return store.get(problemId);
        },
        async createProblem(newProblem: Problem): Promise<void> {
            store.set(newProblem.id, newProblem);
        }
    }
}



export async function createFsLearningHistoryRepository(initState: Map<string, LearningHistory>): Promise<ILearningHistoryRepository> {
    const store = await loadFileStore<LearningHistory>("learning-histories");

    return {
        async getLearningHistoryListByLearnerId(learnerId: string): Promise<LearningHistory[]> {
            return [...store.values()]
                .filter(item => item.learnerId === learnerId);
        },
        async getLearningHistoryListByCardIdAndLearnerId(cardId: string, learnerId: string): Promise<LearningHistory[]> {
            return [...store.values()]
                .filter(item => item.cardId === cardId)
                .filter(item => item.learnerId === learnerId);
        },
        async createLearningHistory(newLearningHistory: LearningHistory): Promise<void> {
            store.set(newLearningHistory.id, newLearningHistory);
        }
    }
}