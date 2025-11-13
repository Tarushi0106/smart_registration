const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword, terms } = req.body || {};
  const errors = [];

  if (!firstName || String(firstName).trim() === '') errors.push({ path: 'firstName', msg: 'First name is required' });
  if (!lastName || String(lastName).trim() === '') errors.push({ path: 'lastName', msg: 'Last name is required' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push({ path: 'email', msg: 'A valid email is required' });
  if (!phone || String(phone).trim().length < 6) errors.push({ path: 'phone', msg: 'A valid phone is required' });
  if (!password || String(password).length < 8) errors.push({ path: 'password', msg: 'Password must be at least 8 characters' });
  if (!(terms === true || terms === 'true' || terms === 'on' || terms === 1 || terms === '1')) errors.push({ path: 'terms', msg: 'You must accept the Terms & Conditions' });

  if (errors.length) {
    return res.status(400).json({ success: false, errors, message: 'Validation failed' });
  }

  return res.json({ success: true, message: 'Registered (demo)' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

function startServer(port, attempts = 0) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempts < 10) {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      setTimeout(() => startServer(port + 1, attempts + 1), 200);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
