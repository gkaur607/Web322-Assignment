require('dotenv').config();

const express = require('express');
const session = require('client-sessions');
const path = require('path');
const { connectMongo, connectPostgres } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8080;  // Vercel fallback (not 3000)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/tasks'));

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

module.exports = app;

async function startServer() {
  try {
    await connectMongo();
    await connectPostgres();
    
    console.log('Server ready on Vercel');
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);  
  }
}

startServer();
module.exports = app;