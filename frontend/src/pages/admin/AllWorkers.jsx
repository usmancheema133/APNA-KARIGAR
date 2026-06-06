import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AllWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/admin/workers');
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const deleteWorker = async (id) => {
    if (!confirm('Are you sure you want to delete this worker? This will also remove their user account.')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete worker');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = workers.filter(w => {
    const matchSearch = !search ||
      w.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      w.userId?.city?.toLowerCase().includes(search.toLowerCase()) ||
      w.cnic?.includes(search);
    const matchCat = !categoryFilter || w.serviceCategory === categoryFilter;
    return matchSearch && matchCat;
  });

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Workers</h1>
        <p className="page-desc">{workers.length} total karigar registered</p>
      </div>

      <div className="filter-bar" style={{ marginBottom: '20px' }}>
        <input
          className="form-control"
          placeholder="Search by name, city or CNIC..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select className="form-control" style={{ maxWidth: '200px' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {['Electrician', 'Plumber', 'Welder', 'Carpenter'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span className="badge badge-success">{workers.filter(w => w.isVerified).length} Verified</span>
        <span className="badge badge-warning">{workers.filter(w => !w.isVerified).length} Pending</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <h3>No workers found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Karigar</th>
                <th>Category</th>
                <th>CNIC</th>
                <th>City</th>
                <th>Experience</th>
                <th>Rating</th>
                <th>Jobs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0
                      }}>
                        {w.userId?.name?.charAt(0) || 'K'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{w.userId?.name}</div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>{w.userId?.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{w.serviceCategory}</span></td>
                  <td style={{ fontSize: '13px', color: '#6c757d', fontFamily: 'monospace' }}>{w.cnic}</td>
                  <td>{w.userId?.city}</td>
                  <td>{w.experience} yr{w.experience !== 1 ? 's' : ''}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StarRating value={Math.round(w.averageRating)} readonly size={13} />
                      <span style={{ fontSize: '12px', color: '#6c757d' }}>{w.averageRating > 0 ? w.averageRating.toFixed(1) : '-'}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{w.totalJobs}</td>
                  <td>
                    {w.isVerified
                      ? <span className="badge badge-success">Verified</span>
                      : <span className="badge badge-warning">Pending</span>}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteWorker(w._id)}
                      disabled={deleting === w._id}
                    >
                      {deleting === w._id ? '...' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
