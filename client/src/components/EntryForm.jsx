import React, { useState } from 'react';
import Button from './Button';
import { formatDate } from '../utils/utils';

const EntryForm = ({ entry, onSave, onCancel, onDelete, isNew = false }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');

  const handleSave = () => {
    const entryData = {
      ...(entry || { id: Date.now(), date: new Date().toISOString() }),
      title: title.trim(),
      content: content.trim() || 'Untitled Entry'
    };
    onSave(entryData);
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 32px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff'
      }}>
        <Button variant="secondary" onClick={onCancel}>
          {isNew ? 'Cancel' : '← Back'}
        </Button>
        {isNew ? (
          <h3 style={{ fontFamily: 'Inter', fontWeight: 600, margin: 0 }}>
            New Entry
          </h3>
        ) : null}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={handleSave}>Save</Button>
          {!isNew && <Button variant="danger" onClick={handleDelete}>Delete</Button>}
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: '20px 32px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <p style={{
          color: '#666',
          fontSize: '14px',
          marginBottom: '20px',
          fontFamily: 'Inter',
        }}>
          {formatDate(new Date(entry?.date || new Date()), 'EEEE, MMMM dd, yyyy')}
        </p>

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
          autoFocus={isNew}
        />

        <textarea
          placeholder={isNew ? "What's on your mind today?" : "What's on your mind?"}
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

export default EntryForm;