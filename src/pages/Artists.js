import React, { useEffect, useState } from 'react';
import { fetchArtists, createArtist, deleteArtist, updateArtist, fetchGenres } from '../api';


function Artists({ isAuthenticated }) {
 const [artists, setArtists] = useState([]);
 const [genres, setGenres] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [name, setName] = useState('');
 const [bio, setBio] = useState('');
 const [country, setCountry] = useState('');
 const [genreId, setGenreId] = useState('');
 const [adding, setAdding] = useState(false);
 const [editingArtist, setEditingArtist] = useState(null);
 const [showForm, setShowForm] = useState(false);


 const loadData = async () => {
   setLoading(true);
   try {
     const [artistsData, genresData] = await Promise.all([
       fetchArtists(),
       fetchGenres()
     ]);
     setArtists(artistsData);
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
     await createArtist({
       name,
       bio,
       country,
       genre_id: parseInt(genreId)
     });
     setSuccess('Artist added successfully!');
     resetForm();
     loadData();
   } catch (err) {
     setError('Failed to add artist');
   } finally {
     setAdding(false);
   }
 };


 const handleUpdate = async (e) => {
   e.preventDefault();
   setError('');
   try {
     await updateArtist(editingArtist.id, {
       name,
       bio,
       country,
       genre_id: parseInt(genreId)
     });
     setSuccess('Artist updated successfully!');
     resetForm();
     loadData();
   } catch (err) {
     setError('Failed to update artist');
   }
 };


 const resetForm = () => {
   setName('');
   setBio('');
   setCountry('');
   setGenreId('');
   setEditingArtist(null);
   setShowForm(false);
 };


 const startEdit = (artist) => {
   setEditingArtist(artist);
   setName(artist.name);
   setBio(artist.bio || '');
   setCountry(artist.country || '');
   setGenreId(artist.genre_id?.toString() || '');
   setShowForm(true);
 };


 const handleDelete = async (id) => {
   if (window.confirm('Delete this artist?')) {
     setError('');
     try {
       await deleteArtist(id);
       setSuccess('Artist deleted successfully!');
       loadData();
     } catch (err) {
       setError('Failed to delete artist');
     }
   }
 };


 if (!isAuthenticated) {
   return <div style={{ textAlign: 'center', padding: '60px' }}>🔒 Please login to view artists</div>;
 }


 const getGenreName = (id) => {
   const genre = genres.find(g => g.id === id);
   return genre ? genre.name : 'Unknown Genre';
 };


 return (
   <div>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
       <h2 style={{ margin: 0 }}>🎤 Artists Directory</h2>
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
           cursor: 'pointer'
         }}
       >
         {showForm ? 'Cancel' : '+ Add Artist'}
       </button>
     </div>


     {showForm && (
       <form onSubmit={editingArtist ? handleUpdate : handleAdd} style={{
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
           <h3 style={{ marginTop: 0 }}>{editingArtist ? 'Edit Artist' : 'New Artist'}</h3>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Artist Name</label>
           <input
             placeholder="e.g., The Beatles"
             value={name}
             onChange={e => setName(e.target.value)}
             required
             style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
           />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Genre</label>
           <select
             value={genreId}
             onChange={e => setGenreId(e.target.value)}
             required
             style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white' }}
           >
             <option value="">Select a genre</option>
             {genres.map(genre => (
               <option key={genre.id} value={genre.id}>{genre.name}</option>
             ))}
           </select>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Country</label>
           <input
             placeholder="e.g., United Kingdom"
             value={country}
             onChange={e => setCountry(e.target.value)}
             style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
           />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
           <label style={{ fontSize: '14px', fontWeight: '500' }}>Biography</label>
           <textarea
             placeholder="A brief bio of the artist..."
             value={bio}
             onChange={e => setBio(e.target.value)}
             style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
           />
         </div>
         <div style={{ gridColumn: 'span 2' }}>
           <button
             type="submit"
             disabled={adding}
             style={{
               width: '100%',
               padding: '12px',
               backgroundColor: editingArtist ? '#ffc107' : '#007bff',
               color: editingArtist ? '#000' : 'white',
               border: 'none',
               borderRadius: '6px',
               cursor: 'pointer',
               fontWeight: 'bold',
               fontSize: '16px'
             }}
           >
             {adding ? 'Processing...' : (editingArtist ? 'Update Artist' : 'Save Artist')}
           </button>
         </div>
       </form>
     )}


     {error && <div style={{color:'red', marginBottom: '20px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px'}}>{error}</div>}
     {success && <div style={{color:'green', marginBottom: '20px', padding: '10px', backgroundColor: '#efe', borderRadius: '4px'}}>{success}</div>}
    
     {loading ? (
       <div style={{ textAlign: 'center', padding: '40px' }}>Loading artists...</div>
     ) : (
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
         {artists.map(artist => (
           <div key={artist.id} style={{
             border: '1px solid #e0e0e0',
             borderRadius: '12px',
             padding: '24px',
             backgroundColor: 'white',
             boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
             display: 'flex',
             flexDirection: 'column',
             gap: '12px'
           }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div style={{ fontSize: '48px' }}>👨‍🎤</div>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <button
                   onClick={() => startEdit(artist)}
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
                   onClick={() => handleDelete(artist.id)}
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
               <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{artist.name}</h3>
               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                 <span style={{
                   fontSize: '12px',
                   padding: '2px 8px',
                   backgroundColor: '#e3f2fd',
                   borderRadius: '12px',
                   color: '#007bff',
                   fontWeight: '500'
                 }}>
                   {getGenreName(artist.genre_id)}
                 </span>
                 {artist.country && (
                   <span style={{
                     fontSize: '12px',
                     padding: '2px 8px',
                     backgroundColor: '#f1f3f5',
                     borderRadius: '12px',
                     color: '#495057'
                   }}>
                     📍 {artist.country}
                   </span>
                 )}
               </div>
             </div>
             <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
               {artist.bio || 'No biography available.'}
             </p>
           </div>
         ))}
       </div>
     )}
   </div>
 );
}


export default Artists;

