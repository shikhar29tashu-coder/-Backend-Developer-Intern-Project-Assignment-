const express = require('express');
const { body, param } = require('express-validator');
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const tasks = await Task.find(query).populate('owner', 'name email role');
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, status } = req.body;
      const task = await Task.create({ title, description, status: status || 'pending', owner: req.user._id });
      res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', [param('id').isMongoId().withMessage('Invalid task ID')], validate, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'name email role');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.user.role !== 'admin' && task.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      Object.assign(task, req.body);
      await task.save();
      res.json({ task });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid task ID')], validate, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/stats', authorize('admin'), async (req, res, next) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: 'completed' });
    const pending = await Task.countDocuments({ status: 'pending' });
    res.json({ total, completed, pending });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
