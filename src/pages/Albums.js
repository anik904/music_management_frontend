import React, { useEffect, useState } from 'react';
import { fetchAlbums, createAlbum, deleteAlbum, updateAlbum, fetchArtists } from '../api';


function Albums({ isAuthenticated }) {
 const [albums, setAlbums] = useState([]);
 const [artists, setArtists] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [title, setTitle] = useState('');
 const [artistId, setArtistId] = useState('');
 const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
 const [adding, setAdding] = useState(false);
 const [editingAlbum, setEditingAlbum] = useState(null);
 const [showForm, setShowForm] = useState(false);


 const loadData = async () => {
   setLoading(true);
   setError('');
   try {
     const [albumsData, artistsData] = await Promise.all([
       fetchAlbums(),
       fetchArtists()
     ]);
     setAlbums(albumsData);
     setArtists(artistsData);
   } catch (err) {
     setError('Failed to load data');
   } finally {
     setLoading(false);
   }
 };


 useEffect(() => {
   loadData();
 }, []);


 useEffect(() => {
   if (success) {
     const timer = setTimeout(() => setSuccess(''), 3000);
     return () => clearTimeout(timer);
   }
 }, [success]);


 const handleAdd = async (e) => {
   e.preventDefault();
   setAdding(true);
   setError('');
   try {
     await createAlbum({
       title,
       artist_id: parseInt(artistId),
       release_year: parseInt(releaseYear)
     });
     setSuccess('Album added successfully!');
     resetForm();
     loadData();
   } catch (err) {
     setError('Failed to add album');
   } finally {
     setAdding(false);
   }
 };


 const handleUpdate = async (e) => {
   e.preventDefault();
   setError('');
   try {
     await updateAlbum(editingAlbum.id, {
       title,
       artist_id: parseInt(artistId),
       release_year: parseInt(releaseYear)
     });
     setSuccess('Album updated successfully!');
     resetForm();
     loadData();
   } catch (err) {
     setError('Failed to update album');
   }
 };


 const resetForm = () => {
   setTitle('');
   setArtistId('');
   setReleaseYear(new Date().getFullYear());
   setEditingAlbum(null);
   setShowForm(false);
 };


 const startEdit = (album) => {
   setEditingAlbum(album);
   setTitle(album.title);
   setArtistId(album.artist_id?.toString() || '');
   setReleaseYear(album.release_year || new Date().getFullYear());
   setShowForm(true);
 };


 const handleDelete = async (id) => {
   if (window.confirm('Are you sure you want to delete this album?')) {
     setError('');
     try {
       await deleteAlbum(id);
       setSuccess('Album deleted successfully!');
       loadData();
     } catch (err) {
       setError('Failed to delete album');
     }
   }
 };


 if (!isAuthenticated) {
   return (
     <div style={{ textAlign: 'center', padding: '60px 20px' }}>
       <h2>🔒 Access Denied</h2>
       <p>Please login to view albums</p>
     </div>
   );
 }


 const getArtistName = (id) => {
   const artist = artists.find(a => a.id === id);
   return artist ? artist.name : 'Unknown Artist';
 };


 return (
   <div>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
       <h2 style={{ margin: 0 }}>🎵 Albums Collection</h2>
       <button
         onClick={() => {
           if (showForm) resetForm();
           else setShowForm(true);
         }}
         style={{
           padding: '10px 20px',
           backgroundColor: showForm ? '#6c757d' : '#007bff',
           color: 'white',
           border: 'none',
           borderRadius: '6px',
           cursor: 'pointer',
           fontSize: '14px'
         }}
       >
         {showForm ? 'Cancel' : '+ Add Album'}
       </button>
     </div>


     {showForm && (
       <form onSubmit={editingAlbum ? handleUpdate : handleAdd} style={{
         marginBottom: '30px',
         padding: '24px',
         backgroundColor: '#f8f9fa',
         borderRadius: '12px',
         border: '1px solid #e0e0e0',
         display: 'grid',
         gap: '16px',
         gridTemplateColumns: '1fr 1fr'
       }}>
         <div style={{ gridColumn: 'span 2' }}>
           <h3 style={{ marginTop: 0 }}>{editingAlbum ? 'Edit Album' : 'New Album'}</h3>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Album Title</label>
           <input
             placeholder="e.g., Abbey Road"
             value={title}
             onChange={e => setTitle(e.target.value)}
             required
             style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
           />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Artist</label>
           <select
             value={artistId}
             onChange={e => setArtistId(e.target.value)}
             required
             style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white' }}
           >
             <option value="">Select an artist</option>
             {artists.map(artist => (
               <option key={artist.id} value={artist.id}>{artist.name}</option>
             ))}
           </select>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Release Year</label>
           <input
             type="number"
             placeholder="e.g., 1969"
             value={releaseYear}
             onChange={e => setReleaseYear(e.target.value)}
             required
             style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
           />
         </div>
         <div style={{ gridColumn: 'span 2', marginTop: '8px' }}>
           <button
             type="submit"
             disabled={adding}
             style={{
               width: '100%',
               padding: '12px',
               backgroundColor: editingAlbum ? '#ffc107' : '#007bff',
               color: editingAlbum ? '#000' : 'white',
               border: 'none',
               borderRadius: '6px',
               cursor: 'pointer',
               fontWeight: 'bold'
             }}
           >
             {adding ? 'Processing...' : (editingAlbum ? 'Update Album' : 'Save Album')}
           </button>
         </div>
       </form>
     )}


     {error && <div style={{color:'red', marginBottom: '20px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px'}}>{error}</div>}
     {success && <div style={{color:'green', marginBottom: '20px', padding: '10px', backgroundColor: '#efe', borderRadius: '4px'}}>{success}</div>}
    
     {loading ? (
       <div style={{ textAlign: 'center', padding: '40px' }}>Loading albums...</div>
     ) : (
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
         {albums.map(album => (
           <div key={album.id} style={{
             border: '1px solid #e0e0e0',
             borderRadius: '12px',
             padding: '20px',
             backgroundColor: 'white',
             transition: 'all 0.3s ease',
             display: 'flex',
             flexDirection: 'column',
             gap: '12px'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'translateY(-4px)';
             e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = 'none';
           }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div style={{ fontSize: '40px' }}>💿</div>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <button
                   onClick={() => startEdit(album)}
                   style={{
                     padding: '6px 12px',
                     backgroundColor: '#f8f9fa',
                     border: '1px solid #ddd',
                     borderRadius: '4px',
                     cursor: 'pointer',
                     fontSize: '12px'
                   }}
                 >
                   Edit
                 </button>
                 <button
                   onClick={() => handleDelete(album.id)}
                   style={{
                     padding: '6px 12px',
                     backgroundColor: '#fff',
                     color: '#dc3545',
                     border: '1px solid #dc3545',
                     borderRadius: '4px',
                     cursor: 'pointer',
                     fontSize: '12px'
                   }}
                 >
                   Delete
                 </button>
               </div>
             </div>
             <div>
               <h3 style={{ margin: '0 0 4px 0' }}>{album.title}</h3>
               <p style={{ margin: '0 0 4px 0', color: '#007bff', fontWeight: '500' }}>
                 {getArtistName(album.artist_id)}
               </p>
               <span style={{
                 fontSize: '12px',
                 padding: '2px 8px',
                 backgroundColor: '#f1f3f5',
                 borderRadius: '12px',
                 color: '#495057'
               }}>
                 📅 {album.release_year}
               </span>
             </div>
           </div>
         ))}
       </div>
     )}
   </div>
 );
}


export default Albums;

