import React from 'react';

const PeriodSelector = ({ selectedPeriod, onPeriodChange }) => {
  const periodButtons = ['day', 'week', 'month', 'year'];

  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#E6ECE3',
      borderRadius: '12px',
      padding: '4px',
      marginBottom: '16px'
    }}>
      {periodButtons.map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: selectedPeriod === period ? '#9CAF88' : 'transparent',
            color: selectedPeriod === period ? 'white' : '#556B4E',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textTransform: 'capitalize'
          }}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;