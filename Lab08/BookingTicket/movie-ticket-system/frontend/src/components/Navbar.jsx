import { Link, useNavigate } from 'react-router-dom';

const styles = {
  nav: {
    background: '#12121a',
    borderBottom: '1px solid #2a2a3e',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { fontSize: 20, fontWeight: 700, color: '#e63946' },
  links: { display: 'flex', gap: 24, alignItems: 'center' },
  link: { color: '#aaa', fontSize: 14, fontWeight: 500 },
  btn: {
    background: '#e63946',
    color: 'white',
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
  },
  user: { color: '#06d6a0', fontSize: 13, fontWeight: 500 },
};

export default function Navbar() {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/movies" style={styles.logo}>🎬 MovieTicket</Link>
      <div style={styles.links}>
        <Link to="/movies" style={styles.link}>Phim</Link>
        {user ? (
          <>
            <Link to="/my-bookings" style={styles.link}>Vé của tôi</Link>
            <span style={styles.user}>👤 {user.name}</span>
            <button style={styles.btn} onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Đăng nhập</Link>
            <button style={styles.btn} onClick={() => navigate('/register')}>Đăng ký</button>
          </>
        )}
      </div>
    </nav>
  );
}
