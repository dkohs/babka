import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import HomePage from './components/HomePage';
import StatsPage from './components/StatsPage';
import ProfilePage from './components/ProfilePage';
import FillerPage from './components/FillerPage';
import EntryForm from './components/EntryForm';
import SearchScreen from './components/SearchScreen';
import NavigationBar from './components/NavigationBar';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import { dummyEntries } from './utils/data';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [entries, setEntries] = useState(dummyEntries);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

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
    <Router>
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                entries={entries} 
                onEntryClick={handleEntryClick}
                onSearchClick={() => setShowSearch(true)}
              />
            } 
          />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/filler" element={<FillerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <NavigationBar onPlusClick={() => setShowNewEntry(true)} />
      </div>
    </Router>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};