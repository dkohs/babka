import React from 'react';

const Button = ({ onClick, style, children, variant = 'primary' }) => {
  const baseStyle = {
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const variants = {
    primary: { background: '#9CAF88', color: 'white' },
    danger: { background: '#C19A9A', color: 'white' },
    secondary: { background: 'none', color: '#666' }
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

export default Button;