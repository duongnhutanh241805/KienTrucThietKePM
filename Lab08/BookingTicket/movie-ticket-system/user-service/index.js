const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const amqp = require('amqplib');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8081;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const JWT_SECRET = process.env.JWT_SECRET || 'movie_ticket_secret_2024';

// In-memory DB (thay bằng MongoDB/PostgreSQL thực tế)
const users = [];

let channel;

async function connectRabbitMQ() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange('movie_events', 'topic', { durable: true });
    console.log('✅ [User Service] Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ connection failed:', err.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}

async function publishEvent(eventType, data) {
  if (!channel) return;
  const message = JSON.stringify({ eventType, data, timestamp: new Date().toISOString() });
  channel.publish('movie_events', eventType, Buffer.from(message), { persistent: true });
  console.log(`📤 Published event: ${eventType}`, data);
}

// ─── ROUTES ───────────────────────────────────────────────

// POST /register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(409).json({ error: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    // Publish USER_REGISTERED event
    await publishEvent('USER_REGISTERED', {
      userId: user.id,
      name: user.name,
      email: user.email
    });

    const { password: _, ...userResponse } = user;
    res.status(201).json({ message: 'Đăng ký thành công!', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Đăng nhập thành công!', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users (debug)
app.get('/users', (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service', port: PORT }));

// ─── START ────────────────────────────────────────────────
connectRabbitMQ();
app.listen(PORT, () => {
  console.log(`🚀 User Service chạy tại http://localhost:${PORT}`);
});
