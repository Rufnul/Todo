'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import TodoList from '@/components/TodoList';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Here&apos;s what you need to do today.
                        </p>
                    </div>

                    <div className="card">
                        <TodoList />
                    </div>
                </div>
            </main>
        </div>
    );
}