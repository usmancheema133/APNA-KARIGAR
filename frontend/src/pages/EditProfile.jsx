import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const CITIES = ['Faisalabad', 'Lahore', 'Islamabad', 'Sialkot'];

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:        user?.name        || '',
    email:       user?.email       || '',
    city:        user?.city        || '',
    password:    '',   // current password (required)
    newPassword: '',   // optional new password
    experience:  user?.workerProfile?.experience || '',
    description: user?.workerProfile?.description || '',
  });

  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.password) {
      setError('Please enter your current password to save changes.');
      setTimeout(() => setError(''), 10000);
      return;
    }

    if (form.newPassword && form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      setTimeout(() => setError(''), 10000);
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/update', {
        name:        form.name,
        email:       form.email,
        city:        form.city,
        password:    form.password,
        newPassword: form.newPassword || undefined,
        experience:  form.experience,
        description: form.description,
      });

      // Update stored user in context
      updateUser({
        name:  res.data.name,
        email: res.data.email,
        city:  res.data.city,
      });

      setSuccess('Profile updated successfully!');
      setForm(f => ({ ...f, password: '', newPassword: '' }));
      setTimeout(() => setSuccess(''), 5000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      setTimeout(() => setError(''), 10000);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (user?.role === 'worker') navigate('/worker/dashboard');
    else navigate('/my-bookings');
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="auth-card" style={{ maxWidth: '520px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={goBack} className="btn btn-ghost btn-sm">← Back</button>
          <div>
            <h2 className="auth-title" style={{ margin: 0 }}>Edit Profile</h2>
            <p className="auth-subtitle" style={{ margin: 0 }}>Update your account information</p>
          </div>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          {/* ── Basic Info ── */}
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a6b3a', marginBottom: '12px' }}>
            Basic Information
          </p>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" placeholder="Full Name"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email <span style={{ color: '#888', fontSize: '12px', fontWeight: 400 }}>(optional)</span>
            </label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <select className="form-control" value={form.city} onChange={e => set('city', e.target.value)}>
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* ── Phone (read-only — cannot be changed) ── */}
          <div className="form-group">
            <label className="form-label">Phone Number <span style={{ color: '#888', fontSize: '12px', fontWeight: 400 }}>(cannot be changed)</span></label>
            <input className="form-control" value={user?.phone || ''} disabled
              style={{ background: '#f8f9fa', color: '#6c757d', cursor: 'not-allowed' }} />
          </div>

          {/* ── Worker-specific fields ── */}
          {user?.role === 'worker' && (
            <>
              <div className="divider" />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a6b3a', marginBottom: '12px' }}>
                Worker Information
              </p>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input className="form-control" type="number" min="0" max="50"
                  value={form.experience} onChange={e => set('experience', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio / Description</label>
                <textarea className="form-control" rows={3}
                  placeholder="Tell customers about your skills..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
            </>
          )}

          {/* ── Password Section ── */}
          <div className="divider" />
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a6b3a', marginBottom: '12px' }}>
            Password
          </p>

          <div className="form-group">
            <label className="form-label">Current Password <span style={{ color: 'red' }}>*</span></label>
            <input className="form-control" type="password" placeholder="Enter current password to confirm changes"
              value={form.password} onChange={e => set('password', e.target.value)} required />
            <small style={{ color: '#888', fontSize: '11px' }}>Required to save any changes</small>
          </div>

          <div className="form-group">
            <label className="form-label">
              New Password <span style={{ color: '#888', fontSize: '12px', fontWeight: 400 }}>(leave blank to keep current)</span>
            </label>
            <input className="form-control" type="password" placeholder="Min. 6 characters"
              value={form.newPassword} onChange={e => set('newPassword', e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  );
}
