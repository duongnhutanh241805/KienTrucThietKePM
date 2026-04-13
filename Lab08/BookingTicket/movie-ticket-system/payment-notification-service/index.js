const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
app.use(express.json());
app.use(cors());

const PAYMENT_PORT = process.env.PAYMENT_PORT || 8084;
const NOTIFICATION_PORT = process.env.NOTIFICATION_PORT || 8085;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

// Lịch sử payments và notifications
const payments = [];
const notifications = [];

let channel;

async function connectRabbitMQ() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange('movie_events', 'topic', { durable: true });

    // ─── Payment Service: lắng nghe BOOKING_CREATED ───────
    const paymentQueue = await channel.assertQueue('payment_queue', { durable: true });
    await channel.bindQueue(paymentQueue.queue, 'movie_events', 'BOOKING_CREATED');

    channel.consume(paymentQueue.queue, async (msg) => {
      if (!msg) return;
      const event = JSON.parse(msg.content.toString());
      await processPayment(event.data);
      channel.ack(msg);
    });

    // ─── Notification Service: lắng nghe kết quả payment ──
    const notifQueue = await channel.assertQueue('notification_queue', { durable: true });
    await channel.bindQueue(notifQueue.queue, 'movie_events', 'PAYMENT_COMPLETED');
    await channel.bindQueue(notifQueue.queue, 'movie_events', 'BOOKING_FAILED');

    channel.consume(notifQueue.queue, (msg) => {
      if (!msg) return;
      const event = JSON.parse(msg.content.toString());
      sendNotification(event);
      channel.ack(msg);
    });

    console.log('✅ [Payment+Notification Service] Connected to RabbitMQ');
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

// ─── PAYMENT LOGIC ─────────────────────────────────────────
async function processPayment(bookingData) {
  console.log(`\n💳 [Payment] Nhận BOOKING_CREATED cho booking #${bookingData.bookingId}`);
  console.log(`   Phim: ${bookingData.movieTitle} | ${bookingData.seats} ghế | ${bookingData.totalAmount.toLocaleString()}đ`);

  // Giả lập xử lý (delay 1-2 giây)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Random success/fail (80% thành công, 20% thất bại)
  const isSuccess = Math.random() < 0.8;

  const payment = {
    id: `PAY_${Date.now()}`,
    bookingId: bookingData.bookingId,
    amount: bookingData.totalAmount,
    status: isSuccess ? 'SUCCESS' : 'FAILED',
    processedAt: new Date().toISOString()
  };
  payments.push(payment);

  if (isSuccess) {
    console.log(`✅ [Payment] Thanh toán thành công: ${payment.id}`);
    await publishEvent('PAYMENT_COMPLETED', {
      paymentId: payment.id,
      bookingId: bookingData.bookingId,
      userId: bookingData.userId,
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      movieTitle: bookingData.movieTitle,
      seats: bookingData.seats,
      amount: bookingData.totalAmount
    });
  } else {
    console.log(`❌ [Payment] Thanh toán thất bại: ${payment.id}`);
    await publishEvent('BOOKING_FAILED', {
      paymentId: payment.id,
      bookingId: bookingData.bookingId,
      userId: bookingData.userId,
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      movieTitle: bookingData.movieTitle,
      reason: 'Thanh toán bị từ chối'
    });
  }
}

// ─── NOTIFICATION LOGIC ────────────────────────────────────
function sendNotification(event) {
  const { eventType, data } = event;
  let message;

  if (eventType === 'PAYMENT_COMPLETED') {
    message = `🎉 Booking #${data.bookingId} thành công! Chúc ${data.userName} xem phim "${data.movieTitle}" vui vẻ! (${data.seats} ghế - ${data.amount?.toLocaleString()}đ)`;
    console.log(`\n🔔 [Notification] ${message}`);
  } else if (eventType === 'BOOKING_FAILED') {
    message = `😔 Booking #${data.bookingId} thất bại! Kính gửi ${data.userName}, vé phim "${data.movieTitle}" chưa được đặt. Lý do: ${data.reason}`;
    console.log(`\n🔔 [Notification] ${message}`);
  }

  const notification = {
    id: `NOTIF_${Date.now()}`,
    eventType,
    bookingId: data.bookingId,
    userId: data.userId,
    userName: data.userName,
    message,
    sentAt: new Date().toISOString()
  };
  notifications.push(notification);
}

// ─── HTTP ENDPOINTS (debug / admin) ───────────────────────

// Payment API
app.get('/payments', (req, res) => res.json({ payments, total: payments.length }));

// Notification API
app.get('/notifications', (req, res) => res.json({ notifications, total: notifications.length }));

app.get('/notifications/:userId', (req, res) => {
  const userNotifs = notifications.filter(n => n.userId === req.params.userId);
  res.json({ notifications: userNotifs, total: userNotifs.length });
});

app.get('/health', (req, res) => res.json({
  status: 'ok',
  service: 'payment-notification-service',
  ports: { payment: PAYMENT_PORT, notification: NOTIFICATION_PORT },
  stats: { payments: payments.length, notifications: notifications.length }
}));

// ─── START ────────────────────────────────────────────────
connectRabbitMQ();

app.listen(PAYMENT_PORT, () => {
  console.log(`🚀 Payment Service lắng nghe tại http://localhost:${PAYMENT_PORT}`);
  console.log(`🚀 Notification Service lắng nghe tại http://localhost:${NOTIFICATION_PORT}`);
});

// Chạy notification trên port riêng
const notifApp = express();
notifApp.use(cors());
notifApp.get('/notifications', (req, res) => res.json({ notifications, total: notifications.length }));
notifApp.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));
notifApp.listen(NOTIFICATION_PORT, () => {});
