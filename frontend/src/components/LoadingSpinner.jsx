const LoadingSpinner = ({ fullPage }) => {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    ...(fullPage ? { minHeight: '100vh' } : { padding: '60px 20px' })
  };
  return (
    <div style={style}>
      <div style={{
        width: '42px', height: '42px',
        border: '4px solid #e9ecef',
        borderTop: '4px solid #1a6b3a',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#6c757d', fontSize: '14px', fontWeight: 500 }}>Loading...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default LoadingSpinner;
