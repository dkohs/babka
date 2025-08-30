import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const useEntries = () => {
  const { isAuthenticated, apiRequest } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transformJournal = (journal) => ({
    id: journal._id,
    title: journal.entry.substring(0, 50) + (journal.entry.length > 50 ? '...' : ''),
    content: journal.entry,
    date: new Date(journal.createdAt).toISOString().split('T')[0],
    time: new Date(journal.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    mlAnalysis: journal.mlAnalysis,
    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt
  });

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest('/api/ml');
      const data = response.data?.journals?.map(transformJournal) || [];
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (content) => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/ml/infer', {
        method: 'POST',
        body: { sentence: content }
      });
      
      const entryResponse = await apiRequest(`/api/ml/${response.journal_id}`);
      const newEntry = transformJournal(entryResponse.data);
      
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      setLoading(true);
      await apiRequest(`/api/ml/${entryId}`, { method: 'DELETE' });
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = (updatedEntry) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEntries();
    }
  }, [isAuthenticated]);

  return {
    entries,
    loading,
    error,
    loadEntries,
    createEntry,
    deleteEntry,
    updateEntry
  };
};