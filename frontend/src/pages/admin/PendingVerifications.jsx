import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const BACKEND_URL = 'http://localhost:5000';

function CnicPhoto({ filename, label }) {
  const [enlarged, setEnlarged] = useState(false);

  if (!filename) {
    return (
      <div style={{
        border: '2px dashed #dee2e6', borderRadius: '10px',
        padding: '24px', textAlign: 'center', color: '#adb5bd', fontSize: '13px'
      }}>
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>🪪</div>
        {label} not uploaded
      </div>
    );
  }

  const src = `${BACKEND_URL}/uploads/${filename}`;

  return (
    <>
      <div>
        <div style={{
          fontSize: '11px', fontWeight: 600, color: '#6c757d',
          textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px'
        }}>
          {label}
        </div>
        <div
          onClick={() => setEnlarged(true)}
          style={{
            cursor: 'zoom-in', borderRadius: '10px', overflow: 'hidden',
            border: '2px solid #dee2e6', transition: 'border-color 0.2s',
            position: 'relative', background: '#f8f9fa'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#1a6b3a'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#dee2e6'}
        >
          <img
            src={src}
            alt={label}
            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.45)', color: 'white',
            fontSize: '11px', fontWeight: 600, padding: '5px 10px',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            🔍 Click to enlarge
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {enlarged && (
        <div
          onClick={() => setEnlarged(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={src}
              alt={label}
              style={{
                maxWidth: '100%', maxHeight: '85vh',
                borderRadius: '12px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute', top: '-36px', right: 0,
              color: 'white', fontSize: '13px', fontWeight: 600, opacity: 0.8
            }}>
              {label} — click anywhere to close
            </div>
            <button
              onClick={e => { e.stopPropagation(); setEnlarged(false); }}
              style={{
                position: 'absolute', top: '-40px', left: 0,
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: 'white', borderRadius: '6px', padding: '4px 12px',
                fontSize: '13px', cursor: 'pointer', fontWeight: 600
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function PendingVerifications() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/workers/pending');
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handle = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this worker?`)) return;
    setProcessing(id);
    try {
      await api.patch(`/admin/workers/${id}/verify`, { action });
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Pending Verifications</h1>
        <p className="page-desc">Review and approve or reject worker ID applications</p>
      </div>

      {workers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>All caught up!</h3>
          <p>No worker applications are pending verification</p>
        </div>
      ) : (
        <>
          <div className="alert alert-info" style={{ marginBottom: '24px', fontSize: '13px' }}>
            {workers.length} worker application{workers.length !== 1 ? 's' : ''} waiting for review
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {workers.map(worker => {
              const u = worker.userId;
              return (
                <div key={worker._id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                          width: '56px', height: '56px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '22px', fontWeight: 800, flexShrink: 0
                        }}>
                          {u?.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>{u?.name}</h3>
                          <div style={{ fontSize: '13px', color: '#6c757d' }}>{u?.email} · {u?.phone}</div>
                          <div style={{ fontSize: '13px', color: '#6c757d' }}>📍 {u?.city}</div>
                        </div>
                      </div>
                      <span className="badge badge-warning" style={{ fontSize: '12px' }}>⏳ Pending Review</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                      {[
                        { label: 'Service Category', value: worker.serviceCategory },
                        { label: 'CNIC Number', value: worker.cnic },
                        { label: 'Experience', value: `${worker.experience} year${worker.experience !== 1 ? 's' : ''}` },
                        { label: 'Applied On', value: new Date(worker.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) }
                      ].map(d => (
                        <div key={d.label} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>{d.label}</div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{d.value}</div>
                        </div>
                      ))}
                    </div>

                    {worker.description && (
                      <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', color: '#495057', lineHeight: 1.6 }}>
                        <strong style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6c757d', textTransform: 'uppercase' }}>Bio</strong>
                        {worker.description}
                      </div>
                    )}

                    {/* CNIC Photos */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        fontSize: '12px', fontWeight: 700, color: '#1a6b3a',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        🪪 CNIC Identity Documents
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <CnicPhoto filename={worker.cnicFrontPhoto} label="CNIC Front" />
                        <CnicPhoto filename={worker.cnicBackPhoto}  label="CNIC Back"  />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-success"
                        onClick={() => handle(worker._id, 'approve')}
                        disabled={processing === worker._id}
                      >
                        {processing === worker._id ? 'Processing...' : '✓ Approve & Verify'}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handle(worker._id, 'reject')}
                        disabled={processing === worker._id}
                      >
                        ✕ Reject Application
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
