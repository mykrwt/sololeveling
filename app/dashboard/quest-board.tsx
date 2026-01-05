'use client';

import { useState } from 'react';
import { logExercise } from './actions';
import { useRouter } from 'next/navigation';

interface QuestData {
    pushups: number;
    situps: number;
    squats: number;
    run: number;
    isCompleted: boolean;
}

const TARGETS = {
    pushups: 100,
    situps: 100,
    squats: 100,
    run: 10,
};

export default function QuestBoard({ initialQuest }: { initialQuest: QuestData }) {
    const [quest, setQuest] = useState(initialQuest);
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdate = async (type: keyof QuestData, amount: number) => {
        setLoading(type);
        try {
            // Optimistic update
            setQuest(prev => ({
                ...prev,
                [type]: (prev[type] as number) + amount
            }));

            await logExercise(type, amount);
            router.refresh();
        } catch (error) {
            console.error(error);
            // Revert optimistic? Complex without exact previous state but simpler to just refresh or ignore.
        } finally {
            setLoading(null);
        }
    };

    const renderItem = (label: string, key: keyof typeof TARGETS, unit: string = '') => {
        const current = quest[key];
        const target = TARGETS[key];
        const progress = Math.min((current / target) * 100, 100);
        const isDone = current >= target;

        return (
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <span className="uppercase font-bold text-sm tracking-wider">{label}</span>
                    <span className="font-mono text-blue-400">
                        {current} / {target} {unit}
                    </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {!isDone && (
                    <div className="flex gap-2 justify-end">
                        <button
                            disabled={!!loading}
                            onClick={() => handleUpdate(key, 10)}
                            className="px-3 py-1 text-xs glass hover:bg-white/10 rounded uppercase"
                        >
                            +10
                        </button>
                        <button
                            disabled={!!loading}
                            onClick={() => handleUpdate(key, 1)}
                            className="px-3 py-1 text-xs glass hover:bg-white/10 rounded uppercase"
                        >
                            +1
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (quest.isCompleted) {
        return (
            <div className="p-6 text-center border border-green-500/30 bg-green-900/10 rounded-lg">
                <h3 className="text-2xl font-bold text-green-400 mb-2 uppercase tracking-widest">
                    Quest Completed
                </h3>
                <p className="text-sm text-green-200/70">
                    Rewards have been distributed.
                </p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {renderItem('Push-ups', 'pushups')}
            {renderItem('Sit-ups', 'situps')}
            {renderItem('Squats', 'squats')}
            {renderItem('Running', 'run', 'km')}
        </div>
    );
}
