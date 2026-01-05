import { redis } from '@/lib/redis';
import { getSession } from '@/lib/auth';
import { getDailyQuest } from '@/lib/game';
import { redirect } from 'next/navigation';
import QuestBoard from './quest-board';
import LogoutButton from './logout-button'; // Small client component

export default async function Dashboard() {
    const session = await getSession();
    if (!session || !session.sub) {
        redirect('/login');
    }

    const userId = session.sub as string;
    const user = await redis.hgetall(`user:${userId}`) as any;
    const quest = await getDailyQuest(userId);

    if (!user) {
        // Edge case: session exists but data gone?
        redirect('/login');
    }

    return (
        <main className="min-h-screen p-4 md:p-8 space-y-8 pb-20">
            {/* Header */}
            <header className="flex justify-between items-center glass p-4 animate-enter">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-blue-400">
                        Player Status
                    </h1>
                    <p className="text-xs text-muted">ID: {user.username}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-yellow-500 font-mono">LEVEL {user.level}</div>
                    <div className="text-xs text-muted">JOB: {user.job || 'None'}</div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-enter" style={{ animationDelay: '0.1s' }}>
                <StatBox label="Strength" value={user.strength} />
                <StatBox label="Agility" value={user.agility} />
                <StatBox label="Sense" value={user.sense} />
                <StatBox label="Vitality" value={user.vitality} />
                <StatBox label="Intelligence" value={user.intelligence} />
                <StatBox label="Gold" value={user.gold} color="text-yellow-400" />
            </div>

            {/* Daily Quest Section */}
            <section className="glass p-6 animate-enter border-blue-900/50" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-bold mb-4 uppercase text-red-500 tracking-wider glow-red">
                    Daily Quest: Prepare Yourself
                </h2>
                <p className="text-sm text-muted mb-6">
                    [Incomplete] Failure to complete will result in a penalty.
                </p>

                <QuestBoard initialQuest={quest} />
            </section>

            <div className="fixed bottom-4 right-4">
                <LogoutButton />
            </div>
        </main>
    );
}

function StatBox({ label, value, color = 'text-white' }: { label: string, value: string | number, color?: string }) {
    return (
        <div className="glass p-4 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
            <span className="text-xs uppercase text-muted mb-1">{label}</span>
            <span className={`text-2xl font-mono font-bold ${color}`}>{value}</span>
        </div>
    );
}
