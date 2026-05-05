import React, { useEffect, useState } from 'react';
import { fetchGenres, createGenre, deleteGenre, updateGenre } from '../api';

function Genres({ isAuthenticated }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);

  const loadGenres = async () => {
    setLoading(true);
    try {
      const data = await fetchGenres();
      setGenres(data);
    } catch (err) {
      setError('Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createGenre({ name, description });
      setName('');
      setDescription('');
      loadGenres();
    } catch (err) {
      setError('Failed to add genre');
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateGenre(editingGenre.id, { name, description });
      setEditingGenre(null);
      setName('');
      setDescription('');
      loadGenres();
    } catch (err) {
      setError('Failed to update genre');
    }
  };

  const startEdit = (genre) => {
    setEditingGenre(genre);
    setName(genre.name);
    setDescription(genre.description || '');
  };

  const cancelEdit = () => {
    setEditingGenre(null);
    setName('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this genre?')) {
      try {
        await deleteGenre(id);
        loadGenres();
      } catch (err) {
        setError('Failed to delete genre');
      }
    }
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>🔒 Please login to view genres</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>🎸 Music Genres</h2>
      
      <form onSubmit={editingGenre ? handleUpdate : handleAdd} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ marginTop: 0 }}>{editingGenre ? 'Edit Genre' : 'Add New Genre'}</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            placeholder="Genre Name (e.g., Rock)" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input 
            placeholder="Description (optional)" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            style={{ flex: 2, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            disabled={adding}
            style={{
              padding: '12px 24px',
              backgroundColor: editingGenre ? '#ffc107' : '#007bff',
              color: editingGenre ? '#000' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {adding ? 'Processing...' : (editingGenre ? 'Update' : '+ Add Genre')}
          </button>
          {editingGenre && (
            <button 
              type="button"
              onClick={cancelEdit}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <div style={{color:'red', marginBottom: '20px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px'}}>{error}</div>}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading genres...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {genres.map(genre => (
            <div key={genre.id} style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🎵</span>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{genre.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => startEdit(genre)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#007bff',
                      fontSize: '14px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(genre.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#dc3545',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                {genre.description || 'No description available.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Genres;