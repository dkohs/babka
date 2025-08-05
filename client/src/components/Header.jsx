import React from 'react';

const Header = ({ title, leftIcon, rightIcon, onLeftClick, onRightClick }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ccc',
    zIndex: 1000,
  }}>
    {leftIcon ? (
      <img src={leftIcon} alt="left" onClick={onLeftClick} style={{ cursor: 'pointer' }} />
    ) : (
      <div style={{ width: '32px' }}></div>
    )}
    <h3 style={{ fontFamily: 'Inter', fontWeight: 600 }}>{title}</h3>
    {rightIcon ? (
      <div onClick={onRightClick} style={{
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        padding: '8px',
        borderRadius: '8px',
        transition: 'background-color 0.2s'
      }}>
        <img src={rightIcon} alt="right" />
      </div>
    ) : (
      <div style={{ width: '32px' }}></div>
    )}
  </div>
);

export default Header;