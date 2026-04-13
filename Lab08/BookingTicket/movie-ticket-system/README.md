# 🎬 Movie Ticket System — Event-Driven Architecture

## Phân công nhóm

| Thành viên | Vai trò | Thư mục | Port |
|---|---|---|---|
| Người 1 | Frontend (ReactJS) | `frontend/` | 5173 |
| Người 2 | User Service (Node.js) | `user-service/` | 8081 |
| Người 3 | Movie Service (Node.js) | `movie-service/` | 8082 |
| Người 4 | Booking Service (Node.js) | `booking-service/` | 8083 |
| Người 5 | Payment + Notification Service (Node.js) | `payment-notification-service/` | 8084/8085 |

## Luồng Event

```
User → Booking Service → [BOOKING_CREATED] → Payment Service
                                              → [PAYMENT_COMPLETED / BOOKING_FAILED]
                                                → Notification Service
```

## Khởi động nhanh

### 1. Chạy RabbitMQ (Message Broker)
```bash
docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```
> Truy cập RabbitMQ UI: http://localhost:15672 (guest/guest)

### 2. Cài dependencies từng service
```bash
cd user-service && npm install
cd ../movie-service && npm install
cd ../booking-service && npm install
cd ../payment-notification-service && npm install
cd ../frontend && npm install
```

### 3. Chạy từng service (mỗi terminal riêng)
```bash
cd user-service && npm start          # Port 8081
cd movie-service && npm start         # Port 8082
cd booking-service && npm start       # Port 8083
cd payment-notification-service && npm start  # Port 8084/8085
cd frontend && npm run dev            # Port 5173
```

## Sơ đồ Events

| Event | Publisher | Consumer |
|---|---|---|
| USER_REGISTERED | User Service | (log) |
| BOOKING_CREATED | Booking Service | Payment Service |
| PAYMENT_COMPLETED | Payment Service | Notification Service |
| BOOKING_FAILED | Payment Service | Notification Service |
