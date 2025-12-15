'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Register function
    const register = async (name, email, password) => {
        try {
            setError(null);
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Registration failed with status ${response.status}`);
            }

            if (!data.success) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);

            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setError(null);
    }, []);

    // Clear error function
    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                login,
                register,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}