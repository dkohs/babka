import React from 'react';

const NewJournal = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h2>New Journal Entry</h2>
      <textarea rows="10" cols="50" placeholder="Write your entry here..." />
      <br />
      <button style={{ marginTop: '12px' }}>Save</button>
    </div>
  );
};

export default NewJournal;