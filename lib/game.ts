import { redis } from './redis';

const DAILY_QUEST_KEY = (userId: string) => `user:${userId}:daily:${new Date().toISOString().split('T')[0]}`;

export interface DailyQuest {
    pushups: number;
    situps: number;
    squats: number;
    run: number; // km
    isCompleted: boolean;
    claimed: boolean;
}

const DEFAULT_QUEST: DailyQuest = {
    pushups: 0,
    situps: 0,
    squats: 0,
    run: 0,
    isCompleted: false,
    claimed: false
};

const TARGETS = {
    pushups: 100,
    situps: 100,
    squats: 100,
    run: 10,
};

export async function getDailyQuest(userId: string): Promise<DailyQuest> {
    const key = DAILY_QUEST_KEY(userId);
    const quest = await redis.hgetall(key);

    if (!quest || Object.keys(quest).length === 0) {
        await redis.hset(key, DEFAULT_QUEST);
        return DEFAULT_QUEST;
    }

    // Convert strings to numbers/booleans because Redis stores everything as string usually (unless using JSON commands, but hset/hgetall uses map)
    return {
        pushups: parseInt(quest.pushups as string) || 0,
        situps: parseInt(quest.situps as string) || 0,
        squats: parseInt(quest.squats as string) || 0,
        run: parseInt(quest.run as string) || 0,
        isCompleted: quest.isCompleted === 'true',
        claimed: quest.claimed === 'true',
    };
}

export async function updateQuestProgress(userId: string, type: keyof DailyQuest, amount: number) {
    const key = DAILY_QUEST_KEY(userId);
    // Increment logic or set?
    // User sets "I did 10 pushups".
    // Let's assume we just increment.

    await redis.hincrby(key, type as string, amount);

    // Check completion
    const data = await getDailyQuest(userId);
    if (!data.isCompleted) {
        const isDone =
            data.pushups >= TARGETS.pushups &&
            data.situps >= TARGETS.situps &&
            data.squats >= TARGETS.squats &&
            data.run >= TARGETS.run;

        if (isDone) {
            await redis.hset(key, { isCompleted: true });
        }
    }
}
