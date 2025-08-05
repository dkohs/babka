import React from 'react';
import Header from './Header';
import JournalEntryList from './JournalEntryList';

const HomePage = ({ entries, onEntryClick, onSearchClick }) => {
  const hamburger = "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 12H21M3 6H21M3 18H21' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
  const mag_glass = "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8' stroke='%23000' stroke-width='2'/%3E%3Cpath d='m21 21-4.35-4.35' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

  return (
    <>
      <Header 
        title="Recent Journals"
        leftIcon={hamburger}
        rightIcon={mag_glass}
        onRightClick={onSearchClick}
      />
      <div style={{
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
      }}>
        <JournalEntryList entries={entries} onEntryClick={onEntryClick} />
      </div>
    </>
  );
};

export default HomePage;