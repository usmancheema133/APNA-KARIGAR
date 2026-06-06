import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-desc">Apna Karigar platform overview and management</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {[
          { icon: '👥', label: 'Total Customers', value: stats?.totalUsers || 0, bg: '#dbeafe', color: '#1e40af' },
          { icon: '🔧', label: 'Total Workers', value: stats?.totalWorkers || 0, bg: '#d4f5e2', color: '#1a6b3a' },
          { icon: '✅', label: 'Verified Workers', value: stats?.verifiedWorkers || 0, bg: '#d4f5e2', color: '#1a6b3a' },
          { icon: '⏳', label: 'Pending Approval', value: stats?.pendingWorkers || 0, bg: '#fef3cd', color: '#856404' }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color, fontSize: '22px' }}>{s.icon}</div>
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-3" style={{ marginBottom: '32px' }}>
        {[
          { icon: '📋', label: 'Total Bookings', value: stats?.totalBookings || 0, bg: '#f8f9fa', color: '#495057' },
          { icon: '✅', label: 'Completed Bookings', value: stats?.completedBookings || 0, bg: '#d4f5e2', color: '#1a6b3a' },
          { icon: '⭐', label: 'Total Reviews', value: stats?.totalReviews || 0, bg: '#fff3cd', color: '#856404' }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color, fontSize: '22px' }}>{s.icon}</div>
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {stats?.pendingWorkers > 0 && (
        <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {stats.pendingWorkers} worker{stats.pendingWorkers !== 1 ? 's' : ''} waiting for ID verification</span>
          <Link to="/admin/pending" className="btn btn-accent btn-sm">Review Now →</Link>
        </div>
      )}

      <div className="grid-2">
        {[
          { title: '⏳ Pending Verifications', desc: 'Review and approve worker registrations', link: '/admin/pending', btnText: 'Review Applications', color: '#f39c12' },
          { title: '🔧 All Workers', desc: 'View and manage all registered karigar', link: '/admin/workers', btnText: 'Manage Workers', color: '#1a6b3a' },
          { title: '👥 All Customers', desc: 'View all registered customer accounts', link: '/admin/users', btnText: 'View Customers', color: '#3498db' },
          { title: '📊 Platform Stats', desc: 'Real-time statistics are shown above', link: '#', btnText: 'Stats Shown Above', color: '#6c757d' }
        ].map(item => (
          <div key={item.title} className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '20px' }}>{item.desc}</p>
              {item.link !== '#' && (
                <Link to={item.link} className="btn btn-outline btn-sm">{item.btnText}</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
