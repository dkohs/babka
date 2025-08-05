import React, { useState } from 'react';
import HomePage from './components/HomePage';
import StatsPage from './components/StatsPage';
import ProfilePage from './components/ProfilePage';
import FillerPage from './components/FillerPage';
import EntryForm from './components/EntryForm';
import SearchScreen from './components/SearchScreen';
import NavigationBar from './components/NavigationBar';
import { dummyEntries } from './utils/data';

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

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowSearch(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            entries={entries} 
            onEntryClick={handleEntryClick}
            onSearchClick={() => setShowSearch(true)}
          />
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
      <EntryForm
        entry={selectedEntry}
        onSave={handleUpdateEntry}
        onCancel={() => setSelectedEntry(null)}
        onDelete={handleDeleteEntry}
      />
    );
  }

  if (showSearch) {
    return (
      <SearchScreen
        entries={entries}
        onClose={() => setShowSearch(false)}
        onEntryClick={handleEntryClick}
      />
    );
  }

  if (showNewEntry) {
    return (
      <EntryForm
        onSave={handleSaveEntry}
        onCancel={() => setShowNewEntry(false)}
        isNew={true}
      />
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {renderCurrentPage()}
      <NavigationBar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onPlusClick={() => setShowNewEntry(true)}
      />
    </div>
  );
};