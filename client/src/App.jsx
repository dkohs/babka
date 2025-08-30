import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { useEntries } from "./hooks/useEntries";
import { HomePage } from "./components/HomePage";
import { StatsPage } from "./components/StatsPage";
import { ProfilePage } from "./components/ProfilePage";
import { FillerPage } from "./components/FillerPage";
import { EntryForm } from "./components/EntryForm";
import { SearchScreen } from "./components/SearchScreen";
import { NavigationBar } from "./components/NavigationBar";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const { entries, loading, error, createEntry, deleteEntry, updateEntry, loadEntries } = useEntries();
  
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    if (isAuthenticated && entries.length === 0 && !loading) {
      loadEntries();
    }
  }, [isAuthenticated]);

  const handleSaveEntry = async (newEntryData) => {
    try {
      await createEntry(newEntryData.content);
      setShowNewEntry(false);
    } catch (err) {
      console.error('Error saving entry:', err);
    }
  };

  const handleUpdateEntry = (updatedEntry) => {
    updateEntry(updatedEntry);
    setSelectedEntry(null);
  };

  const handleDeleteEntry = async (entryToDelete) => {
    try {
      await deleteEntry(entryToDelete.id);
      setSelectedEntry(null);
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowSearch(false);
  };

  if (isAuthenticated && loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading your journal entries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={loadEntries}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

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
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50">
          Processing...
        </div>
      )}
      
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupScreen />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage
                entries={entries}
                onEntryClick={handleEntryClick}
                onSearchClick={() => setShowSearch(true)}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <StatsPage entries={entries} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/filler"
          element={
            <ProtectedRoute>
              <FillerPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {isAuthenticated && (
        <NavigationBar
          onPlusClick={() => setShowNewEntry(true)}
          onNavigate={() => {}}
        />
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