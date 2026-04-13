import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';

const statusLabel = { PENDING: 'Đang xử lý', CONFIRMED: 'Đã xác nhận', FAILED: 'Thất bại' };
const statusEmoji = { PENDING: '⏳', CONFIRMED: '✅', FAILED: '❌' };

const s = {
  page: { maxWidth: 800, margin: '0 auto', padding: '36px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 26, fontWeight: 700, color: '#fff' },
  hint: { color: '#888', fontSize: 13, marginBottom: 20 },
  card: { background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 14, padding: 20, marginBottom: 14 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  movieName: { fontSize: 17, fontWeight: 700, color: '#fff' },
  bookingId: { color: '#555', fontSize: 11, marginTop: 2 },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginTop: 8 },
  infoItem: { background: '#12121a', borderRadius: 8, padding: '8px 12px' },
  infoLabel: { color: '#666', fontSize: 11, marginBottom: 2 },
  infoVal: { color: '#ddd', fontSize: 13, fontWeight: 600 },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#888' },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  refreshBtn: { background: '#2a2a3e', color: '#aaa', padding: '8px 16px', borderRadius: 8, fontSize: 13, border: '1px solid #333' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data.bookings || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  // Auto-refresh mỗi 5 giây để cập nhật trạng thái payment
  useEffect(() => {
    const timer = setInterval(fetch, 5000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Đang tải...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>🎫 Vé của tôi</h1>
        <button style={s.refreshBtn} onClick={fetch}>↻ Làm mới</button>
      </div>
      <div style={s.hint}>Trang tự động cập nhật trạng thái mỗi 5 giây.</div>

      {bookings.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🎟️</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#ccc', marginBottom: 8 }}>Chưa có vé nào</div>
          <div style={{ marginBottom: 20 }}>Hãy đặt vé xem phim đầu tiên của bạn!</div>
          <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={() => navigate('/movies')}>Xem phim ngay</button>
        </div>
      ) : (
        bookings.slice().reverse().map(b => (
          <div key={b.id} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <div style={s.movieName}>{b.movieTitle}</div>
                <div style={s.bookingId}>ID: {b.id?.slice(0, 16)}...</div>
              </div>
              <span
                className={`status-${b.status}`}
                style={s.statusBadge}
              >
                {statusEmoji[b.status]} {statusLabel[b.status] || b.status}
              </span>
            </div>
            <div style={s.infoGrid}>
              <div style={s.infoItem}>
                <div style={s.infoLabel}>Số ghế</div>
                <div style={s.infoVal}>🪑 {b.seats} ghế</div>
              </div>
              <div style={s.infoItem}>
                <div style={s.infoLabel}>Tổng tiền</div>
                <div style={{ ...s.infoVal, color: '#e63946' }}>{b.totalAmount?.toLocaleString()}đ</div>
              </div>
              <div style={s.infoItem}>
                <div style={s.infoLabel}>Ngày đặt</div>
                <div style={s.infoVal}>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
              <div style={s.infoItem}>
                <div style={s.infoLabel}>Cập nhật</div>
                <div style={s.infoVal}>{new Date(b.updatedAt).toLocaleTimeString('vi-VN')}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
