import express from 'express';
import Todo from '../models/todoModels.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all todos for authenticated user
router.get('/', protect, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.json({ success: true, todos });
    } catch (error) {
        console.error('Get Todos Error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create todo
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        const todo = await Todo.create({
            user: req.user._id,
            title,
            description,
            dueDate,
            priority,
        });

        return res.status(201).json({ success: true, todo });
    } catch (error) {
        console.error('Create Todo Error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update todo
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, description, completed, dueDate, priority } = req.body;

        const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

        if (!todo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        todo.title = title ?? todo.title;
        todo.description = description ?? todo.description;
        todo.completed = completed ?? todo.completed;
        todo.dueDate = dueDate ?? todo.dueDate;
        todo.priority = priority ?? todo.priority;

        await todo.save();
        return res.json({ success: true, todo });
    } catch (error) {
        console.error('Update Todo Error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete todo
router.delete('/:id', protect, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!todo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        return res.json({ success: true, message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Delete Todo Error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
