import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

const CATEGORIES = ['Electrician', 'Plumber', 'Welder', 'Carpenter'];
const CITIES = ['Faisalabad', 'Lahore','Islamabad','Rawalpindi'];

export default function WorkerList() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: '',
    search: ''
  });

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.city) params.city = filters.city;
      if (filters.search) params.search = filters.search;
      const res = await api.get('/workers', { params });
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, [filters]);

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Find Your Karigar</h1>
        <p className="page-desc">Browse verified home service professionals across Pakistan</p>
      </div>

      <div className="filter-bar">
        <input
          className="form-control"
          placeholder="Search by name, service or city..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select className="form-control" style={{ maxWidth: '200px' }} value={filters.category} onChange={e => set('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" style={{ maxWidth: '200px' }} value={filters.city} onChange={e => set('city', e.target.value)}>
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filters.category || filters.city || filters.search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ category: '', city: '', search: '' })}>
            Clear Filters
          </button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '20px' }}>
            {workers.length} verified karigar{workers.length !== 1 ? 's' : ''} found
          </p>

          {workers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No workers found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="grid-3">
              {workers.map(worker => (
                <Link key={worker._id} to={`/workers/${worker._id}`} style={{ textDecoration: 'none' }}>
                  <div className="worker-card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                      <div className="worker-avatar">
                        {worker.userId?.name?.charAt(0) || 'K'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' }}>
                          {worker.userId?.name || 'N/A'}
                        </h3>
                        <span className="badge badge-primary">{worker.serviceCategory}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', align: 'center', gap: '6px', marginBottom: '10px' }}>
                      <StarRating value={Math.round(worker.averageRating)} readonly size={16} />
                      <span style={{ fontSize: '13px', color: '#6c757d', marginLeft: '4px' }}>
                        {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'No reviews'} · {worker.totalJobs} jobs
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#6c757d' }}>
                      <div>📍 {worker.userId?.city}</div>
                      <div>🛠 {worker.experience} year{worker.experience !== 1 ? 's' : ''} experience</div>
                      {worker.description && (
                        <div style={{
                          marginTop: '8px', padding: '10px', background: '#f8f9fa',
                          borderRadius: '8px', fontSize: '12px', lineHeight: 1.5,
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {worker.description}
                        </div>
                      )}
                    </div>

                    <div style={{
                      marginTop: '16px', padding: '10px', background: '#d4f5e2',
                      borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '12px', color: '#1a6b3a', fontWeight: 600
                    }}>
                      <span>🪪</span> CNIC Verified
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
