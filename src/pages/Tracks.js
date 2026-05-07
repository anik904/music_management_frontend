import React, { useEffect, useState } from 'react';
import { fetchTracks, createTrack, deleteTrack, updateTrack, fetchArtists, fetchAlbums, fetchGenres } from '../api';


function Tracks({ isAuthenticated }) {
 const [tracks, setTracks] = useState([]);
 const [artists, setArtists] = useState([]);
 const [albums, setAlbums] = useState([]);
 const [genres, setGenres] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
 const [durationSeconds, setDurationSeconds] = useState(180);
 const [artistId, setArtistId] = useState('');
 const [albumId, setAlbumId] = useState('');
 const [genreId, setGenreId] = useState('');
  const [adding, setAdding] = useState(false);
 const [editingTrack, setEditingTrack] = useState(null);
 const [showForm, setShowForm] = useState(false);


 const loadData = async () => {
   setLoading(true);
   try {
     const [tracksData, artistsData, albumsData, genresData] = await Promise.all([
       fetchTracks(),
       fetchArtists(),
       fetchAlbums(),
       fetchGenres()
     ]);
     setTracks(tracksData);
     setArtists(artistsData);
     setAlbums(albumsData);
     setGenres(genresData);
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
     await createTrack({
       title,
       duration_seconds: parseInt(durationSeconds),
       artist_id: parseInt(artistId),
       album_id: parseInt(albumId),
       genre_id: parseInt(genreId)
     });
     setSuccess('Track added successfully!');
     resetForm();
     loadData();
   } catch (err) {
     setError('Failed to add track');
   } finally {
     setAdding(false);
   }
 };


 const handleUpdate = async (e) => {
   e.preventDefault();
   setError('');
   try {
     await updateTrack(editingTrack.id, {
       title,
       duration_seconds: parseInt(durationSeconds),
       artist_id: parseInt(artistId),
       album_id: parseInt(albumId),
       genre_id: parseInt(genreId)
     });
     setSuccess('Track updated successfully!');
     resetForm();
     loadData();
   } catch (err) {
     setError('Failed to update track');
   }
 };


 const resetForm = () => {
   setTitle('');
   setDurationSeconds(180);
   setArtistId('');
   setAlbumId('');
   setGenreId('');
   setEditingTrack(null);
   setShowForm(false);
 };


 const startEdit = (track) => {
   setEditingTrack(track);
   setTitle(track.title);
   setDurationSeconds(track.duration_seconds || 180);
   setArtistId(track.artist_id?.toString() || '');
   setAlbumId(track.album_id?.toString() || '');
   setGenreId(track.genre_id?.toString() || '');
   setShowForm(true);
 };


 const handleDelete = async (id) => {
   if (window.confirm('Delete this track?')) {
     setError('');
     try {
       await deleteTrack(id);
       setSuccess('Track deleted successfully!');
       loadData();
     } catch (err) {
       setError('Failed to delete track');
     }
   }
 };


 if (!isAuthenticated) {
   return <div style={{ textAlign: 'center', padding: '60px' }}>🔒 Please login to view tracks</div>;
 }


 const getArtistName = (id) => artists.find(a => a.id === id)?.name || 'Unknown';
 const getAlbumTitle = (id) => albums.find(a => a.id === id)?.title || 'No Album';
 const getGenreName = (id) => genres.find(g => g.id === id)?.name || 'Unknown';
 const formatDuration = (seconds) => {
   const mins = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${mins}:${secs.toString().padStart(2, '0')}`;
 };


 return (
   <div>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
       <h2 style={{ margin: 0 }}>🎧 Track Library</h2>
       <button
         onClick={() => {
           if (showForm) resetForm();
           else setShowForm(true);
         }}
         style={{
           padding: '10px 20px',
           backgroundColor: showForm ? '#6c757d' : '#28a745',
           color: 'white',
           border: 'none',
           borderRadius: '6px',
           cursor: 'pointer'
         }}
       >
         {showForm ? 'Cancel' : '+ Add Track'}
       </button>
     </div>


     {showForm && (
       <form onSubmit={editingTrack ? handleUpdate : handleAdd} style={{
         marginBottom: '30px',
         padding: '24px',
         backgroundColor: '#f8f9fa',
         borderRadius: '12px',
         border: '1px solid #e0e0e0',
         display: 'grid',
         gap: '16px',
         gridTemplateColumns: '1fr 1fr 1fr'
       }}>
         <div style={{ gridColumn: 'span 3' }}>
           <h3 style={{ marginTop: 0 }}>{editingTrack ? 'Edit Track' : 'New Track'}</h3>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Track Title</label>
           <input
             placeholder="e.g., Let It Be"
             value={title}
             onChange={e => setTitle(e.target.value)}
             required
             style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
           />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Duration (seconds)</label>
           <input
             type="number"
             placeholder="180"
             value={durationSeconds}
             onChange={e => setDurationSeconds(e.target.value)}
             required
             style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
           />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Artist</label>
           <select
             value={artistId}
             onChange={e => setArtistId(e.target.value)}
             required
             style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }}
           >
             <option value="">Select Artist</option>
             {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
           </select>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Album</label>
           <select
             value={albumId}
             onChange={e => setAlbumId(e.target.value)}
             required
             style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }}
           >
             <option value="">Select Album</option>
             {albums.filter(a => !artistId || a.artist_id === parseInt(artistId)).map(a => (
               <option key={a.id} value={a.id}>{a.title}</option>
             ))}
           </select>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Genre</label>
           <select
             value={genreId}
             onChange={e => setGenreId(e.target.value)}
             required
             style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }}
           >
             <option value="">Select Genre</option>
             {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
           </select>
         </div>
         <div style={{ gridColumn: 'span 3', marginTop: '8px' }}>
           <button
             type="submit"
             disabled={adding}
             style={{
               width: '100%',
               padding: '12px',
               backgroundColor: editingTrack ? '#ffc107' : '#007bff',
               color: editingTrack ? '#000' : 'white',
               border: 'none',
               borderRadius: '6px',
               cursor: 'pointer',
               fontWeight: 'bold'
             }}
           >
             {adding ? 'Processing...' : (editingTrack ? 'Update Track' : 'Save Track')}
           </button>
         </div>
       </form>
     )}


     {error && <div style={{color:'red', marginBottom: '20px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px'}}>{error}</div>}
     {success && <div style={{color:'green', marginBottom: '20px', padding: '10px', backgroundColor: '#efe', borderRadius: '4px'}}>{success}</div>}
    
     {loading ? (
       <div style={{ textAlign: 'center', padding: '40px' }}>Loading tracks...</div>
     ) : (
       <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead style={{ backgroundColor: '#f8f9fa' }}>
             <tr>
               <th style={{ padding: '16px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Title</th>
               <th style={{ padding: '16px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Artist</th>
               <th style={{ padding: '16px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Album</th>
               <th style={{ padding: '16px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Genre</th>
               <th style={{ padding: '16px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Duration</th>
               <th style={{ padding: '16px', textAlign: 'right', color: '#666', fontSize: '14px' }}>Actions</th>
             </tr>
           </thead>
           <tbody>
             {tracks.map((track) => (
               <tr key={track.id} style={{ borderTop: '1px solid #eee' }}>
                 <td style={{ padding: '16px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <span style={{ fontSize: '18px' }}>🎵</span>
                     <span style={{ fontWeight: '500' }}>{track.title}</span>
                   </div>
                 </td>
                 <td style={{ padding: '16px', color: '#444' }}>{getArtistName(track.artist_id)}</td>
                 <td style={{ padding: '16px', color: '#666' }}>{getAlbumTitle(track.album_id)}</td>
                 <td style={{ padding: '16px' }}>
                   <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: '#e3f2fd', color: '#007bff', borderRadius: '12px' }}>
                     {getGenreName(track.genre_id)}
                   </span>
                 </td>
                 <td style={{ padding: '16px', color: '#888', fontSize: '14px' }}>{formatDuration(track.duration_seconds)}</td>
                 <td style={{ padding: '16px', textAlign: 'right' }}>
                   <button
                     onClick={() => startEdit(track)}
                     style={{
                       padding: '4px 12px',
                       backgroundColor: 'transparent',
                       color: '#007bff',
                       border: '1px solid #007bff',
                       borderRadius: '4px',
                       cursor: 'pointer',
                       fontSize: '12px',
                       marginRight: '8px'
                     }}
                   >
                     Edit
                   </button>
                   <button
                     onClick={() => handleDelete(track.id)}
                     style={{
                       padding: '4px 12px',
                       backgroundColor: 'transparent',
                       color: '#dc3545',
                       border: '1px solid #dc3545',
                       borderRadius: '4px',
                       cursor: 'pointer',
                       fontSize: '12px'
                     }}
                   >
                     Delete
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )}
   </div>
 );
}


export default Tracks;

