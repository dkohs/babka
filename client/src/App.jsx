import hamburger from './asset/hamburger.svg'
import mag_glass from './asset/mag_glass.svg'
import navig from './asset/navig.svg'
import plus from './asset/plus.svg'
import filler from './asset/filler.svg'
import home from './asset/home.svg'
import stats from './asset/stats.svg'
import profile from './asset/profile.svg'
import React, { useState } from 'react';

const subDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

// Helper functions for date checking
const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isWithinLast30Days = (date) => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  return date >= thirtyDaysAgo && date < today;
};

const formatDate = (date, format) => {
  const d = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'];
  switch (format) {
    case 'M/dd/yyyy':
      return `${d.getMonth() + 1}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
    case 'MM/dd/yyyy':
      return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
    case 'EEEE, MMMM dd, yyyy':
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    case 'MMMM yyyy':
      return `${months[d.getMonth()]} ${d.getFullYear()}`;
    default:
      return d.toLocaleDateString();
  }
};

const JournalSection = ({ title, entries, onEntryClick }) => {
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
          backgroundColor: '#E6ECE3',
          borderRadius: '8px',
          overflow: 'hidden',
          padding: '16px',
        }}
      >
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
              <p
                style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  margin: '0',
                }}
              >
                {formatDate(entry.date, 'M/dd/yyyy')}
              </p>

              <p
                style={{
                  fontSize: '14px',
                  color: '#556B4E',
                  marginTop: '2px',
                  marginBottom: '6px',
                  lineHeight: '1.3',
                }}
              >
                {entry.content.length > 30
                  ? entry.content.slice(0, 50) + '...'
                  : entry.content}
              </p>
            </div>
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

const JournalEntryList = ({ entries, onEntryClick }) => {
  const today = [];
  const last30Days = [];
  const older = {};


  entries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    if (isToday(entryDate)) {
      today.push(entry);
    } else if (isWithinLast30Days(entryDate)) {
      last30Days.push(entry);
    } else {
      const monthKey = formatDate(entryDate, 'MMMM yyyy');
      if (!older[monthKey]) older[monthKey] = [];
      older[monthKey].push(entry);
    }
  });

  return (
    <div style={{ padding: '0 32px' }}>
      {today.length > 0 && <JournalSection title="Today" entries={today} onEntryClick={onEntryClick} />}
      {last30Days.length > 0 && (
        <JournalSection title="Last 30 Days" entries={last30Days} onEntryClick={onEntryClick} />
      )}
      {Object.entries(older).map(([month, entries]) => (
        <JournalSection key={month} title={month} entries={entries} onEntryClick={onEntryClick} />
      ))}
    </div>
  );
};

// Entry Detail/Edit Screen Component
const EntryDetailScreen = ({ entry, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(entry.title || '');
  const [content, setContent] = useState(entry.content || '');

  const handleSave = () => {
    const updatedEntry = {
      ...entry,
      title: title.trim(),
      content: content.trim() || 'Untitled Entry'
    };
    onSave(updatedEntry);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry);
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
  padding: '20px 32px',
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
    ← Back
  </button>

  <div style={{ display: 'flex', gap: '12px' }}>
    <button
      onClick={handleSave}
      style={{
        background: '#9CAF88',
        border: 'none',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '500'
      }}
    >
      Save
    </button>
    <button
      onClick={handleDelete}
      style={{
        background: '#C19A9A',
        border: 'none',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '500'
      }}
    >
      Delete
    </button>
  </div>
</div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '20px 32px',
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
          {formatDate(new Date(entry.date), 'EEEE, MMMM dd, yyyy')}
        </p>

        {/* Title */}
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
        />

        {/* Content */}
        <textarea
          placeholder="What's on your mind?"
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


// Search Screen Component
const SearchScreen = ({ entries, onClose, onEntryClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const lowercaseQuery = query.toLowerCase();

    const filteredEntries = entries.filter((entry) => {
      // Search in content
      const contentMatch = entry.content.toLowerCase().includes(lowercaseQuery);

      // Search in title
      const titleMatch = entry.title && entry.title.toLowerCase().includes(lowercaseQuery);

      // Search in formatted date (various formats)
      const entryDate = new Date(entry.date);
      const dateFormats = [
        formatDate(entryDate, 'M/dd/yyyy'),
        formatDate(entryDate, 'MM/dd/yyyy'),
        formatDate(entryDate, 'MMMM yyyy'),
        entryDate.getFullYear().toString(),
        entryDate.toLocaleDateString(),
        entryDate.toDateString(),
      ];

      const dateMatch = dateFormats.some(dateFormat =>
        dateFormat.toLowerCase().includes(lowercaseQuery)
      );

      return contentMatch || titleMatch || dateMatch;
    });

    // Sort by date (newest first)
    const sortedResults = filteredEntries.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    setSearchResults(sortedResults);
    setIsSearching(false);
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
        alignItems: 'center',
        padding: '20px 32px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            color: '#666',
            cursor: 'pointer',
            padding: '8px',
            marginRight: '12px'
          }}
        >
          ← Back
        </button>

        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: 'calc(100% - 32px)',
              padding: '16px 20px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif', 
              outline: 'none',
              backgroundColor: '#f8f9fa'
              
            }}
            autoFocus
          />
        </div>
      </div>

      {/* Search Results */}
      <div style={{
        fontFamily: 'Inter',
        flex: 1,
        overflowY: 'auto',
        padding: '20px 0'
      }}>
        {!searchQuery.trim() && (
          <div style={{
            padding: '0 24px',
            textAlign: 'center',
            color: '#666',
            marginTop: '40px'
          }}>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 500, marginBottom: '8px' }}>
              Search your journal entries
            </h3>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.5' }}>
              Try searching for dates, keywords, or entry titles.<br />
              Examples: "today", "March 2025", "dog", "school"
            </p>
          </div>
        )}

        {searchQuery.trim() && isSearching && (
          <div style={{
            fontFamily: 'Inter',
            padding: '0 24px',
            textAlign: 'center',
            color: '#666',
            marginTop: '40px'
          }}>
            <p>Searching...</p>
          </div>
        )}

        {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
          <div style={{
            fontFamily: 'Inter',
            padding: '0 24px',
            textAlign: 'center',
            color: '#666',
            marginTop: '40px'
          }}>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 500, marginBottom: '8px' }}>
              No results found
            </h3>
            <p style={{ fontFamily: 'Inter', fontSize: '14px' }}>
              Try a different search term or check your spelling.
            </p>
          </div>
        )}

        {searchQuery.trim() && !isSearching && searchResults.length > 0 && (
          <div>
            <div style={{ 
              padding: '0 24px', 
              marginBottom: '24px' }}>
              <p style={{
                color: '#666',
                fontSize: '14px',
                fontFamily: 'Inter',
                margin: '0',
              }}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div style={{ padding: '0 32px'}}>
            <JournalSection title="Search Results" entries={searchResults} onEntryClick={onEntryClick} />
          </div>
          </div>
        )}
      </div>
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
        id: Date.now(), // Add unique ID for tracking
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
        padding: '20px 32px',
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
            background: '#9CAF88',
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
        padding: '20px 32px',
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
          {formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}
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
    id: 1,
    date: new Date().toISOString(), // today
    content: 'Today I went for a walk with my dog',
    title: 'Morning Walk'
  },
  {
    id: 2,
    date: new Date().toISOString(), // today
    content: "My pet fish just died. I don't know what to do",
    title: 'Sad Day'
  },
  {
    id: 3,
    date: subDays(new Date(), 5).toISOString(), // 5 days ago
    content: "I went out to eat ramen. It wasn't fun",
    title: 'Dinner Out'
  },
  {
    id: 4,
    date: subDays(new Date(), 10).toISOString(), // 10 days ago
    content: 'I am so excited for school to be over.',
    title: 'School Thoughts'
  },
  {
    id: 5,
    date: '2025-04-12T15:00:00Z', // older
    content: 'Finished reading a book.',
    title: 'Reading Achievement'
  },
  {
    id: 6,
    date: '2025-03-15T11:00:00Z', // older
    content: 'Spring break was nice.',
    title: 'Spring Break'
  },
  {
    id: 7,
    date: '2025-03-14T11:00:00Z', // older
    content: 'I feel so tired.',
    title: 'tired'
  },
  {
    id: 8,
    date: '2025-03-10T11:00:00Z', // older
    content: 'I ate corn and tasted stale...',
    title: 'Food Review'
  },
  {
    id: 9,
    date: '2025-03-10T11:00:00Z', // older
    content: 'My parents got mad because I broke...',
    title: 'Family Drama'
  },
];


const StatsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('day');

  // Sample emotion data for different periods
  const emotionDataSets = {
    day: {
      happiness: [
        { label: '12 AM', value: -85 },
        { label: '6 AM', value: -70 },
        { label: '12 PM', value: 75 },
        { label: '6 PM', value: -65 },
      ],
      anger: [
        { label: '12 AM', value: 60 },
        { label: '6 AM', value: 45 },
        { label: '12 PM', value: -20 },
        { label: '6 PM', value: 80 },
       
      ],
      sadness: [
        { label: '12 AM', value: 70 },
        { label: '6 AM', value: 85 },
        { label: '12 PM', value: -40 },
        { label: '6 PM', value: 50 },
       
      ],
      joy: [
        { label: '12 AM', value: -60 },
        { label: '6 AM', value: -50 },
        { label: '12 PM', value: 90 },
        { label: '6 PM', value: -30 },
       
      ]
    },
    week: {
      happiness: [
        { label: 'MON', value: -85 },
        { label: 'TUE', value: -70 },
        { label: 'WED', value: 75 },
        { label: 'THU', value: -65 },
        { label: 'FRI', value: 10 },
        { label: 'SAT', value: 45 },
        { label: 'SUN', value: 15 }
      ],
      anger: [
        { label: 'MON', value: 90 },
        { label: 'TUE', value: 60 },
        { label: 'WED', value: -30 },
        { label: 'THU', value: 70 },
        { label: 'FRI', value: 20 },
        { label: 'SAT', value: -10 },
        { label: 'SUN', value: 5 }
      ],
      sadness: [
        { label: 'MON', value: 80 },
        { label: 'TUE', value: 75 },
        { label: 'WED', value: -20 },
        { label: 'THU', value: 65 },
        { label: 'FRI', value: 15 },
        { label: 'SAT', value: -25 },
        { label: 'SUN', value: 10 }
      ],
      joy: [
        { label: 'MON', value: -70 },
        { label: 'TUE', value: -55 },
        { label: 'WED', value: 85 },
        { label: 'THU', value: -45 },
        { label: 'FRI', value: 35 },
        { label: 'SAT', value: 60 },
        { label: 'SUN', value: 25 }
      ]
    },
    month: {
      happiness: [
        { label: '1', value: -60 },
        { label: '8', value: -40 },
        { label: '15', value: 20 },
        { label: '22', value: 45 },
        { label: '29', value: 30 }
      ],
      anger: [
        { label: '1', value: 50 },
        { label: '8', value: 35 },
        { label: '15', value: 10 },
        { label: '22', value: -20 },
        { label: '29', value: -10 }
      ],
      sadness: [
        { label: '1', value: 65 },
        { label: '8', value: 45 },
        { label: '15', value: 5 },
        { label: '22', value: -30 },
        { label: '29', value: -15 }
      ],
      joy: [
        { label: '1', value: -45 },
        { label: '8', value: -25 },
        { label: '15', value: 40 },
        { label: '22', value: 65 },
        { label: '29', value: 50 }
      ]
    },
    year: {
      happiness: [
        { label: 'JAN', value: -20 },
        { label: 'FEB', value: -10 },
        { label: 'MAR', value: 30 },
        { label: 'APR', value: 50 },
        { label: 'MAY', value: 45 },
        { label: 'JUN', value: 60 },
        { label: 'JUL', value: 70 },
        { label: 'AUG', value: 65 },
        { label: 'SEP', value: 40 },
        { label: 'OCT', value: 25 },
        { label: 'NOV', value: 10 },
        { label: 'DEC', value: -5 }
      ],
      anger: [
        { label: 'JAN', value: 40 },
        { label: 'FEB', value: 30 },
        { label: 'MAR', value: 10 },
        { label: 'APR', value: -20 },
        { label: 'MAY', value: -15 },
        { label: 'JUN', value: -30 },
        { label: 'JUL', value: -40 },
        { label: 'AUG', value: -35 },
        { label: 'SEP', value: -10 },
        { label: 'OCT', value: 5 },
        { label: 'NOV', value: 20 },
        { label: 'DEC', value: 35 }
      ],
      sadness: [
        { label: 'JAN', value: 45 },
        { label: 'FEB', value: 35 },
        { label: 'MAR', value: 15 },
        { label: 'APR', value: -15 },
        { label: 'MAY', value: -10 },
        { label: 'JUN', value: -25 },
        { label: 'JUL', value: -35 },
        { label: 'AUG', value: -30 },
        { label: 'SEP', value: -5 },
        { label: 'OCT', value: 10 },
        { label: 'NOV', value: 25 },
        { label: 'DEC', value: 40 }
      ],
      joy: [
        { label: 'JAN', value: -35 },
        { label: 'FEB', value: -25 },
        { label: 'MAR', value: 20 },
        { label: 'APR', value: 45 },
        { label: 'MAY', value: 40 },
        { label: 'JUN', value: 55 },
        { label: 'JUL', value: 65 },
        { label: 'AUG', value: 60 },
        { label: 'SEP', value: 35 },
        { label: 'OCT', value: 20 },
        { label: 'NOV', value: 5 },
        { label: 'DEC', value: -10 }
      ]
    }
  };

  const currentData = emotionDataSets[selectedPeriod];
  const periodButtons = ['day', 'week', 'month', 'year'];

  // Emotion colors and configuration
  const emotions = [
    { name: 'happiness', color: '#9CAF88', label: 'HAPPINESS' },
    { name: 'anger', color: '#E74C3C', label: 'ANGER' },
    { name: 'sadness', color: '#3498DB', label: 'SADNESS' },
    { name: 'joy', color: '#F39C12', label: 'JOY' }
  ];

  const hamburger = "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 12H21M3 6H21M3 18H21' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

  return (
    <div style={{ padding: '20px 32px', paddingTop: '90px' }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 32px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ccc',
        zIndex: 1000,
      }}>
        <img src={hamburger} alt={'burger menu'} />
        <h3 style={{ fontFamily: 'Inter', fontWeight: 600 }}>
          Analytics
        </h3>
        <div style={{ width: '32px' }}></div>
      </div>

      {/* Period Selection */}
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
            onClick={() => setSelectedPeriod(period)}
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

      {/* Chart Container */}
      <div style={{
        backgroundColor: '#E6ECE3',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        {/* Chart Header */}
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

        {/* Chart SVG */}
        <div style={{ position: 'relative', height: '250px', width: '100%' }}>
          <svg width="100%" height="250" style={{ overflow: 'visible' }}>
            {/* Y-axis labels */}
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

            {/* Chart lines for each emotion */}
            {emotions.map((emotion) => (
              <g key={emotion.name}>
                {/* Line */}
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

                {/* Data points */}
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

          {/* X-axis labels */}
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
    </div>
  );
};


const ProfilePage = () => (
  <div style={{ padding: '20px 32px', paddingTop: '90px' }}>
    <h2 style={{ fontFamily: 'Inter', fontWeight: 600 }}>Profile</h2>
    <p>Your profile information will go here.</p>
  </div>
);

const FillerPage = () => (
  <div style={{ padding: '20px 32px', paddingTop: '90px' }}>
    <h2 style={{ fontFamily: 'Inter', fontWeight: 600 }}>Filler</h2>
    <p>idk.</p>
  </div>
);

export const App = () => {
  const [entries, setEntries] = useState(dummyEntries);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  const handleSaveEntry = (newEntry) => {
    setEntries([newEntry, ...entries]);
    setShowNewEntry(false);
  };

  const handleUpdateEntry = (updatedEntry) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (entryToDelete) => {
    setEntries(entries.filter(entry => entry.id !== entryToDelete.id));
    setSelectedEntry(null);
  };

  const handleCancelEntry = () => {
    setShowNewEntry(false);
  };

  const handlePlusClick = () => {
    setShowNewEntry(true);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowSearch(false);
  };

  const handleCloseEntryDetail = () => {
    setSelectedEntry(null);
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleStatsClick = () => {
    setCurrentPage('stats');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
  };

  const handleFillerClick = () => {
    setCurrentPage('filler');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
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
                padding: '0 32px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #ccc',
                zIndex: 1000,
              }}
            >
              <img src={hamburger} alt={'burger menu'} />
              <h3 style={{ fontFamily: 'Inter', fontWeight: 600 }}>
                Recent Journals
              </h3>
              <div
                onClick={handleSearchClick}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
              >
                <img src={mag_glass} alt={'mag glass'} />
              </div>
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
              <JournalEntryList entries={entries} onEntryClick={handleEntryClick} />
            </div>
          </>
        );
      case 'stats':
        return <StatsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'filler':
        return <FillerPage />;
      default:
        return null;
    }
  };

  if (selectedEntry) {
    return (
      <EntryDetailScreen
        entry={selectedEntry}
        onSave={handleUpdateEntry}
        onCancel={handleCloseEntryDetail}
        onDelete={handleDeleteEntry}
      />
    );
  }

  if (showSearch) {
    return (
      <SearchScreen
        entries={entries}
        onClose={handleCloseSearch}
        onEntryClick={handleEntryClick}
      />
    );
  }

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
        {renderCurrentPage()}

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
              onClick={handleHomeClick}
              style={{
                position: 'absolute',
                top: '50%',
                left: '15%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                opacity: currentPage === 'home' ? 1 : 0.8,
              }}
            />
            <img
              src={stats}
              alt={'stats'}
              onClick={handleStatsClick}
              style={{
                position: 'absolute',
                top: '50%',
                left: '32.5%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                opacity: currentPage === 'stats' ? 1 : 0.8,
              }}
            />
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
              onClick={handleFillerClick}
              style={{
                position: 'absolute',
                top: '50%',
                left: '67.5%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                opacity: currentPage === 'filler' ? 1 : 0.8,
              }}
            />
            <img
              src={profile}
              alt={'profile'}
              onClick={handleProfileClick}
              style={{
                position: 'absolute',
                top: '50%',
                left: '85%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                opacity: currentPage === 'profile' ? 1 : 0.8,
              }}
            />
          </div>
        </div>
      </div>
    </div>
    
  );
};