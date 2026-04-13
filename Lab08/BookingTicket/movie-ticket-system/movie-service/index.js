const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8082;

// In-memory DB (thay bằng MongoDB/PostgreSQL thực tế)
const movies = [
  {
    id: uuidv4(),
    title: 'Avengers: Endgame',
    genre: 'Action',
    duration: 181,
    description: 'Sau sự kiện Infinity War, các Avengers tập hợp lại để đảo ngược hành động của Thanos.',
    poster: 'https://via.placeholder.com/300x450?text=Avengers',
    price: 90000,
    totalSeats: 100,
    availableSeats: 100,
    showTime: '2024-12-25 19:00',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    description: 'Một tên trộm xâm nhập vào tiềm thức của người khác để lấy cắp thông tin bí mật.',
    poster: 'https://via.placeholder.com/300x450?text=Inception',
    price: 85000,
    totalSeats: 80,
    availableSeats: 80,
    showTime: '2024-12-26 20:00',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Interstellar',
    genre: 'Sci-Fi',
    duration: 169,
    description: 'Một nhóm các nhà du hành vũ trụ di chuyển qua một lỗ sâu trong không gian.',
    poster: 'https://via.placeholder.com/300x450?text=Interstellar',
    price: 95000,
    totalSeats: 120,
    availableSeats: 120,
    showTime: '2024-12-27 18:30',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'The Dark Knight',
    genre: 'Action',
    duration: 152,
    description: 'Batman đối đầu với Joker - kẻ phản diện hỗn loạn muốn đảo lộn Gotham City.',
    poster: 'https://via.placeholder.com/300x450?text=Dark+Knight',
    price: 80000,
    totalSeats: 90,
    availableSeats: 90,
    showTime: '2024-12-28 21:00',
    createdAt: new Date().toISOString()
  }
];

// ─── ROUTES ───────────────────────────────────────────────

// GET /movies - lấy danh sách phim
app.get('/movies', (req, res) => {
  const { genre, search } = req.query;
  let result = [...movies];

  if (genre) {
    result = result.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
  }
  if (search) {
    result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
  }

  res.json({ movies: result, total: result.length });
});

// GET /movies/:id - lấy chi tiết phim
app.get('/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) return res.status(404).json({ error: 'Không tìm thấy phim' });
  res.json(movie);
});

// POST /movies - thêm phim mới
app.post('/movies', (req, res) => {
  const { title, genre, duration, description, poster, price, totalSeats, showTime } = req.body;

  if (!title || !genre || !duration || !price || !totalSeats) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  const movie = {
    id: uuidv4(),
    title,
    genre,
    duration: Number(duration),
    description: description || '',
    poster: poster || `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`,
    price: Number(price),
    totalSeats: Number(totalSeats),
    availableSeats: Number(totalSeats),
    showTime: showTime || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  movies.push(movie);
  res.status(201).json({ message: 'Thêm phim thành công!', movie });
});

// PUT /movies/:id - cập nhật ghế còn lại (gọi từ Booking Service)
app.put('/movies/:id/seats', (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) return res.status(404).json({ error: 'Không tìm thấy phim' });

  const { seatsToBook } = req.body;
  if (movie.availableSeats < seatsToBook) {
    return res.status(400).json({ error: 'Không đủ ghế trống' });
  }
  movie.availableSeats -= seatsToBook;
  res.json({ message: 'Cập nhật ghế thành công', movie });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'movie-service', port: PORT }));

// ─── START ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Movie Service chạy tại http://localhost:${PORT}`);
});
