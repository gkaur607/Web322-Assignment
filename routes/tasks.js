const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const ensureLogin = require('../helpers/authHelper');

// Protect all task routes
router.use(ensureLogin);

// Helper to get user's tasks
const getUserTasks = (userId) => Task.findAll({
  where: { userId },
  order: [['dueDate', 'ASC'], ['createdAt', 'DESC']]
});

// Dashboard
router.get('/dashboard', async (req, res) => {
  const total = await Task.count({ where: { userId: req.session.user.id } });
  const completed = await Task.count({ where: { userId: req.session.user.id, status: 'completed' } });
  const pending = total - completed;
  res.render('dashboard', { total, completed, pending });
});

// List all tasks (main page)
router.get('/tasks', async (req, res) => {
  const tasks = await getUserTasks(req.session.user.id);
  res.render('tasks/index', { tasks, taskToEdit: null });
});

// Show edit form (same page, with taskToEdit)
router.get('/tasks/edit/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.session.user.id }
    });
    if (!task) return res.status(404).send('Task not found');

    const tasks = await getUserTasks(req.session.user.id);
    res.render('tasks/index', { tasks, taskToEdit: task });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update task
router.post('/tasks/edit/:id', async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    await Task.update({
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      status: status || 'pending'
    }, {
      where: { id: req.params.id, userId: req.session.user.id }
    });
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
});

// Add new task
router.get('/tasks/add', (req, res) => {
  res.render('tasks/add');
});

router.post('/tasks/add', async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  await Task.create({
    title: title.trim(),
    description: description.trim() || null,
    dueDate: dueDate || null,
    status: status || 'pending',
    userId: req.session.user.id
  });
  res.redirect('/tasks');
});

// Delete task
router.post('/tasks/delete/:id', async (req, res) => {
  await Task.destroy({
    where: { id: req.params.id, userId: req.session.user.id }
  });
  res.redirect('/tasks');
});

// Toggle status
router.post('/tasks/status/:id', async (req, res) => {
  const task = await Task.findOne({
    where: { id: req.params.id, userId: req.session.user.id }
  });
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();
  }
  res.redirect('/tasks');
});

module.exports = router;