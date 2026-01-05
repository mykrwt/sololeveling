'use server';

import { getSession } from '@/lib/auth';
import { updateQuestProgress, getDailyQuest } from '@/lib/game';
import { revalidatePath } from 'next/cache';

export async function logExercise(type: string, amount: number) {
    const session = await getSession();
    if (!session || !session.sub) throw new Error('Unauthorized');

    await updateQuestProgress(session.sub as string, type as any, amount);
    revalidatePath('/dashboard');
}

export async function checkStatus() {
    const session = await getSession();
    if (!session || !session.sub) return null;
    return await getDailyQuest(session.sub as string);
}
