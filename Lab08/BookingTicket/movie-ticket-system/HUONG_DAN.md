# 📋 Hướng dẫn chi tiết từng thành viên

---

## 👤 NGƯỜI 1 — Frontend (ReactJS)
**Thư mục:** `frontend/`  
**Port:** 5173 (dev), 80 (Docker)

### Cài đặt & Chạy
```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

### File cần làm việc
| File | Mô tả |
|------|-------|
| `src/pages/Login.jsx` | Trang đăng nhập |
| `src/pages/Register.jsx` | Trang đăng ký |
| `src/pages/MovieList.jsx` | Danh sách phim |
| `src/pages/BookingPage.jsx` | Trang đặt vé |
| `src/pages/MyBookings.jsx` | Vé của tôi |
| `src/services/api.js` | Gọi API |
| `src/components/Navbar.jsx` | Thanh điều hướng |

### Lưu ý quan trọng
- **Chỉ gọi API vào Booking Service (8083), User Service (8081), Movie Service (8082)**
- Không gọi trực tiếp Payment Service
- Token JWT lưu ở `localStorage` sau khi đăng nhập
- MyBookings tự refresh mỗi 5 giây để cập nhật trạng thái

---

## 👤 NGƯỜI 2 — User Service (Node.js)
**Thư mục:** `user-service/`  
**Port:** 8081

### Cài đặt & Chạy
```bash
cd user-service
npm install
npm run dev    # nodemon (auto-restart)
# hoặc
npm start
```

### API Endpoints
| Method | URL | Mô tả |
|--------|-----|-------|
| POST | `/register` | Đăng ký người dùng |
| POST | `/login` | Đăng nhập, trả về JWT token |
| GET | `/users` | Danh sách user (debug) |
| GET | `/health` | Kiểm tra service |

### Request/Response mẫu
```json
// POST /register
{ "name": "Nguyen Van A", "email": "a@gmail.com", "password": "123456" }

// POST /login  
{ "email": "a@gmail.com", "password": "123456" }
// → Response: { token: "eyJ...", user: { id, name, email } }
```

### Event Publish
- `USER_REGISTERED` → khi đăng ký thành công

### Mở rộng (nếu có thời gian)
- Thay in-memory bằng MongoDB/PostgreSQL
- Thêm validation email format
- Thêm endpoint GET `/profile`

---

## 👤 NGƯỜI 3 — Movie Service (Node.js)
**Thư mục:** `movie-service/`  
**Port:** 8082

### Cài đặt & Chạy
```bash
cd movie-service
npm install
npm run dev
```

### API Endpoints
| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/movies` | Danh sách phim (query: ?genre=Action&search=...) |
| GET | `/movies/:id` | Chi tiết phim |
| POST | `/movies` | Thêm phim mới |
| PUT | `/movies/:id/seats` | Cập nhật số ghế (gọi từ Booking Service) |
| GET | `/health` | Kiểm tra service |

### Request mẫu thêm phim
```json
// POST /movies
{
  "title": "Oppenheimer",
  "genre": "Drama",
  "duration": 180,
  "description": "Câu chuyện về J. Robert Oppenheimer",
  "price": 100000,
  "totalSeats": 100,
  "showTime": "2024-12-30 19:00"
}
```

### Lưu ý
- Service này KHÔNG cần kết nối RabbitMQ
- Data mẫu đã có sẵn trong code (4 phim)
- Mở rộng: thêm MongoDB để lưu dữ liệu lâu dài

---

## 👤 NGƯỜI 4 — Booking Service (Node.js) — CORE
**Thư mục:** `booking-service/`  
**Port:** 8083

### Cài đặt & Chạy
```bash
cd booking-service
npm install
npm run dev
```

### API Endpoints
| Method | URL | Header | Mô tả |
|--------|-----|--------|-------|
| POST | `/bookings` | Authorization: Bearer {token} | Tạo booking |
| GET | `/bookings` | — | Tất cả bookings (admin) |
| GET | `/bookings/my` | Authorization: Bearer {token} | Bookings của user |
| GET | `/bookings/:id` | — | Chi tiết booking |
| GET | `/health` | — | Kiểm tra service |

### Trạng thái Booking
```
PENDING → CONFIRMED (khi PAYMENT_COMPLETED)
PENDING → FAILED    (khi BOOKING_FAILED)
```

### Event Flow
```
POST /bookings → [validate] → save PENDING → Publish BOOKING_CREATED
                                           ↓
                          Listen PAYMENT_COMPLETED → update CONFIRMED
                          Listen BOOKING_FAILED    → update FAILED
```

### ⚠️ Nguyên tắc quan trọng
- **KHÔNG gọi Payment Service trực tiếp**
- Chỉ giao tiếp qua RabbitMQ events
- Kết nối Movie Service để kiểm tra ghế trống

---

## 👤 NGƯỜI 5 — Payment + Notification Service (Node.js)
**Thư mục:** `payment-notification-service/`  
**Port:** 8084 (payment), 8085 (notification)

### Cài đặt & Chạy
```bash
cd payment-notification-service
npm install
npm run dev
```

### Cơ chế hoạt động (Event-Driven hoàn toàn)

**Payment:**
1. Lắng nghe `BOOKING_CREATED` từ RabbitMQ
2. Giả lập xử lý thanh toán (delay 1-2 giây)
3. Random: 80% thành công, 20% thất bại
4. Publish `PAYMENT_COMPLETED` hoặc `BOOKING_FAILED`

**Notification:**
1. Lắng nghe `PAYMENT_COMPLETED` và `BOOKING_FAILED`
2. Log thông báo ra console
3. Lưu vào mảng notifications

### API Endpoints (chủ yếu để debug)
| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/payments` | Lịch sử thanh toán |
| GET | `/notifications` | Tất cả notifications |
| GET | `/notifications/:userId` | Notifications của user |
| GET | `/health` | Kiểm tra service |

### Mở rộng (nếu có thời gian)
- Tích hợp email thật (Nodemailer/SendGrid)
- Tích hợp WebSocket để push notification real-time
- Lưu notifications vào database

---

## 🚀 Chạy toàn bộ bằng Docker Compose (cả nhóm)

```bash
# Ở thư mục gốc movie-ticket-system/
docker-compose up --build

# Kiểm tra services
curl http://localhost:8081/health
curl http://localhost:8082/health
curl http://localhost:8083/health
curl http://localhost:8084/health
```

## 🧪 Test luồng hoàn chỉnh

```bash
# 1. Đăng ký
curl -X POST http://localhost:8081/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@gmail.com","password":"123456"}'

# 2. Đăng nhập → lấy token
TOKEN=$(curl -s -X POST http://localhost:8081/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123456"}' | jq -r '.token')

# 3. Lấy danh sách phim → lấy movieId
MOVIE_ID=$(curl -s http://localhost:8082/movies | jq -r '.movies[0].id')

# 4. Đặt vé
curl -X POST http://localhost:8083/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"movieId\":\"$MOVIE_ID\",\"seats\":2}"

# 5. Xem log Payment + Notification Service (terminal riêng)
# Sẽ thấy: BOOKING_CREATED → PAYMENT_COMPLETED → Notification log
```
