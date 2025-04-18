const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const File = require('./models/File');
const Chat = require('./models/Chat');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const deleteRoute = require('./routes/delete');
const chatRoute = require('./routes/chat');
const chatWithPdf = require('./utils/chatWithPdf');

const app = express();
connectDB(MONGO_URI); 

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
app.use(express.json()); 


app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 2,
  }
}));

function authMiddleware(req, res, next) {
  if (!req.session.userId) return res.redirect('/');
  next();
}


app.use(authRoutes);
app.use(uploadRoutes);
app.use(deleteRoute);
app.use(chatRoute);




app.get('/', (req, res) => {
  const errorMessage = req.query.errorMessage || null;
  res.render('login', { errorMessage });
});
app.get('/register', (req, res) => {
  const errorMessage = req.query.errorMessage || null;
  res.render('register', { errorMessage });
});


app.get('/dashboard', authMiddleware, async (req, res) => {
  const files = await File.find({ userId: req.session.userId }).sort({ createdAt: -1 });

  res.render('dashboard', { files });
});

app.get('/chatroom', authMiddleware, async (req, res) => {
  const fileId = req.query.fileId;
  const userId = req.session.userId;

  const history = await Chat.find({ userId, fileId }).sort({ timestamp: 1 });
  res.render('chat', { fileId, history });
});
app.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.redirect('/'); 
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
