import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService, bookingService } from '../services/api';

const s = {
  page: { maxWidth: 640, margin: '0 auto', padding: '40px 20px' },
  back: { color: '#888', fontSize: 13, cursor: 'pointer', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6 },
  card: { background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 16, padding: 28 },
  movieTitle: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 },
  meta: { color: '#888', fontSize: 13, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' },
  divider: { borderTop: '1px solid #2a2a3e', margin: '20px 0' },
  sectionLabel: { fontSize: 13, color: '#aaa', fontWeight: 500, marginBottom: 10 },
  seatsRow: { display: 'flex', alignItems: 'center', gap: 12 },
  countBtn: { width: 36, height: 36, background: '#2a2a3e', color: '#fff', borderRadius: 8, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontWeight: 700 },
  countVal: { fontSize: 22, fontWeight: 700, color: '#fff', minWidth: 32, textAlign: 'center' },
  summary: { background: '#12121a', borderRadius: 10, padding: 16, marginTop: 20 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#aaa' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid #2a2a3e', fontWeight: 700, color: '#fff', fontSize: 17 },
  bookBtn: { width: '100%', marginTop: 20, padding: '14px', background: '#e63946', color: '#fff', borderRadius: 10, fontSize: 16, fontWeight: 700 },
  successBox: { background: '#003322', border: '1px solid #06d6a0', borderRadius: 12, padding: 24, textAlign: 'center' },
  successIcon: { fontSize: 48, marginBottom: 12 },
  successTitle: { fontSize: 20, fontWeight: 700, color: '#06d6a0', marginBottom: 8 },
  successSub: { color: '#aaa', fontSize: 14, lineHeight: 1.6 },
  errBox: { background: '#33000f', border: '1px solid #e63946', borderRadius: 8, padding: '12px 16px', color: '#ff8fa3', fontSize: 13, marginTop: 14 },
};

export default function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, booking }
  const [error, setError] = useState('');

  useEffect(() => {
    movieService.getMovie(movieId)
      .then(r => setMovie(r.data))
      .catch(() => {
        // fallback
        setMovie({ id: movieId, title: 'Phim đang chọn', genre: 'Action', duration: 120, price: 90000, availableSeats: 50, showTime: '2024-12-25 19:00' });
      });
  }, [movieId]);

  const total = movie ? movie.price * seats : 0;

  const handleBook = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await bookingService.createBooking({ movieId, seats });
      setResult({ success: true, booking: res.data.booking });
    } catch (err) {
      setError(err.response?.data?.error || 'Đặt vé thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Đang tải...</div>;

  if (result?.success) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.successBox}>
            <div style={s.successIcon}>🎉</div>
            <div style={s.successTitle}>Đặt vé thành công!</div>
            <div style={s.successSub}>
              Booking <strong style={{ color: '#fff' }}>#{result.booking.id?.slice(0, 8)}</strong> đã được tạo.<br />
              Hệ thống đang xử lý thanh toán, bạn sẽ nhận thông báo sớm.
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={() => navigate('/my-bookings')}>Vé của tôi</button>
              <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={() => navigate('/movies')}>Xem thêm phim</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <span style={s.back} onClick={() => navigate('/movies')}>← Quay lại danh sách phim</span>
      <div style={s.card}>
        <div style={{ display: 'inline-block', background: '#2a1a2e', color: '#c77dff', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 10 }}>{movie.genre}</div>
        <div style={s.movieTitle}>{movie.title}</div>
        <div style={s.meta}>
          <span>⏱ {movie.duration} phút</span>
          <span>🕐 {movie.showTime}</span>
          <span>🪑 {movie.availableSeats} ghế trống</span>
        </div>

        <div style={s.divider} />

        <div style={s.sectionLabel}>Chọn số ghế</div>
        <div style={s.seatsRow}>
          <button style={s.countBtn} onClick={() => setSeats(Math.max(1, seats - 1))}>−</button>
          <span style={s.countVal}>{seats}</span>
          <button style={s.countBtn} onClick={() => setSeats(Math.min(movie.availableSeats, seats + 1))}>+</button>
          <span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>ghế (tối đa {movie.availableSeats})</span>
        </div>

        <div style={s.summary}>
          <div style={s.summaryRow}><span>Giá vé / ghế</span><span style={{ color: '#fff' }}>{movie.price?.toLocaleString()}đ</span></div>
          <div style={s.summaryRow}><span>Số ghế</span><span style={{ color: '#fff' }}>{seats}</span></div>
          <div style={s.summaryTotal}><span>Tổng cộng</span><span style={{ color: '#e63946' }}>{total.toLocaleString()}đ</span></div>
        </div>

        {error && <div style={s.errBox}>{error}</div>}

        <button style={s.bookBtn} onClick={handleBook} disabled={loading}>
          {loading ? '⏳ Đang xử lý...' : `Thanh toán ${total.toLocaleString()}đ →`}
        </button>
      </div>
    </div>
  );
}
