'use client';

import { useState, useEffect, useContext } from 'react';
import TodoItem from './TodoItem';
import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/services/api';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);
    
    // Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);

    useEffect(() => {
        if (token) {
            fetchTodos();
        }
    }, [token]);

    const fetchTodos = async () => {
        try {
            setError('');
            const response = await fetch(`${API_BASE_URL}/todos`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const data = await response.json();
            setTodos(data.todos || data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            setError('Failed to load todos');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (!token) {
            setError('You must be logged in to add todos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    dueDate: dueDate || null,
                    priority,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create todo');
            }

            const newTodo = await response.json();
            setTodos([newTodo.todo || newTodo, ...todos]);

            // Reset form
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('medium');

        } catch (error) {
            console.error('Error creating todo:', error);
            setError(error.message || 'Failed to create todo');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete confirmation
    const handleDeleteClick = (id, title) => {
        setTodoToDelete({ id, title });
        setShowDeleteModal(true);
    };

    // Handle delete after confirmation
    const handleDeleteConfirm = async () => {
        if (!todoToDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/todos/${todoToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            setTodos(todos.filter(todo => todo._id !== todoToDelete.id));
            setShowDeleteModal(false);
            setTodoToDelete(null);
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError(error.message || 'Failed to delete todo');
            setShowDeleteModal(false);
            setTodoToDelete(null);
        }
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setTodoToDelete(null);
    };

    const handleUpdate = async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            setTodos(todos.map(todo =>
                todo._id === id ? (updatedTodo.todo || updatedTodo) : todo
            ));
        } catch (error) {
            console.error('Error updating todo:', error);
            setError(error.message || 'Failed to update todo');
        }
    };

    const handleToggleComplete = async (id, completed) => {
        await handleUpdate(id, { completed: !completed });
    };

    const handleEdit = async (id, updatedData) => {
        await handleUpdate(id, updatedData);
    };

    // Filter todos
    const completedTodos = todos.filter(todo => todo.completed);
    const pendingTodos = todos.filter(todo => !todo.completed);

    if (!token) {
        return (
            <div className="text-center py-12">
                <div className="text-2xl font-semibold text-gray-700 mb-4">
                    Please login to manage your todos
                </div>
                <p className="text-gray-500">
                    You need to be logged in to view and manage your todo list.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                itemName={todoToDelete?.title || 'this todo'}
            />

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add New Todo
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field text-black"
                            placeholder="What needs to be done?"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field text-black"
                            placeholder="Add more details about this task..."
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="input-field text-black"
                                disabled={loading}
                            >
                                <option value="low">📗 Low Priority</option>
                                <option value="medium">📒 Medium Priority</option>
                                <option value="high">📕 High Priority</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Due Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="input-field text-black"
                                disabled={loading}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="w-full btn-primary mt-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding Todo...
                        </span>
                    ) : (
                        'Add Todo'
                    )}
                </button>
            </form>

            <div className="space-y-8">
                {/* Pending Todos */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Pending Todos ({pendingTodos.length})
                        </h3>
                        {pendingTodos.length > 0 && (
                            <button
                                onClick={fetchTodos}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Refresh
                            </button>
                        )}
                    </div>

                    {pendingTodos.length > 0 ? (
                        <div className="space-y-4">
                            {pendingTodos.map(todo => (
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                    onDelete={handleDeleteClick}
                                    onUpdate={handleEdit}
                                    onToggleComplete={handleToggleComplete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <h4 className="text-lg font-medium text-gray-700 mb-2">No pending todos</h4>
                            <p className="text-gray-500">Great job! All tasks are completed.</p>
                        </div>
                    )}
                </div>

                {/* Completed Todos */}
                {completedTodos.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Completed Todos ({completedTodos.length})
                        </h3>
                        <div className="space-y-4 opacity-80">
                            {completedTodos.map(todo => (
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                    onDelete={handleDeleteClick}
                                    onUpdate={handleEdit}
                                    onToggleComplete={handleToggleComplete}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}