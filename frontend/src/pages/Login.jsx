import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]       = useState({ identifier: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const timerRef              = useRef(null);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const showError = (msg) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setError(msg);
    timerRef.current = setTimeout(() => setError(''), 15000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.identifier, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'worker') navigate('/worker/dashboard');
      else navigate('/workers');
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Username and Password is Incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>اپنا کاریگر</h1>
          <p>Apna Karigar — Pakistan's Trust-First Platform</p>
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone Number or Email</label>
            <input
              className="form-control"
              type="text"
              placeholder="03001234567 or you@example.com"
              value={form.identifier}
              onChange={e => setForm({ ...form, identifier: e.target.value })}
              required
            />
            <small style={{ color: '#888', fontSize: '11px' }}>
              You can login with your phone number or email
            </small>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '24px' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}