/********************************************************************************
 * WEB322 – Assignment 03
 * 
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 * 
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 * 
 * Name: _____Gurleen Kaur______ Student ID: _____153611231______ Date: _____2025-12-02_______
 ********************************************************************************/

require('dotenv').config();

const express = require('express');
const session = require('client-sessions');
const path = require('path');
const { connectMongo, connectPostgres } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Critical Fix: Use absolute path for static files (Vercel fix)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  cookieName: 'session',
  secret: process.env.SESSION_SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  ephemeral: true
}));

// Make user available in templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/tasks'));

app.get('/', (req, res) => {
  req.session.user ? res.redirect('/dashboard') : res.redirect('/login');
});

// 404
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

async function startServer() {
  try {
    await connectMongo();
    await connectPostgres();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;