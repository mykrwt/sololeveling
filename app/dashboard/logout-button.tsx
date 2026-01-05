'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-400 uppercase tracking-widest bg-black/50 px-3 py-2 rounded border border-red-900/50 hover:border-red-500"
        >
            Log Out
        </button>
    );
}
