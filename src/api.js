const API_BASE = 'http://localhost:8000';


const getAuthHeaders = () => {
 const token = localStorage.getItem('access_token');
 return token ? { 'Authorization': `Bearer ${token}` } : {};
};


// Tracks API
export async function fetchTracks() {
 const response = await fetch(`${API_BASE}/tracks/`, {
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to fetch tracks');
 return response.json();
}


export async function createTrack(track) {
 const response = await fetch(`${API_BASE}/tracks/`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(track)
 });
 if (!response.ok) throw new Error('Failed to create track');
 return response.json();
}


export async function updateTrack(id, track) {
 const response = await fetch(`${API_BASE}/tracks/${id}`, {
   method: 'PUT',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(track)
 });
 if (!response.ok) throw new Error('Failed to update track');
 return response.status === 204 ? { success: true } : response.json();
}


export async function deleteTrack(id) {
 const response = await fetch(`${API_BASE}/tracks/${id}`, {
   method: 'DELETE',
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to delete track');
 return response.status === 204 ? { success: true } : response.json();
}


// Genres API
export async function fetchGenres() {
 const response = await fetch(`${API_BASE}/genres/`, {
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to fetch genres');
 return response.json();
}


export async function createGenre(genre) {
 const response = await fetch(`${API_BASE}/genres/`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(genre)
 });
 if (!response.ok) throw new Error('Failed to create genre');
 return response.json();
}


export async function updateGenre(id, genre) {
 const response = await fetch(`${API_BASE}/genres/${id}`, {
   method: 'PUT',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(genre)
 });
 if (!response.ok) throw new Error('Failed to update genre');
 return response.status === 204 ? { success: true } : response.json();
}


export async function deleteGenre(id) {
 const response = await fetch(`${API_BASE}/genres/${id}`, {
   method: 'DELETE',
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to delete genre');
 return response.status === 204 ? { success: true } : response.json();
}


// Artists API
export async function fetchArtists() {
 const response = await fetch(`${API_BASE}/artists/`, {
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to fetch artists');
 return response.json();
}


export async function createArtist(artist) {
 const response = await fetch(`${API_BASE}/artists/`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(artist)
 });
 if (!response.ok) throw new Error('Failed to create artist');
 return response.json();
}


export async function updateArtist(id, artist) {
 const response = await fetch(`${API_BASE}/artists/${id}`, {
   method: 'PUT',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(artist)
 });
 if (!response.ok) throw new Error('Failed to update artist');
 return response.status === 204 ? { success: true } : response.json();
}


export async function deleteArtist(id) {
 const response = await fetch(`${API_BASE}/artists/${id}`, {
   method: 'DELETE',
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to delete artist');
 return response.status === 204 ? { success: true } : response.json();
}


// Albums API
export async function fetchAlbums() {
 const response = await fetch(`${API_BASE}/albums/`, {
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to fetch albums');
 return response.json();
}


export async function createAlbum(album) {
 const response = await fetch(`${API_BASE}/albums/`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(album)
 });
 if (!response.ok) throw new Error('Failed to create album');
 return response.json();
}


export async function updateAlbum(id, album) {
 const response = await fetch(`${API_BASE}/albums/${id}`, {
   method: 'PUT',
   headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
   },
   body: JSON.stringify(album)
 });
 if (!response.ok) throw new Error('Failed to update album');
 return response.status === 204 ? { success: true } : response.json();
}


export async function deleteAlbum(id) {
 const response = await fetch(`${API_BASE}/albums/${id}`, {
   method: 'DELETE',
   headers: getAuthHeaders()
 });
 if (!response.ok) throw new Error('Failed to delete album');
 return response.status === 204 ? { success: true } : response.json();
}


// Auth API
export async function loginUser(email, password) {
 const response = await fetch(`${API_BASE}/auth/login`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ email, password })
 });
 if (!response.ok) throw new Error('Login failed');
 return response.json();
}


export async function registerUser(username, email, password) {
 const response = await fetch(`${API_BASE}/auth/register`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ username, email, password })
 });
 if (!response.ok) throw new Error('Registration failed');
 return response.json();
}



