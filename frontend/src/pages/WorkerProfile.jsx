import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

export default function WorkerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/workers/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Worker not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;

  const { worker, reviews } = data;
  const u = worker.userId;

  return (
    <div className="page">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'start' }}>
        {/* Left: Profile */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '28px', fontWeight: 800, fontFamily: 'Poppins, sans-serif',
                  flexShrink: 0
                }}>
                  {u?.name?.charAt(0) || 'K'}
                </div>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Poppins, sans-serif', marginBottom: '6px' }}>
                    {u?.name}
                  </h1>
                  <span className="badge badge-primary" style={{ fontSize: '13px' }}>{worker.serviceCategory}</span>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StarRating value={Math.round(worker.averageRating)} readonly size={18} />
                    <span style={{ fontSize: '14px', color: '#6c757d' }}>
                      {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'No reviews yet'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#d4f5e2', color: '#1a6b3a', padding: '6px 14px',
                borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '20px'
              }}>
                🪪 CNIC Verified
              </div>

              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <div>
                  <div className="detail-label">City</div>
                  <div className="detail-value">{u?.city}</div>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">📞</span>
                <div>
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">{user ? u?.phone : '••••••••••• (Login to view)'}</div>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">🛠</span>
                <div>
                  <div className="detail-label">Experience</div>
                  <div className="detail-value">{worker.experience} year{worker.experience !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">✅</span>
                <div>
                  <div className="detail-label">Completed Jobs</div>
                  <div className="detail-value">{worker.totalJobs}</div>
                </div>
              </div>

              {worker.description && (
                <div style={{ marginTop: '16px', padding: '14px', background: '#f8f9fa', borderRadius: '10px', fontSize: '14px', lineHeight: 1.6, color: '#495057' }}>
                  {worker.description}
                </div>
              )}
            </div>

            {user?.role === 'customer' && (
              <div className="card-footer">
                <Link to={`/book/${worker._id}`} className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                  Book Now →
                </Link>
              </div>
            )}
            {!user && (
              <div className="card-footer">
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Login to Book
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Reviews */}
        <div>
          <div className="section-header">
            <div>
              <h2 className="section-title">Reviews</h2>
              <p className="section-subtitle">{reviews.length} customer review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-icon">💬</div>
              <h3>No reviews yet</h3>
              <p>Be the first to book and review this karigar</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reviews.map(r => (
                <div key={r._id} className="card">
                  <div className="card-body" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 700, fontSize: '14px'
                        }}>
                          {r.customerId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.customerId?.name}</div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>{r.customerId?.city}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <StarRating value={r.rating} readonly size={14} />
                        <div style={{ fontSize: '11px', color: '#adb5bd', marginTop: '2px' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#495057', lineHeight: 1.5 }}>{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
