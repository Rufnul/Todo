// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for making API requests
export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
};

// Auth API functions
export const authAPI = {
    register: (name, email, password) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),

    login: (email, password) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    getCurrentUser: () => apiRequest('/auth/me'),
};

// Todos API functions
export const todosAPI = {
    getAll: () => apiRequest('/todos'),

    create: (todoData) =>
        apiRequest('/todos', {
            method: 'POST',
            body: JSON.stringify(todoData),
        }),

    update: (id, updates) =>
        apiRequest(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/todos/${id}`, {
            method: 'DELETE',
        }),
};