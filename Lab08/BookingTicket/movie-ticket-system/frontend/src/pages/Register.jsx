import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const s = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  box: { background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420 },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#fff' },
  sub: { color: '#888', fontSize: 14, marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6, fontWeight: 500 },
  btn: { width: '100%', padding: '12px', background: '#e63946', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 700, marginTop: 8 },
  err: { background: '#33000f', border: '1px solid #e63946', color: '#ff8fa3', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 },
  success: { background: '#003322', border: '1px solid #06d6a0', color: '#06d6a0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' },
  link: { color: '#e63946', fontWeight: 600 },
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await authService.register(form);
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <h1 style={s.title}>Đăng ký tài khoản</h1>
        <p style={s.sub}>Tạo tài khoản để bắt đầu đặt vé xem phim.</p>
        {error && <div style={s.err}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Họ tên</label>
            <input placeholder="Nguyễn Văn A" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Mật khẩu</label>
            <input type="password" placeholder="Tối thiểu 6 ký tự" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} required />
          </div>
          <button style={s.btn} disabled={loading}>{loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}</button>
        </form>
        <div style={s.footer}>
          Đã có tài khoản? <Link to="/login" style={s.link}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
