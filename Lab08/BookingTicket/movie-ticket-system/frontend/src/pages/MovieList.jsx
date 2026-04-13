import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';

const s = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 28, fontWeight: 700, color: '#fff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 },
  card: { background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 14, overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' },
  poster: { width: '100%', height: 280, objectFit: 'cover', background: '#0f0f1a' },
  cardBody: { padding: 16 },
  movieTitle: { fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 },
  genre: { display: 'inline-block', background: '#2a1a2e', color: '#c77dff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 8 },
  info: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { color: '#e63946', fontSize: 16, fontWeight: 700 },
  seats: { color: '#888', fontSize: 12 },
  bookBtn: { width: '100%', marginTop: 12, padding: '10px', background: '#e63946', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700 },
  searchBar: { display: 'flex', gap: 12, marginBottom: 24 },
  searchInput: { flex: 1, maxWidth: 320 },
  loading: { textAlign: 'center', padding: 60, color: '#888', fontSize: 16 },
  empty: { textAlign: 'center', padding: 60, color: '#888' },
  posterPlaceholder: {
    width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e1e3f, #0f0f1a)', fontSize: 48,
  },
};

export default function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await movieService.getMovies();
      setMovies(res.data.movies || []);
    } catch {
      // fallback data nếu service chưa chạy
      setMovies([
        { id: '1', title: 'Avengers: Endgame', genre: 'Action', duration: 181, price: 90000, availableSeats: 85, showTime: '2024-12-25 19:00', description: 'Siêu anh hùng hội tụ.' },
        { id: '2', title: 'Inception', genre: 'Sci-Fi', duration: 148, price: 85000, availableSeats: 60, showTime: '2024-12-26 20:00', description: 'Thế giới trong giấc mơ.' },
        { id: '3', title: 'Interstellar', genre: 'Sci-Fi', duration: 169, price: 95000, availableSeats: 100, showTime: '2024-12-27 18:30', description: 'Hành trình vũ trụ.' },
        { id: '4', title: 'The Dark Knight', genre: 'Action', duration: 152, price: 80000, availableSeats: 40, showTime: '2024-12-28 21:00', description: 'Batman vs Joker.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (movieId) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      navigate(`/book/${movieId}`);
    }
  };

  if (loading) return <div style={s.loading}>⏳ Đang tải danh sách phim...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>🎬 Phim đang chiếu</h1>
        <span style={{ color: '#888', fontSize: 14 }}>{filtered.length} phim</span>
      </div>

      <div style={s.searchBar}>
        <div style={s.searchInput}>
          <input
            placeholder="🔍 Tìm kiếm phim..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={s.empty}>Không tìm thấy phim nào.</div>
      ) : (
        <div style={s.grid}>
          {filtered.map(movie => (
            <div key={movie.id} style={s.card}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#e63946'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#2a2a3e'; }}>
              <div style={s.posterPlaceholder}>🎥</div>
              <div style={s.cardBody}>
                <div style={s.genre}>{movie.genre}</div>
                <div style={s.movieTitle}>{movie.title}</div>
                <div style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>
                  ⏱ {movie.duration} phút &nbsp;|&nbsp; 🕐 {movie.showTime}
                </div>
                <div style={{ color: '#aaa', fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>
                  {movie.description?.slice(0, 70)}...
                </div>
                <div style={s.info}>
                  <span style={s.price}>{movie.price?.toLocaleString()}đ</span>
                  <span style={s.seats}>🪑 {movie.availableSeats} ghế trống</span>
                </div>
                <button style={s.bookBtn} onClick={() => handleBook(movie.id)}>
                  Đặt vé ngay →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
