import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CITIES = ['Faisalabad', 'Lahore','Islamabad','Rawalpindi'];
const CATEGORIES = ['Electrician', 'Plumber', 'Welder', 'Carpenter'];

export default function Register() {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', city: '',
    cnic: '', serviceCategory: '', experience: '', description: ''
  });
  const [cnicFrontPhoto, setCnicFrontPhoto] = useState(null);
  const [cnicBackPhoto,  setCnicBackPhoto]  = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // ── Auto-format phone: only digits, max 11 ──
  const handlePhone = (val) => {
    const digits = val.replace(/[^0-9]/g, '').slice(0, 11);
    setForm(f => ({ ...f, phone: digits }));
  };

  // ── Auto-format CNIC: XXXXX-XXXXXXX-X ──
  const handleCnic = (val) => {
    let digits = val.replace(/[^0-9]/g, '').slice(0, 13);
    if (digits.length > 12) digits = digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);
    else if (digits.length > 5) digits = digits.slice(0, 5) + '-' + digits.slice(5);
    setForm(f => ({ ...f, cnic: digits }));
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ── Password ──
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // ── Phone: must be 11 digits starting with 03 ──
    const phoneRegex = /^03[0-9]{9}$/;
    if (!phoneRegex.test(form.phone)) {
      setError('Phone must be a valid Pakistani number e.g. 03001234567 (11 digits).');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // ── Worker validations ──
    if (role === 'worker') {
      const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
      if (!cnicRegex.test(form.cnic)) {
        setError('CNIC must be in format: XXXXX-XXXXXXX-X (13 digits total).');
        setTimeout(() => setError(''), 10000);
        return;
      }
      if (!cnicFrontPhoto) {
        setError('CNIC front photo is required.');
        setTimeout(() => setError(''), 10000);
        return;
      }
      if (!cnicBackPhoto) {
        setError('CNIC back photo is required.');
        setTimeout(() => setError(''), 10000);
        return;
      }
    }

    setLoading(true);
    try {
      await register({ ...form, role, cnicFrontPhoto, cnicBackPhoto });
      if (role === 'worker') navigate('/worker/dashboard');
      else navigate('/workers');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setTimeout(() => setError(''), 10000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-logo">
          <h1>اپنا کاریگر</h1>
          <p>Apna Karigar — Pakistan's Trust-First Platform</p>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join thousands of customers and professionals</p>

        <div className="tabs">
          <button className={`tab-btn ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')} type="button">Customer</button>
          <button className={`tab-btn ${role === 'worker'   ? 'active' : ''}`} onClick={() => setRole('worker')}   type="button">Karigar (Worker)</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* ── Name & Phone ── */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="Muhammad Ali"
                value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number <span style={{ color: 'red' }}>*</span></label>
              <input className="form-control" placeholder="03001234567"
                value={form.phone} maxLength={11}
                onChange={e => handlePhone(e.target.value)} required />
              <small style={{ color: '#888', fontSize: '11px' }}>11 digits, starts with 03</small>
            </div>
          </div>

          {/* ── Email (optional) ── */}
          <div className="form-group">
            <label className="form-label">
              Email Address <span style={{ color: '#888', fontSize: '12px', fontWeight: 400 }}>(optional)</span>
            </label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>

          {/* ── Password & City ── */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <select className="form-control" value={form.city}
                onChange={e => set('city', e.target.value)} required>
                <option value="">Select City</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* ── Worker fields ── */}
          {role === 'worker' && (
            <>
              <div className="divider" />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a6b3a', marginBottom: '14px' }}>
                Worker Information (for verification)
              </p>

              {/* CNIC */}
              <div className="form-group">
                <label className="form-label">CNIC Number <span style={{ color: 'red' }}>*</span></label>
                <input className="form-control" placeholder="XXXXX-XXXXXXX-X"
                  value={form.cnic} maxLength={15}
                  onChange={e => handleCnic(e.target.value)} required />
                <small style={{ color: '#888', fontSize: '11px' }}>Format: XXXXX-XXXXXXX-X (13 digits)</small>
              </div>

              {/* Category & Experience */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Service Category</label>
                  <select className="form-control" value={form.serviceCategory}
                    onChange={e => set('serviceCategory', e.target.value)} required>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input className="form-control" type="number" min="0" max="50" placeholder="e.g. 5"
                    value={form.experience} onChange={e => set('experience', e.target.value)} required />
                </div>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Bio / Description</label>
                <textarea className="form-control" rows={3}
                  placeholder="Tell customers about your skills and experience..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>

              {/* CNIC Front Photo */}
              <div className="form-group">
                <label className="form-label">
                  CNIC Front Photo <span style={{ color: 'red' }}>*</span>
                </label>
                <input className="form-control" type="file" accept="image/*"
                  onChange={e => setCnicFrontPhoto(e.target.files[0])} required />
                <small style={{ color: '#888', fontSize: '11px' }}>JPG/PNG, max 5MB</small>
              </div>

              {/* CNIC Back Photo */}
              <div className="form-group">
                <label className="form-label">
                  CNIC Back Photo <span style={{ color: 'red' }}>*</span>
                </label>
                <input className="form-control" type="file" accept="image/*"
                  onChange={e => setCnicBackPhoto(e.target.files[0])} required />
                <small style={{ color: '#888', fontSize: '11px' }}>JPG/PNG, max 5MB</small>
              </div>

              <div className="alert alert-info" style={{ fontSize: '13px' }}>
                Your account will be reviewed by our admin team before you appear in search results.
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account...' : `Register as ${role === 'worker' ? 'Karigar' : 'Customer'}`}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
