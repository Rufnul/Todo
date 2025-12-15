// =========================
// API BASE URL (VALIDATED)
// =========================
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

// =========================
// CORE API REQUEST FUNCTION
// =========================
export const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');

        const headers = {
            ...options.headers,
        };

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle auth expiration globally
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `Request failed with status ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        throw new Error(error.message || 'Network error or server unavailable');
    }
};

// =========================
// AUTH APIs
// =========================
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

// =========================
// TODOS APIs
// =========================
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
