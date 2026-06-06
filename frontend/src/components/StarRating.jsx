const StarRating = ({ value = 0, onChange, size = 20, readonly = false }) => {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          style={{
            fontSize: size,
            color: star <= value ? '#f39c12' : '#dee2e6',
            cursor: readonly ? 'default' : 'pointer',
            transition: 'color 0.15s ease',
            lineHeight: 1
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
