import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LeaveReview() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then(r => setBooking(r.data))
      .catch(() => setError('Booking not found.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a star rating.');
    setError('');
    setSubmitting(true);
    try {
      await api.post('/reviews', { bookingId, rating, comment });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (success) return (
    <div className="page" style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>⭐</div>
      <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 700, marginBottom: '10px', color: '#1a6b3a' }}>Review Submitted!</h2>
      <p style={{ color: '#6c757d', marginBottom: '28px' }}>Thank you for helping others find the best karigar.</p>
      <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">Back to My Bookings</button>
    </div>
  );

  const worker = booking?.workerId;
  const workerUser = worker?.userId;

  return (
    <div className="page" style={{ maxWidth: '520px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '20px' }}>← Back</button>

      <div className="page-header">
        <h1 className="page-title">Leave a Review</h1>
        <p className="page-desc">Share your experience to help others</p>
      </div>

      {booking && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-body" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '20px', fontWeight: 700
            }}>
              {workerUser?.name?.charAt(0) || 'K'}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{workerUser?.name}</div>
              <div style={{ fontSize: '13px', color: '#6c757d' }}>{booking.serviceType} · {workerUser?.city}</div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <div style={{ marginTop: '8px' }}>
                <StarRating value={rating} onChange={setRating} size={36} />
                <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '8px' }}>
                  {rating === 0 && 'Click to rate'}
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent!'}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Your Review</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Describe your experience with this karigar..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={submitting || rating === 0}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
