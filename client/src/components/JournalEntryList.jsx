import React from 'react';
import JournalSection from './JournalSection';
import { isToday, isWithinLast30Days, formatDate } from '../utils/utils';

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

export default JournalEntryList;