import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import Genres from './pages/Genres';
import Tracks from './pages/Tracks';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';


function Navigation() {
 const location = useLocation();
 const isActive = (path) => location.pathname === path;
  const linkStyle = (path) => ({
   textDecoration: 'none',
   color: isActive(path) ? '#00d4ff' : '#eee',
   fontWeight: isActive(path) ? 'bold' : 'normal',
   padding: '4px 8px',
   borderRadius: '4px',
   backgroundColor: isActive(path) ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
   transition: 'all 0.3s ease'
 });


 return (
   <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
     <Link to="/" style={{ textDecoration: 'none', color: '#00d4ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
       <h3 style={{ margin: 0 }}>Music Manager</h3>
     </Link>
     <Link to="/albums" style={linkStyle('/albums')}>Albums</Link>
     <Link to="/artists" style={linkStyle('/artists')}>Artists</Link>
     <Link to="/genres" style={linkStyle('/genres')}>Genres</Link>
     <Link to="/tracks" style={linkStyle('/tracks')}>Tracks</Link>
   </div>
 );
}


function App() {
 const [isAuthenticated, setIsAuthenticated] = useState(() => {
   try {
     const token = localStorage.getItem('access_token');
     const savedUser = localStorage.getItem('user');
     return !!(token && savedUser);
   } catch (e) {
     return false;
   }
 });


 const [user, setUser] = useState(() => {
   try {
     const saved = localStorage.getItem('user');
     return saved ? JSON.parse(saved) : null;
   } catch (e) {
     return null;
   }
 });


 const [showLogout, setShowLogout] = useState(false);


 const handleLogin = (userData, token) => {
   setIsAuthenticated(true);
   setUser(userData);
   localStorage.setItem('access_token', token);
   localStorage.setItem('user', JSON.stringify(userData));
 };


 const handleLogout = () => {
   setIsAuthenticated(false);
   setUser(null);
   localStorage.removeItem('access_token');
   localStorage.removeItem('user');
   setShowLogout(false);
 };


 return (
   <Router>
     {/* Only show Navbar if authenticated */}
     {isAuthenticated && (
       <nav style={{
         padding: '0 24px',
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         backgroundColor: '#1a1a2e',
         color: 'white',
         height: '64px',
         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
         position: 'sticky',
         top: 0,
         zIndex: 1000
       }}>
         <Navigation />
        
         <div style={{ position: 'relative' }}>
           <div
             onClick={() => setShowLogout(!showLogout)}
             style={{
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '12px'
             }}
           >
             <div style={{
               width: 40,
               height: 40,
               borderRadius: '50%',
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: 'white',
               fontWeight: 'bold',
               fontSize: '18px'
             }}>
               {user?.username ? user.username[0].toUpperCase() : 'U'}
             </div>
             <span>{user?.username || 'User'}</span>
           </div>
          
           {showLogout && (
             <div style={{
               position: 'absolute',
               top: '100%',
               right: 0,
               marginTop: '8px',
               backgroundColor: 'white',
               borderRadius: '8px',
               boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
               zIndex: 999,
               minWidth: '150px',
               overflow: 'hidden'
             }}>
               <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                 <strong style={{ color: '#333' }}>{user?.username}</strong>
                 <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
               </div>
               <button
                 onClick={handleLogout}
                 style={{
                   width: '100%',
                   padding: '10px 16px',
                   border: 'none',
                   backgroundColor: 'white',
                   cursor: 'pointer',
                   textAlign: 'left',
                   color: '#dc3545'
                 }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
               >
                 🚪 Logout
               </button>
             </div>
           )}
         </div>
       </nav>
     )}
    
     <div style={{
       padding: isAuthenticated ? '24px' : '0',
       maxWidth: '1200px',
       margin: '0 auto',
       minHeight: isAuthenticated ? 'calc(100vh - 64px)' : '100vh',
       display: 'flex',
       flexDirection: 'column'
     }}>
       <Routes>
         {/* Public Routes */}
         <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
         <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />


         {/* Protected Routes */}
         {isAuthenticated ? (
           <>
             <Route path="/" element={<Home user={user} />} />
             <Route path="/albums" element={<Albums isAuthenticated={isAuthenticated} />} />
             <Route path="/artists" element={<Artists isAuthenticated={isAuthenticated} />} />
             <Route path="/genres" element={<Genres isAuthenticated={isAuthenticated} />} />
             <Route path="/tracks" element={<Tracks isAuthenticated={isAuthenticated} />} />
             {/* Fallback for authenticated users */}
             <Route path="*" element={<Navigate to="/" />} />
           </>
         ) : (
           // Fallback for non-authenticated users
           <Route path="*" element={<Navigate to="/login" />} />
         )}
       </Routes>
     </div>
   </Router>
 );
}


export default App;

