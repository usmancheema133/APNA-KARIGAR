import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: isActive(path) ? '#1a6b3a' : '#495057',
    background: isActive(path) ? '#d4f5e2' : 'transparent',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap'
  });

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #dee2e6',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 20px',
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '16px', fontFamily: 'Poppins, sans-serif'
          }}>AK</div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '20px', color: '#1a6b3a' }}>
            Apna Karigar
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link to="/workers" style={navLinkStyle('/workers')}>Find Workers</Link>

          {!user && (
            <>
              <Link to="/login" style={navLinkStyle('/login')}>Login</Link>
              <Link to="/register" style={{
                padding: '8px 18px', background: '#1a6b3a', color: 'white',
                borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}>Register</Link>
            </>
          )}

          {user?.role === 'customer' && (
            <>
              <Link to="/my-bookings"  style={navLinkStyle('/my-bookings')}>My Bookings</Link>
              <Link to="/edit-profile" style={navLinkStyle('/edit-profile')}>Edit Profile</Link>
            </>
          )}

          {user?.role === 'worker' && (
            <>
              <Link to="/worker/dashboard"    style={navLinkStyle('/worker/dashboard')}>Dashboard</Link>
              <Link to="/worker/job-requests" style={navLinkStyle('/worker/job-requests')}>Jobs</Link>
              <Link to="/worker/earnings"     style={navLinkStyle('/worker/earnings')}>Earnings</Link>
              <Link to="/edit-profile"        style={navLinkStyle('/edit-profile')}>Edit Profile</Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin"         style={navLinkStyle('/admin')}>Dashboard</Link>
              <Link to="/admin/pending" style={navLinkStyle('/admin/pending')}>Pending</Link>
              <Link to="/admin/workers" style={navLinkStyle('/admin/workers')}>Workers</Link>
              <Link to="/admin/users"   style={navLinkStyle('/admin/users')}>Users</Link>
            </>
          )}

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '8px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '13px'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} style={{
                background: '#fde8e8', color: '#c0392b', border: 'none',
                padding: '7px 14px', borderRadius: '6px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease'
              }}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
