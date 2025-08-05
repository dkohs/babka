import React, { useState } from 'react';
import Button from './Button';
import JournalSection from './JournalSection';
import { formatDate } from '../utils/utils';

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
      const contentMatch = entry.content.toLowerCase().includes(lowercaseQuery);
      const titleMatch = entry.title && entry.title.toLowerCase().includes(lowercaseQuery);
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 32px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff'
      }}>
        <Button variant="secondary" onClick={onClose} style={{ marginRight: '12px' }}>
          ← Back
        </Button>
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

      <div style={{ fontFamily: 'Inter', flex: 1, overflowY: 'auto', padding: '20px 0' }}>
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
            <div style={{ padding: '0 24px', marginBottom: '24px' }}>
              <p style={{
                color: '#666',
                fontSize: '14px',
                fontFamily: 'Inter',
                margin: '0',
              }}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div style={{ padding: '0 32px' }}>
              <JournalSection title="Search Results" entries={searchResults} onEntryClick={onEntryClick} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;