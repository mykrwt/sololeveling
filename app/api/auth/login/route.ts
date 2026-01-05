import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { signToken, setSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const userId = await redis.hget('users:lookup', username) as string | null;
        if (!userId) {
            return NextResponse.json({ message: 'Hunter not found' }, { status: 404 });
        }

        const start = Date.now();
        const user = await redis.hgetall(`user:${userId}`) as Record<string, any>;
        // Check password
        // Wait, redis hgetall returns object with strings usually.
        // user.passwordHash
        if (!user || !user.passwordHash) {
            return NextResponse.json({ message: 'Hunter profile corrupted' }, { status: 500 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ message: 'Invalid Access Code' }, { status: 401 });
        }

        const token = await signToken({ sub: userId, username: user.username });
        await setSession(token);

        return NextResponse.json({ message: 'Access Granted' });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'System Error' }, { status: 500 });
    }
}
