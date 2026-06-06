import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_COLORS = { Pending: 'warning', Confirmed: 'info', Completed: 'success', Cancelled: 'danger' };

export default function JobRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');
  const [updating, setUpdating] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Job Requests</h1>
        <p className="page-desc">Manage incoming and active bookings from customers</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
            {s === 'all' ? 'All' : s} ({s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No {filter === 'all' ? '' : filter.toLowerCase()} bookings</h3>
          <p>Once your profile is verified, customers can book you</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(booking => (
            <div key={booking._id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3498db, #1e40af)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '16px'
                    }}>
                      {booking.customerId?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{booking.customerId?.name}</div>
                      <div style={{ fontSize: '13px', color: '#6c757d' }}>
                        {booking.customerId?.city} · {booking.customerId?.phone}
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${STATUS_COLORS[booking.status] || 'gray'}`}>{booking.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>Service</div>
                    <div style={{ fontWeight: 600 }}>{booking.serviceType}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>Scheduled</div>
                    <div style={{ fontWeight: 600 }}>
                      {new Date(booking.scheduledDate).toLocaleString('en-PK', {
                        weekday: 'short', month: 'short', day: 'numeric',
                        year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>Address</div>
                    <div style={{ fontWeight: 500 }}>{booking.address}</div>
                  </div>
                  {booking.notes && (
                    <div style={{ gridColumn: '1/-1' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>Notes</div>
                      <div style={{ color: '#495057' }}>{booking.notes}</div>
                    </div>
                  )}
                </div>

                {booking.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateStatus(booking._id, 'Confirmed')}
                      disabled={updating === booking._id}
                    >
                      {updating === booking._id ? 'Updating...' : '✓ Accept Job'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateStatus(booking._id, 'Cancelled')}
                      disabled={updating === booking._id}
                    >
                      ✕ Decline
                    </button>
                  </div>
                )}
                {booking.status === 'Confirmed' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => updateStatus(booking._id, 'Completed')}
                    disabled={updating === booking._id}
                  >
                    {updating === booking._id ? 'Updating...' : '✓ Mark as Completed'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
