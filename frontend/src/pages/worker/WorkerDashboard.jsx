import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/workers/my/profile'),
      api.get('/bookings/my')
    ]).then(([pRes, bRes]) => {
      setProfile(pRes.data);
      setBookings(bRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const pending = bookings.filter(b => b.status === 'Pending').length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;
  const recent = bookings.slice(0, 5);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Worker Dashboard</h1>
          <p className="page-desc">Welcome back, {user?.name}!</p>
        </div>
        {profile && !profile.isVerified && (
          <div className="alert alert-warning" style={{ margin: 0, fontSize: '13px' }}>
            ⏳ Your account is pending admin verification
          </div>
        )}
        {profile?.isVerified && (
          <div style={{ background: '#d4f5e2', color: '#1a6b3a', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
            🪪 Verified Karigar
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {[
          { icon: '⭐', label: 'Rating', value: profile?.averageRating > 0 ? profile.averageRating.toFixed(1) : 'N/A', bg: '#fff3cd', color: '#856404' },
          { icon: '✅', label: 'Completed Jobs', value: profile?.totalJobs || 0, bg: '#d4f5e2', color: '#1a6b3a' },
          { icon: '⏳', label: 'Pending', value: pending, bg: '#fde8e8', color: '#c0392b' },
          { icon: '📋', label: 'Confirmed', value: confirmed, bg: '#dbeafe', color: '#1e40af' }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile summary */}
      {profile && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h2 style={{ fontWeight: 700, fontSize: '16px' }}>My Profile</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '24px', fontWeight: 800, flexShrink: 0
            }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{user?.name}</div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                {profile.serviceCategory} · {user?.city} · {profile.experience} years experience
              </div>
              <StarRating value={Math.round(profile.averageRating)} readonly size={16} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/worker/job-requests" className="btn btn-primary btn-sm">View Job Requests ({pending})</Link>
              <Link to="/worker/earnings" className="btn btn-ghost btn-sm">Earnings Summary</Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div>
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Bookings</h2>
            <p className="section-subtitle">Your latest job requests</p>
          </div>
          <Link to="/worker/job-requests" className="btn btn-outline btn-sm">View All</Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No bookings yet</h3>
            <p>Once customers book you, they'll appear here</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600 }}>{b.customerId?.name}</td>
                    <td>{b.serviceType}</td>
                    <td style={{ fontSize: '13px', color: '#6c757d' }}>
                      {new Date(b.scheduledDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ fontSize: '13px', color: '#6c757d', maxWidth: '200px' }}>{b.address}</td>
                    <td><span className={`badge status-${b.status}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
