import React, { useEffect, useState } from 'react';
import { fetchGenres, createGenre, deleteGenre, updateGenre } from '../api';


function Genres({ isAuthenticated }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [showForm, setShowForm] = useState(false);


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
      await createGenre({ name, description });
      setSuccess('Genre added successfully!');
      resetForm();
      loadGenres();
    } catch (err) {
      setError('Failed to add genre');
    } finally {
      setAdding(false);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateGenre(editingGenre.id, { name, description });
      setSuccess('Genre updated successfully!');
      resetForm();
      loadGenres();
    } catch (err) {
      setError('Failed to update genre');
    }
  };


  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingGenre(null);
    setShowForm(false);
  };


  const startEdit = (genre) => {
    setEditingGenre(genre);
    setName(genre.name);
    setDescription(genre.description || '');
    setShowForm(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm('Delete this genre?')) {
      setError('');
      try {
        await deleteGenre(id);
        setSuccess('Genre deleted successfully!');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>🎸 Music Genres</h2>
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
          {showForm ? 'Cancel' : '+ Add Genre'}
        </button>
      </div>


      {showForm && (
        <form
          onSubmit={editingGenre ? handleUpdate : handleAdd}
          style={{
            marginBottom: '30px',
            padding: '24px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: '1fr 1fr'
          }}
        >
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ marginTop: 0 }}>{editingGenre ? 'Edit Genre' : 'New Genre'}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Genre Name</label>
            <input
              placeholder="e.g., Rock"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Description</label>
            <input
              placeholder="A short description of the genre..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <button
              type="submit"
              disabled={adding}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: editingGenre ? '#ffc107' : '#007bff',
                color: editingGenre ? '#000' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {adding ? 'Processing...' : (editingGenre ? 'Update Genre' : 'Save Genre')}
            </button>
          </div>
        </form>
      )}


      {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '20px', padding: '10px', backgroundColor: '#efe', borderRadius: '4px' }}>{success}</div>}


      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading genres...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {genres.map(genre => (
            <div key={genre.id} style={{
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
                <div style={{ fontSize: '48px' }}>🎵</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => startEdit(genre)}
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
                    onClick={() => handleDelete(genre.id)}
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
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{genre.name}</h3>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
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



