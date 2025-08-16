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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState(dummyEntries);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

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

  // Handle special states
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
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupScreen /></PublicRoute>} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage 
              entries={entries} 
              onEntryClick={handleEntryClick}
              onSearchClick={() => setShowSearch(true)}
            />
          </ProtectedRoute>
        } />
        <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/filler" element={<ProtectedRoute><FillerPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      {isAuthenticated && (
        <NavigationBar onPlusClick={() => setShowNewEntry(true)} onNavigate={() => {}} />
      )}
    </div>
  );
};

export const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);