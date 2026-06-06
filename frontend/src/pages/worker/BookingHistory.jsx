import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_COLORS = { Pending: 'warning', Confirmed: 'info', Completed: 'success', Cancelled: 'danger' };

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my')
      .then(r => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const completed = bookings.filter(b => b.status === 'Completed');
  const cancelled = bookings.filter(b => b.status === 'Cancelled');

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Booking History</h1>
        <p className="page-desc">All completed and cancelled jobs</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Bookings', value: bookings.length, bg: '#f8f9fa', color: '#495057' },
          { label: 'Completed', value: completed.length, bg: '#d4f5e2', color: '#1a6b3a' },
          { label: 'Cancelled', value: cancelled.length, bg: '#fde8e8', color: '#c0392b' }
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, padding: '16px 24px', borderRadius: '10px',
            border: `1px solid ${s.bg}`, minWidth: '140px'
          }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '2px', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Completed and cancelled jobs will appear here</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>City</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td style={{ fontWeight: 600 }}>{b.customerId?.name}</td>
                  <td style={{ fontSize: '13px', color: '#6c757d' }}>{b.customerId?.phone}</td>
                  <td style={{ fontSize: '13px', color: '#6c757d' }}>{b.customerId?.city}</td>
                  <td>{b.serviceType}</td>
                  <td style={{ fontSize: '13px', color: '#6c757d' }}>
                    {new Date(b.scheduledDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td><span className={`badge status-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
