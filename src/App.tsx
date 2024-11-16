import { useState, useEffect } from 'react';
import './App.css';

interface Album {
  id: number;
  name: string;
  ownerId: number;
}

export default function App() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    // In a real app, this would be an API call
    const mockAlbums: Album[] = [
      { id: 1, name: 'Family Vacation 2023', ownerId: 1 },
      { id: 2, name: 'Birthday Party', ownerId: 2 },
    ];
    setAlbums(mockAlbums);
  };

  const createAlbum = () => {
    if (newAlbumName.trim()) {
      const newAlbum: Album = {
        id: albums.length + 1,
        name: newAlbumName.trim(),
        ownerId: 1, // Assuming current user's ID is 1
      };
      setAlbums([...albums, newAlbum]);
      setNewAlbumName('');
    }
  };

  const updateAlbum = () => {
    if (editingAlbum && editingAlbum.name.trim()) {
      setAlbums(albums.map(album => 
        album.id === editingAlbum.id ? editingAlbum : album
      ));
      setEditingAlbum(null);
    }
  };

  const deleteAlbum = (id: number) => {
    setAlbums(albums.filter(album => album.id !== id));
  };

  return (
    <div className="container">
      <h1 className="title">Family Photo Management</h1>
      <div className="create-album">
        <h2>Create New Album</h2>
        <div className="create-album-form">
          <input
            type="text"
            placeholder="New album name"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            className="create-album-input"
          />
          <button onClick={createAlbum} className="button button-primary">
            Create
          </button>
        </div>
      </div>

      <div className="album-grid">
        {albums.map(album => (
          <div key={album.id} className="album-card">
            <h3 className="album-title">{album.name}</h3>
            <div className="album-actions">
              <button onClick={() => setEditingAlbum(album)} className="button button-success">
                Edit
              </button>
              <button onClick={() => deleteAlbum(album.id)} className="button button-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingAlbum && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Edit Album</h2>
            <input
              type="text"
              value={editingAlbum.name}
              onChange={(e) => setEditingAlbum({...editingAlbum, name: e.target.value})}
              className="modal-input"
            />
            <div className="modal-actions">
              <button onClick={() => setEditingAlbum(null)} className="button button-secondary">
                Cancel
              </button>
              <button onClick={updateAlbum} className="button button-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}