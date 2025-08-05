import React from 'react';
import { formatDate } from '../utils/utils';

const JournalSection = ({ title, entries, onEntryClick }) => (
  <div style={{ marginBottom: '24px' }}>
    <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>
      {title}
    </h4>
    <div style={{
      backgroundColor: '#E6ECE3',
      borderRadius: '8px',
      overflow: 'hidden',
      padding: '16px',
    }}>
      {entries.map((entry, index) => (
        <div key={index}>
          <div
            onClick={() => onEntryClick(entry)}
            style={{
              cursor: 'pointer',
              padding: '2px 0',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <p style={{ fontWeight: '600', fontSize: '14px', margin: '0' }}>
              {formatDate(entry.date, 'M/dd/yyyy')}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#556B4E',
              marginTop: '2px',
              marginBottom: '6px',
              lineHeight: '1.3',
            }}>
              {entry.content.length > 30
                ? entry.content.slice(0, 50) + '...'
                : entry.content}
            </p>
          </div>
          {index !== entries.length - 1 && (
            <hr style={{
              border: 'none',
              borderTop: '1px solid #ccc',
              margin: '8px 0',
            }} />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default JournalSection;