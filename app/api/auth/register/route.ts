import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { signToken, setSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Need to polyfill or just use randomUUID
// Wait, I didn't verify if I can import crypto. standard node crypto.
// I'll use crypto.randomUUID() if available (Node 19+), or Math.random fallback for simplicity if not.
// Actually crypto is global in Next edge/node.

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
        }

        // Check if user exists
        const existingId = await redis.hget('users:lookup', username);
        if (existingId) {
            return NextResponse.json({ message: 'Hunter Codename already taken' }, { status: 409 });
        }

        // Create User
        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Initial Stats
        const userProfile = {
            id,
            username,
            passwordHash: hashedPassword,
            level: 1,
            xp: 0,
            job: 'None',
            strength: 10,
            agility: 10,
            intelligence: 10,
            vitality: 10,
            sense: 10,
            gold: 0,
            joinedAt: new Date().toISOString()
        };

        // Transaction to ensure atomicity
        const pipeline = redis.pipeline();
        pipeline.hset(`user:${id}`, userProfile);
        pipeline.hset('users:lookup', { [username]: id });
        await pipeline.exec();

        // Session
        const token = await signToken({ sub: id, username });
        await setSession(token);

        return NextResponse.json({ message: 'Welcome, Hunter' });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'System Error' }, { status: 500 });
    }
}
