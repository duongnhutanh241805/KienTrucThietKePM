const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const amqp = require('amqplib');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8083;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const MOVIE_SERVICE_URL = process.env.MOVIE_SERVICE_URL || 'http://localhost:8082';
const JWT_SECRET = process.env.JWT_SECRET || 'movie_ticket_secret_2024';

// In-memory DB
const bookings = [];

let channel;

async function connectRabbitMQ() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange('movie_events', 'topic', { durable: true });

    // Lắng nghe kết quả payment để cập nhật trạng thái booking
    const q = await channel.assertQueue('booking_updates', { durable: true });
    await channel.bindQueue(q.queue, 'movie_events', 'PAYMENT_COMPLETED');
    await channel.bindQueue(q.queue, 'movie_events', 'BOOKING_FAILED');

    channel.consume(q.queue, (msg) => {
      if (!msg) return;
      const event = JSON.parse(msg.content.toString());
      handlePaymentResult(event);
      channel.ack(msg);
    });

    console.log('✅ [Booking Service] Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ connection failed:', err.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}

function handlePaymentResult(event) {
  const { eventType, data } = event;
  const booking = bookings.find(b => b.id === data.bookingId);
  if (!booking) return;

  if (eventType === 'PAYMENT_COMPLETED') {
    booking.status = 'CONFIRMED';
    booking.updatedAt = new Date().toISOString();
    console.log(`✅ Booking #${booking.id} đã được xác nhận`);
  } else if (eventType === 'BOOKING_FAILED') {
    booking.status = 'FAILED';
    booking.updatedAt = new Date().toISOString();
    console.log(`❌ Booking #${booking.id} thất bại`);
  }
}

async function publishEvent(eventType, data) {
  if (!channel) return;
  const message = JSON.stringify({ eventType, data, timestamp: new Date().toISOString() });
  channel.publish('movie_events', eventType, Buffer.from(message), { persistent: true });
  console.log(`📤 Published event: ${eventType}`, data);
}

// Middleware xác thực JWT (tuỳ chọn)
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Thiếu token xác thực' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

// ─── ROUTES ───────────────────────────────────────────────

// POST /bookings - tạo booking mới
app.post('/bookings', authMiddleware, async (req, res) => {
  try {
    const { movieId, seats } = req.body;
    const { userId, name: userName, email: userEmail } = req.user;

    if (!movieId || !seats || seats < 1) {
      return res.status(400).json({ error: 'Thiếu thông tin đặt vé' });
    }

    // Kiểm tra phim có tồn tại và đủ ghế
    let movie;
    try {
      const resp = await axios.get(`${MOVIE_SERVICE_URL}/movies/${movieId}`);
      movie = resp.data;
    } catch {
      return res.status(404).json({ error: 'Không tìm thấy phim' });
    }

    if (movie.availableSeats < seats) {
      return res.status(400).json({ error: `Chỉ còn ${movie.availableSeats} ghế trống` });
    }

    // Tạo booking với trạng thái PENDING
    const booking = {
      id: uuidv4(),
      userId,
      userName,
      userEmail,
      movieId,
      movieTitle: movie.title,
      seats: Number(seats),
      totalAmount: movie.price * Number(seats),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    bookings.push(booking);

    // Cập nhật số ghế trên Movie Service
    await axios.put(`${MOVIE_SERVICE_URL}/movies/${movieId}/seats`, { seatsToBook: seats });

    // Publish BOOKING_CREATED event — KHÔNG xử lý payment trực tiếp
    await publishEvent('BOOKING_CREATED', {
      bookingId: booking.id,
      userId,
      userName,
      userEmail,
      movieId,
      movieTitle: movie.title,
      seats: booking.seats,
      totalAmount: booking.totalAmount
    });

    res.status(201).json({ message: 'Đặt vé thành công! Đang xử lý thanh toán...', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /bookings - lấy tất cả bookings
app.get('/bookings', (req, res) => {
  res.json({ bookings, total: bookings.length });
});

// GET /bookings/my - bookings của user hiện tại
app.get('/bookings/my', authMiddleware, (req, res) => {
  const myBookings = bookings.filter(b => b.userId === req.user.userId);
  res.json({ bookings: myBookings, total: myBookings.length });
});

// GET /bookings/:id - chi tiết booking
app.get('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Không tìm thấy booking' });
  res.json(booking);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'booking-service', port: PORT }));

// ─── START ────────────────────────────────────────────────
connectRabbitMQ();
app.listen(PORT, () => {
  console.log(`🚀 Booking Service chạy tại http://localhost:${PORT}`);
});
