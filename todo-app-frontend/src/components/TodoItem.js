'use client';

import { useState } from 'react';

export default function TodoItem({ todo, onDelete, onUpdate, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⚠️';
      case 'low':
        return '👍';
      default:
        return '📝';
    }
  };

  const handleSave = () => {
    onUpdate(todo._id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div className={`border rounded-xl p-4 transition-all duration-300 ${todo.completed
        ? 'bg-gray-50 opacity-75 border-gray-300'
        : isOverdue
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200 hover:shadow-lg hover:border-blue-300'
      }`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input-field text-black"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="input-field text-black"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="input-field text-black"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start">
          {/* Checkbox */}
          <div className="flex-shrink-0 mr-3 pt-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleComplete(todo._id, todo.completed)}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.title}
                </h4>

                {todo.description && (
                  <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getPriorityColor(todo.priority)}`}>
                    {getPriorityIcon(todo.priority)} {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                  </span>

                  {todo.dueDate && (
                    <span className={`text-xs px-2.5 py-1 rounded-full ${isOverdue ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                      📅 Due: {formatDate(todo.dueDate)}
                      {isOverdue && ' ⚠️ Overdue'}
                    </span>
                  )}

                  <span className="text-xs text-gray-500">
                    📅 Created: {formatDate(todo.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {!todo.completed && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition flex items-center"
                    title="Edit"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                )}

                <button
                  onClick={() => onDelete(todo._id, todo.title)}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition flex items-center"
                  title="Delete"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}