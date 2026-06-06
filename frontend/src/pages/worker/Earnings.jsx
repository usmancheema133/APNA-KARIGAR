import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Earnings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/workers/my/profile'),
      api.get('/bookings/my')
    ]).then(([p, b]) => {
      setProfile(p.data);
      setBookings(b.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const completed = bookings.filter(b => b.status === 'Completed');
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;

  const monthlyData = {};
  completed.forEach(b => {
    const key = new Date(b.scheduledDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long' });
    monthlyData[key] = (monthlyData[key] || 0) + 1;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Earnings Summary</h1>
        <p className="page-desc">Your performance and job completion overview</p>
      </div>

      {/* Summary Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {[
          { icon: '✅', label: 'Jobs Completed', value: profile?.totalJobs || completed.length, bg: '#d4f5e2', color: '#1a6b3a' },
          { icon: '⭐', label: 'Avg Rating', value: profile?.averageRating > 0 ? profile.averageRating.toFixed(1) : 'N/A', bg: '#fff3cd', color: '#856404' },
          { icon: '⏳', label: 'Pending Jobs', value: pending, bg: '#fde8e8', color: '#c0392b' },
          { icon: '🔧', label: 'Active Jobs', value: confirmed, bg: '#dbeafe', color: '#1e40af' }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color, fontSize: '20px' }}>{s.icon}</div>
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h2 style={{ fontWeight: 700, fontSize: '16px' }}>Profile Performance</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#6c757d', fontSize: '14px', fontWeight: 500 }}>Service Category</span>
                <span className="badge badge-primary">{profile.serviceCategory}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#6c757d', fontSize: '14px', fontWeight: 500 }}>Overall Rating</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarRating value={Math.round(profile.averageRating)} readonly size={16} />
                  <span style={{ fontWeight: 600 }}>{profile.averageRating > 0 ? profile.averageRating.toFixed(1) : 'No reviews yet'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#6c757d', fontSize: '14px', fontWeight: 500 }}>Experience</span>
                <span style={{ fontWeight: 600 }}>{profile.experience} years</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <span style={{ color: '#6c757d', fontSize: '14px', fontWeight: 500 }}>Verification Status</span>
                {profile.isVerified
                  ? <span className="badge badge-success">🪪 Verified</span>
                  : <span className="badge badge-warning">⏳ Pending Verification</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      {Object.keys(monthlyData).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontWeight: 700, fontSize: '16px' }}>Monthly Job Breakdown</h2>
          </div>
          <div className="card-body">
            {Object.entries(monthlyData).reverse().map(([month, count]) => (
              <div key={month} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: '1px solid #f0f0f0'
              }}>
                <span style={{ fontWeight: 500 }}>{month}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    height: '8px', borderRadius: '4px',
                    background: 'linear-gradient(90deg, #1a6b3a, #27ae60)',
                    width: `${Math.min(count * 30, 150)}px`
                  }} />
                  <span style={{ fontWeight: 700, color: '#1a6b3a', minWidth: '60px', textAlign: 'right' }}>
                    {count} job{count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No completed jobs yet</h3>
          <p>Accept and complete bookings to see your performance here</p>
        </div>
      )}
    </div>
  );
}
