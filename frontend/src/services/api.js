// =========================
// API CONFIG
// =========================
const getBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
        throw new Error('NEXT_PUBLIC_API_URL is missing');
    }
    return url;
};

// =========================
// CORE API REQUEST FUNCTION
// =========================
export const apiRequest = async (endpoint, options = {}) => {
    const API_BASE_URL = getBaseUrl();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;

        const headers = {
            ...(options.headers || {}),
        };

        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });

        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const text = await response.text();
            let message;

            try {
                message = JSON.parse(text).message;
            } catch {
                message = text || `Request failed (${response.status})`;
            }

            throw new Error(message);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
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

    getCurrentUser: () =>
        apiRequest('/auth/me', {
            method: 'GET',
        }),
};

// =========================
// TODOS APIs
// =========================
export const todosAPI = {
    getAll: () =>
        apiRequest('/todos', {
            method: 'GET',
        }),

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
