// server.js
// Simple Express + Socket.IO server with GitHub OAuth login (demo)
// Environment variables: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET, BASE_URL, PORT
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('Warning: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are not set. OAuth will not work until they are configured.');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Simple SQLite DB (file: chat.db) ---
const db = new sqlite3.Database(path.join(__dirname, 'chat.db'));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    github_id INTEGER UNIQUE,
    username TEXT,
    avatar_url TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// --- Helper: issue JWT for local user id ---
function issueToken(user) {
  return jwt.sign({ id: user.id, github_id: user.github_id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
}

// --- OAuth routes ---
app.get('/auth/login', (req, res) => {
  const redirectUri = `${BASE_URL}/auth/callback`;
  const scope = encodeURIComponent('read:user user:email');
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code.');

  try {
    const tokenResp = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = tokenResp.data.access_token;
    if (!accessToken) return res.status(500).send('Failed to obtain access token.');

    const userResp = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'github-messaging-demo'
      }
    });

    const gh = userResp.data;
    db.serialize(() => {
      db.get('SELECT id FROM users WHERE github_id = ?', [gh.id], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).send('DB error');
        }
        if (row) {
          db.run('UPDATE users SET username = ?, avatar_url = ? WHERE id = ?', [gh.login, gh.avatar_url, row.id], function(err2) {
            if (err2) console.error(err2);
            const token = issueToken({ id: row.id, github_id: gh.id, username: gh.login });
            return res.redirect(`/?token=${token}`);
          });
        } else {
          db.run('INSERT INTO users (github_id, username, avatar_url) VALUES (?, ?, ?)', [gh.id, gh.login, gh.avatar_url], function(err3) {
            if (err3) {
              console.error(err3);
              return res.status(500).send('DB error on insert');
            }
            const newId = this.lastID;
            const token = issueToken({ id: newId, github_id: gh.id, username: gh.login });
            return res.redirect(`/?token=${token}`);
          });
        }
      });
    });
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    return res.status(500).send('OAuth callback error');
  }
});

// --- Auth middleware ---
function authenticate(req, res, next) {
  const header = req.headers.authorization || req.query.token;
  let token = null;
  if (header && typeof header === 'string' && header.startsWith('Bearer ')) token = header.split(' ')[1];
  else if (header) token = header;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- API ---
app.get('/api/me', authenticate, (req, res) => {
  db.get('SELECT id, github_id, username, avatar_url FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

app.get('/api/users', authenticate, (req, res) => {
  db.all('SELECT id, github_id, username, avatar_url FROM users WHERE id != ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

app.get('/api/conversations/:otherId', authenticate, (req, res) => {
  const other = parseInt(req.params.otherId, 10);
  if (!other) return res.status(400).json({ error: 'Invalid other user id' });
  db.all(
    'SELECT id, sender_id, receiver_id, content, created_at FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC',
    [req.user.id, other, other, req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});

app.post('/api/messages', authenticate, (req, res) => {
  const { to, content } = req.body;
  const toId = parseInt(to, 10);
  if (!toId || !content) return res.status(400).json({ error: 'Missing to or content' });

  db.run('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)', [req.user.id, toId, content], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    const message = { id: this.lastID, sender_id: req.user.id, receiver_id: toId, content, created_at: new Date().toISOString() };
    io.to(`user:${toId}`).emit('message', message);
    io.to(`user:${req.user.id}`).emit('message', message);
    res.json(message);
  });
});

// --- Socket.IO auth & events ---
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('Missing token'));
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = payload;
    socket.join(`user:${payload.id}`);
    return next();
  } catch (err) {
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('socket connected, user id=', socket.user.id);

  socket.on('send_message', (data) => {
    const { to, content } = data;
    const toId = parseInt(to, 10);
    if (!toId || !content) return socket.emit('error', 'Invalid payload');

    db.run('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)', [socket.user.id, toId, content], function(err) {
      if (err) {
        console.error(err);
        return socket.emit('error', 'DB error');
      }
      const message = { id: this.lastID, sender_id: socket.user.id, receiver_id: toId, content, created_at: new Date().toISOString() };
      io.to(`user:${toId}`).emit('message', message);
      io.to(`user:${socket.user.id}`).emit('message', message);
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Open ${BASE_URL} in your browser (remember to set GITHUB_CLIENT_ID/SECRET)`);
});
