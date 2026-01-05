import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'System Authorization | Solo Leveling',
    description: 'Gamified Habit Tracker. Reawaken your potential.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
