'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Something went wrong');
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="system-box w-full max-w-sm glass p-8 animate-enter">
                <h2 className="text-xl font-bold mb-6 text-center text-blue-400 uppercase tracking-widest">
                    {isLogin ? 'Player Login' : 'Player Registration'}
                </h2>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 mb-4 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs uppercase text-blue-300 mb-1">Codenames</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input"
                            placeholder="HUNTER NAME"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-blue-300 mb-1">Passkey</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="ACCESS CODE"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mt-4 uppercase tracking-widest" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Enter System' : 'Awaken')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-wider hover:underline"
                    >
                        {isLogin ? 'New Hunter? Register' : 'Already Awakened? Login'}
                    </button>
                </div>
            </div>
        </main>
    );
}
