import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <div className="system-box max-w-md w-full animate-enter">
                <h1 className="text-2xl font-bold mb-4 tracking-wider uppercase text-blue-400">System Notification</h1>
                <p className="mb-6 text-lg">
                    Player, you have been selected to awaken your potential.
                </p>
                <div className="flex flex-col gap-4">
                    <Link href="/login" className="btn btn-primary w-full uppercase tracking-widest">
                        Accept
                    </Link>
                </div>
            </div>
        </main>
    );
}
