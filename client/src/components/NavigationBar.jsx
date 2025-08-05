import React from 'react';

const NavigationBar = ({ currentPage, onNavigate, onPlusClick }) => {
  const navig = "data:image/svg+xml,%3Csvg width='100%25' height='60' viewBox='0 0 375 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='375' height='60' fill='%23E6ECE3'/%3E%3C/svg%3E";
  const home = "data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpolyline points='9,22 9,12 15,12 15,22' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
  const stats = "data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 20V10M12 20V4M6 20V14' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
  const plus = "data:image/svg+xml,%3Csvg width='45' height='45' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' fill='%239CAF88'/%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
  const filler = "data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='3' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
  const profile = "data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      padding: 0,
      margin: 0,
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img
          src={navig}
          alt="navigation"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
        <img
          src={home}
          alt="home"
          onClick={() => onNavigate('home')}
          style={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            opacity: currentPage === 'home' ? 1 : 0.8,
          }}
        />
        <img
          src={stats}
          alt="stats"
          onClick={() => onNavigate('stats')}
          style={{
            position: 'absolute',
            top: '50%',
            left: '32.5%',
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            opacity: currentPage === 'stats' ? 1 : 0.8,
          }}
        />
        <img
          src={plus}
          alt="plus button"
          onClick={onPlusClick}
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(2)',
            width: '45px',
            height: '45px',
            cursor: 'pointer'
          }}
        />
        <img
          src={filler}
          alt="filler"
          onClick={() => onNavigate('filler')}
          style={{
            position: 'absolute',
            top: '50%',
            left: '67.5%',
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            opacity: currentPage === 'filler' ? 1 : 0.8,
          }}
        />
        <img
          src={profile}
          alt="profile"
          onClick={() => onNavigate('profile')}
          style={{
            position: 'absolute',
            top: '50%',
            left: '85%',
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            opacity: currentPage === 'profile' ? 1 : 0.8,
          }}
        />
      </div>
    </div>
  );
};

export default NavigationBar;