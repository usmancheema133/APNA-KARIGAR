import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <div>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '42px', fontWeight: 800, color: '#1a1a2e', marginBottom: '12px' }}>404</h1>
        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#495057', marginBottom: '10px' }}>Page Not Found</h2>
        <p style={{ color: '#6c757d', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
          The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/workers" className="btn btn-ghost">Browse Workers</Link>
        </div>
      </div>
    </div>
  );
}
