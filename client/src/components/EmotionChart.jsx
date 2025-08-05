import React from 'react';

const EmotionChart = ({ selectedPeriod, emotionDataSets }) => {
  const currentData = emotionDataSets[selectedPeriod];
  const emotions = [
    { name: 'happiness', color: '#9CAF88', label: 'HAPPINESS' },
    { name: 'anger', color: '#E74C3C', label: 'ANGER' },
    { name: 'sadness', color: '#3498DB', label: 'SADNESS' },
    { name: 'joy', color: '#F39C12', label: 'JOY' }
  ];

  return (
    <div style={{
      backgroundColor: '#E6ECE3',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontFamily: 'Inter',
          fontWeight: '600',
          fontSize: '16px',
          margin: 0,
          color: '#2C3E28'
        }}>
          EMOTIONS TREND
        </h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {emotions.map((emotion) => (
            <div key={emotion.name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                width: '12px',
                height: '2px',
                backgroundColor: emotion.color
              }}></div>
              <span style={{
                fontFamily: 'Inter',
                fontSize: '10px',
                color: '#888',
                letterSpacing: '0.5px'
              }}>
                {emotion.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', height: '250px', width: '100%' }}>
        <svg width="100%" height="250" style={{ overflow: 'visible' }}>
          {[100, 50, 0, -50, -100].map((value, index) => (
            <g key={value}>
              <text
                x="30"
                y={40 + index * 42}
                fill="#888"
                fontSize="12"
                textAnchor="end"
                fontFamily="Inter"
              >
                {value}
              </text>
              <line
                x1="40"
                y1={40 + index * 42}
                x2={window.innerWidth > 400 ? window.innerWidth - 120 : 280}
                y2={40 + index * 42}
                stroke="#ccc"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          ))}

          {emotions.map((emotion) => (
            <g key={emotion.name}>
              <polyline
                fill="none"
                stroke={emotion.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={currentData[emotion.name].map((point, index) => {
                  const chartStartX = 50;
                  const chartEndX = window.innerWidth > 400 ? window.innerWidth - 120 : 280;
                  const x = chartStartX + (index * (chartEndX - chartStartX) / (currentData[emotion.name].length - 1));
                  const y = 208 - ((point.value + 100) * 168 / 200);
                  return `${x},${y}`;
                }).join(' ')}
              />

              {currentData[emotion.name].map((point, index) => {
                const chartStartX = 50;
                const chartEndX = window.innerWidth > 400 ? window.innerWidth - 120 : 280;
                const x = chartStartX + (index * (chartEndX - chartStartX) / (currentData[emotion.name].length - 1));
                const y = 208 - ((point.value + 100) * 168 / 200);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={emotion.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          ))}
        </svg>

        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {currentData.happiness.map((point, index) => (
            <span
              key={index}
              style={{
                fontFamily: 'Inter',
                fontSize: selectedPeriod === 'year' ? '10px' : '12px',
                color: '#888',
                textAlign: 'center'
              }}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionChart;