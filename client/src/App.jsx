
import hamburger from './asset/hamburger.svg'
import mag_glass from './asset/mag_glass.svg'
import navig from './asset/navig.svg'
import plus from './asset/plus.svg'
import filler from './asset/filler.svg'
import home from './asset/home.svg'
import stats from './asset/stats.svg'
import profile from './asset/profile.svg'
import React, { useState } from 'react';
import {
  format,
  isToday,
  isWithinInterval,
  subDays,
  parseISO,
} from 'date-fns';

const JournalSection = ({ title, entries }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h4
        style={{
          fontWeight: '600',
          fontSize: '16px',
          marginBottom: '8px',
        }}
      >
        {title}
      </h4>
      <div
        style={{
          backgroundColor: '#E0E0E0',
          borderRadius: '10px',
          overflow: 'hidden',
          padding: '12px',
        }}
      >
        {entries.map((entry, index) => (
          <div key={index}>
            <p
              style={{
                fontWeight: '600',
                fontSize: '14px',
                margin: 0,
              }}
            >
              {format(parseISO(entry.date), 'M/dd/yyyy')}
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#333',
                marginTop: '2px',
                marginBottom: '8px',
              }}
            >
              {entry.content.length > 40
                ? entry.content.slice(0, 40) + '...'
                : entry.content}
            </p>
            {index !== entries.length - 1 && (
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid #ccc',
                  margin: '8px 0',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const JournalEntryList = ({ entries }) => {
  const today = [];
  const last30Days = [];
  const older = {};
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  entries.forEach((entry) => {
    const entryDate = parseISO(entry.date);
    if (isToday(entryDate)) {
      today.push(entry);
    } else if (
      isWithinInterval(entryDate, { start: thirtyDaysAgo, end: now })
    ) {
      last30Days.push(entry);
    } else {
      const monthKey = format(entryDate, 'MMMM yyyy');
      if (!older[monthKey]) older[monthKey] = [];
      older[monthKey].push(entry);
    }
  });

  return (
    <div style={{ padding: '0 39px' }}>
      {today.length > 0 && <JournalSection title="Today" entries={today} />}
      {last30Days.length > 0 && (
        <JournalSection title="Last 30 Days" entries={last30Days} />
      )}
      {Object.entries(older).map(([month, entries]) => (
        <JournalSection key={month} title={month} entries={entries} />
      ))}
    </div>
  );
};

// New Entry Component
const NewEntryScreen = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      const newEntry = {
        date: new Date().toISOString(),
        content: content.trim() || 'Untitled Entry',
        title: title.trim()
      };
      onSave(newEntry);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#fff',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 39px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff'
      }}>
        <button 
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            color: '#666',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          Cancel
        </button>
        
        <h3 style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          margin: 0
        }}>
          New Entry
        </h3>
        
        <button 
          onClick={handleSave}
          style={{
            background: '#007AFF',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '20px 39px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Date */}
        <p style={{
          color: '#666',
          fontSize: '14px',
          marginBottom: '20px',
          fontFamily: 'Inter',
        }}>
          {format(new Date(), 'EEEE, MMMM dd, yyyy')}
        </p>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Entry title (optional)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            fontFamily: 'Inter, sans-serif',
            backgroundColor: 'transparent'
          }}
          autoFocus
        />

        {/* Content Textarea */}
        <textarea
          placeholder="What's on your mind today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            resize: 'none',
            backgroundColor: 'transparent',
            lineHeight: '1.6'
          }}
        />
      </div>
    </div>
  );
};

const dummyEntries = [
  {
    date: new Date().toISOString(), // today
    content: 'Today I went for a walk with my dog',
  },
  {
    date: new Date().toISOString(), // today
    content: "My pet fish just died. I don't know what to do",
  },
  {
    date: subDays(new Date(), 5).toISOString(), // 5 days ago
    content: "I went out to eat ramen. It wasn't fun",
  },
  {
    date: subDays(new Date(), 10).toISOString(), // 10 days ago
    content: 'I am so excited for school to be over.',
  },
  {
    date: '2025-04-12T15:00:00Z', // older
    content: 'Finished reading a book.',
  },
  {
    date: '2025-03-15T11:00:00Z', // older
    content: 'Spring break was nice.',
  },
  {
    date: '2025-03-14T11:00:00Z', // older
    content: 'I feel so tired.',
  },
  {
    date: '2025-03-10T11:00:00Z', // older
    content: 'I ate corn and tasted stale...',
  },
  {
    date: '2025-03-10T11:00:00Z', // older
    content: 'My parents got mad because I broke...',
  },
];

export const App = () => {
  const [entries, setEntries] = useState(dummyEntries);
  const [showNewEntry, setShowNewEntry] = useState(false);

  const handleSaveEntry = (newEntry) => {
    setEntries([newEntry, ...entries]);
    setShowNewEntry(false);
  };

  const handleCancelEntry = () => {
    setShowNewEntry(false);
  };

  const handlePlusClick = () => {
    setShowNewEntry(true);
  };

  if (showNewEntry) {
    return (
      <NewEntryScreen 
        onSave={handleSaveEntry}
        onCancel={handleCancelEntry}
      />
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 39px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #ccc',
            zIndex: 1000,
          }}
        >
          <img src={hamburger} alt={'burger menu'} />
          <h3
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
            }}
          >
            Recent Journals
          </h3>
          <img src={mag_glass} alt={'mag glass'} />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '70px',
            bottom: '60px',
            left: 0,
            right: 0,
            overflowY: 'auto',
            padding: '0 2px',
            boxSizing: 'border-box',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <JournalEntryList entries={entries} />
        </div>

        {/* navigation */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            padding: 0,
            margin: 0,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={navig}
              alt={'navigation'}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
            <img
              src={home}
              alt={'home'}
              style={{
                position: 'absolute',
                top: '50%',
                left: '15%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
              }}
            />
            <img
              src={stats}
              alt={'stats'}
              style={{
                position: 'absolute',
                top: '50%',
                left: '32.5%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
              }}
            />
            {/* Plus button - now clickable */}
            <img
              src={plus}
              alt={'plus button'}
              onClick={handlePlusClick}
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(2)',
                width: '45px',
                height: '45px',
                cursor: 'pointer'
              }}
            />
            <img
              src={filler}
              alt={'filler'}
              style={{
                position: 'absolute',
                top: '50%',
                left: '67.5%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
              }}
            />
            <img
              src={profile}
              alt={'profile'}
              style={{
                position: 'absolute',
                top: '50%',
                left: '85%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};