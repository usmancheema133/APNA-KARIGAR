import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SERVICES = [
  { icon: '⚡', name: 'Electricians', desc: 'Wiring, repairs & installations', color: '#fff3cd', border: '#f39c12' },
  { icon: '🔧', name: 'Plumbers', desc: 'Pipes, leaks & fixtures', color: '#dbeafe', border: '#3498db' },
  { icon: '🔩', name: 'Welders', desc: 'Metal work & fabrication', color: '#fde8e8', border: '#e74c3c' },
  { icon: '🪚', name: 'Carpenters', desc: 'Furniture & woodwork', color: '#d4f5e2', border: '#27ae60' }
];

const STEPS = [
  { step: '01', title: 'Browse Workers', desc: 'Search verified professionals by service category and city.' },
  { step: '02', title: 'Book Instantly', desc: 'Select your worker, pick a date and confirm your booking.' },
  { step: '03', title: 'Track Status', desc: 'Monitor your booking from Pending to Completed in real time.' },
  { step: '04', title: 'Rate & Review', desc: 'Leave an honest rating to help others find the best karigar.' }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f3d23 0%, #1a6b3a 60%, #27ae60 100%)',
        color: 'white', padding: '80px 20px', textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            padding: '6px 18px', borderRadius: '50px', fontSize: '13px',
            fontWeight: 600, marginBottom: '20px', backdropFilter: 'blur(10px)'
          }}>
            🇵🇰 Pakistan's Trust-First Home Services Platform
          </div>
          <h1 style={{
            fontFamily: 'Poppins, sans-serif', fontSize: '52px', fontWeight: 800,
            lineHeight: 1.15, marginBottom: '20px'
          }}>
            Find Your <span style={{ color: '#f39c12' }}>Karigar</span><br />With Confidence
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '36px', lineHeight: 1.6 }}>
            Every worker is CNIC-verified. Every job is rated. No more guesswork —
            just trusted professionals at your doorstep.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/workers" style={{
              background: '#f39c12', color: 'white', padding: '15px 32px',
              borderRadius: '10px', fontSize: '16px', fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(243,156,18,0.4)'
            }}>Browse Workers →</Link>
            {!user && (
              <Link to="/register" style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                padding: '15px 32px', borderRadius: '10px', fontSize: '16px',
                fontWeight: 700, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(10px)'
              }}>Join as Karigar</Link>
            )}
          </div>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
            {[['100%', 'CNIC Verified'], ['4 Cities', 'Service Areas'], ['4 Trades', 'Categories']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Poppins, sans-serif', color: '#f39c12' }}>{num}</div>
                <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Services */}
        <div style={{ padding: '70px 0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '32px', fontWeight: 700, color: '#1a1a2e' }}>
              Service Categories
            </h2>
            <p style={{ color: '#6c757d', fontSize: '15px', marginTop: '8px' }}>
              Find skilled professionals across four core trade categories
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
            {SERVICES.map(s => (
              <Link key={s.name} to={`/workers?category=${s.name.slice(0,-1)}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: s.color, border: `2px solid ${s.border}`, borderRadius: '14px',
                  padding: '28px', textAlign: 'center', transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '44px', marginBottom: '14px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1a1a2e', marginBottom: '6px' }}>{s.name}</div>
                  <div style={{ fontSize: '13px', color: '#495057' }}>{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ padding: '40px 0 70px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '32px', fontWeight: 700, color: '#1a1a2e' }}>
              How It Works
            </h2>
            <p style={{ color: '#6c757d', fontSize: '15px', marginTop: '8px' }}>
              Book a trusted karigar in four simple steps
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {STEPS.map(s => (
              <div key={s.step} style={{
                background: 'white', borderRadius: '14px', padding: '28px',
                border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '-10px', right: '-10px',
                  fontSize: '80px', fontWeight: 800, color: '#f5f7fa',
                  fontFamily: 'Poppins, sans-serif', lineHeight: 1
                }}>{s.step}</div>
                <div style={{
                  width: '44px', height: '44px', background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontFamily: 'Poppins, sans-serif', marginBottom: '16px'
                }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', color: '#1a1a2e' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#6c757d', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
          borderRadius: '16px', padding: '48px 40px', textAlign: 'center',
          marginBottom: '60px', color: 'white'
        }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
            Why Apna Karigar?
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.85, maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            We bring the InDrive trust model to home services — verified IDs, transparent ratings, direct connections.
          </p>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              ['🪪', 'CNIC Verified', 'Every worker carries a verified digital ID'],
              ['⭐', 'Rated & Reviewed', 'Real feedback after every completed job'],
              ['📍', 'City-Based', 'Find workers in your area quickly']
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ maxWidth: '180px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13px', opacity: 0.75 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
