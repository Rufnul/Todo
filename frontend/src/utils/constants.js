// Application constants
export const APP_NAME = 'Todo App';
export const APP_VERSION = '1.0.0';

// Todo priorities
export const PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
};

// Priority colors for UI
export const PRIORITY_COLORS = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
};

// Priority icons
export const PRIORITY_ICONS = {
    low: '👍',
    medium: '⚠️',
    high: '🔥',
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
};

// Date format options
export const DATE_FORMATS = {
    SHORT: {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    },
    LONG: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    },
};