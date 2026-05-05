import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  const cards = [
    { title: 'Albums', icon: '💿', path: '/albums', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Artists', icon: '👨‍🎤', path: '/artists', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { title: 'Genres', icon: '🎸', path: '/genres', color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { title: 'Tracks', icon: '🎵', path: '/tracks', color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ];

  return (
    <div style={{
      padding: '40px 20px',
      textAlign: 'center',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          marginBottom: '10px',
          background: 'linear-gradient(to right, #1a1a2e, #00d4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Welcome to the Music Manager!
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#666' }}>
          Hello, <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{user?.username || 'User'}</span>! Ready to manage your music?
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        width: '100%',
        maxWidth: '1100px'
      }}>
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px 20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '20px',
                boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#1a1a2e', margin: '0 0 10px 0' }}>{card.title}</h3>
              <p style={{ color: '#888', margin: 0 }}>Manage your {card.title.toLowerCase()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
