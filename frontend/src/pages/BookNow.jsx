import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookNow() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ scheduledDate: '', address: '', notes: '' });

  useEffect(() => {
    api.get(`/workers/${workerId}`)
      .then(r => setWorker(r.data.worker))
      .catch(() => setError('Worker not found.'))
      .finally(() => setLoading(false));
  }, [workerId]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        workerId,
        serviceType: worker.serviceCategory,
        scheduledDate: form.scheduledDate,
        address: form.address,
        notes: form.notes
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (success) return (
    <div className="page" style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
      <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 700, marginBottom: '10px', color: '#1a6b3a' }}>
        Booking Confirmed!
      </h2>
      <p style={{ color: '#6c757d', marginBottom: '28px', fontSize: '15px' }}>
        Your booking request has been sent to <strong>{worker?.userId?.name}</strong>.
        You will be notified once they confirm.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">View My Bookings</button>
        <button onClick={() => navigate('/workers')} className="btn btn-ghost">Find More Workers</button>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '20px' }}>← Back</button>

      <div className="page-header">
        <h1 className="page-title">Book a Karigar</h1>
        <p className="page-desc">Fill in the details for your service request</p>
      </div>

      {worker && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-body" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '20px', fontWeight: 800, flexShrink: 0
            }}>
              {worker.userId?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{worker.userId?.name}</div>
              <div style={{ fontSize: '13px', color: '#6c757d' }}>{worker.serviceCategory} · {worker.userId?.city}</div>
              <div style={{ fontSize: '13px', color: '#6c757d' }}>⭐ {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'No reviews'} · {worker.totalJobs} jobs</div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Service Type</label>
              <input className="form-control" value={worker?.serviceCategory || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Date & Time</label>
              <input
                className="form-control"
                type="datetime-local"
                value={form.scheduledDate}
                onChange={e => set('scheduledDate', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Address</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="House no., street, area, city..."
                value={form.address}
                onChange={e => set('address', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Additional Notes (optional)</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Describe the problem or any special instructions..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>
            <div className="alert alert-info" style={{ fontSize: '13px' }}>
              The karigar will confirm or decline your booking. Status will update in My Bookings.
            </div>
            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Sending Request...' : 'Confirm Booking →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
