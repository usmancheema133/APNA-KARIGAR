import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

const STATUS_COLORS = { Pending: 'warning', Confirmed: 'info', Completed: 'success', Cancelled: 'danger' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const cancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'Cancelled' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-desc">Track all your service bookings</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
            {s === 'all' ? 'All' : s} {s !== 'all' && `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}</h3>
          <p>
            {filter === 'all' ? (
              <><Link to="/workers" style={{ color: '#1a6b3a', fontWeight: 600 }}>Browse workers</Link> to make your first booking</>
            ) : 'Try a different filter'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(booking => {
            const worker = booking.workerId;
            const workerUser = worker?.userId;
            return (
              <div key={booking._id} className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '18px'
                      }}>
                        {workerUser?.name?.charAt(0) || 'K'}
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: '16px' }}>{workerUser?.name || 'Worker'}</h3>
                        <div style={{ fontSize: '13px', color: '#6c757d' }}>{booking.serviceType} · {workerUser?.city}</div>
                      </div>
                    </div>
                    <span className={`badge badge-${STATUS_COLORS[booking.status] || 'gray'}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Date & Time</div>
                      <div style={{ fontWeight: 500, marginTop: '2px' }}>
                        {new Date(booking.scheduledDate).toLocaleString('en-PK', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Address</div>
                      <div style={{ fontWeight: 500, marginTop: '2px' }}>{booking.address}</div>
                    </div>
                    {booking.notes && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Notes</div>
                        <div style={{ fontWeight: 500, marginTop: '2px', color: '#495057' }}>{booking.notes}</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {booking.status === 'Pending' && (
                      <button onClick={() => cancelBooking(booking._id)} className="btn btn-danger btn-sm">
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'Completed' && !booking.hasReview && (
                      <Link to={`/review/${booking._id}`} className="btn btn-accent btn-sm">
                        ⭐ Leave Review
                      </Link>
                    )}
                    {booking.status === 'Completed' && booking.hasReview && (
                      <span className="badge badge-success">Review Submitted</span>
                    )}
                    <Link to={`/workers/${worker?._id}`} className="btn btn-ghost btn-sm">
                      View Worker Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
