'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            TodoApp
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-primary bg-red-600 hover:bg-red-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}