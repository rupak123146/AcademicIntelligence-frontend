import React from 'react';

const NotFound = () => {
  return (
    <div className="not-found-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#1f2937' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: '#6b7280' }}>Page Not Found</p>
      <p style={{ color: '#9ca3af', marginTop: '1rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <a href="/" style={{
        marginTop: '2rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '0.5rem'
      }}>
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
