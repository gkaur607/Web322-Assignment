const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const ensureLogin = require('../helpers/authHelper');

// Protect everything below
router.use(ensureLogin);

// Dashboard
router.get('/dashboard', async (req, res) => {
  const total = await Task.count({ where: { userId: req.session.user.id } });
  const completed = await Task.count({ where: { userId: req.session.user.id, status: 'completed' } });
  res.render('dashboard', { total, completed });
});

// List tasks
router.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.session.user.id },
    order: [['dueDate', 'ASC'], ['createdAt', 'DESC']]
  });
  res.render('tasks/index', { tasks });
});

// Add task
router.get('/tasks/add', (req, res) => res.render('tasks/add'));

router.post('/tasks/add', async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  await Task.create({
    title,
    description: description || null,
    dueDate: dueDate || null,
    status: status || 'pending',
    userId: req.session.user.id
  });
  res.redirect('/tasks');
});

// Delete
router.post('/tasks/delete/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id, userId: req.session.user.id } });
  res.redirect('/tasks');
});

// Toggle status
router.post('/tasks/status/:id', async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.session.user.id } });
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();
  }
  res.redirect('/tasks');
});

router.get('/tasks/edit/:id', async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.session.user.id } });
  if (!task) return res.status(404).send('Not found');
  res.render('tasks/edit', { task });
});

router.post('/tasks/edit/:id', async (req, res) => {
  await Task.update(req.body, { where: { id: req.params.id, userId: req.session.user.id } });
  res.redirect('/tasks');
});

module.exports = router;