import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

interface Album {
  id: number;
  title: string;
  userId: number;
}

interface AlbumListProps {
  userId: number;
  onAlbumSelect: (albumId: number, albumTitle: string) => void;
}

export const fetchAlbums = async (userId: number): Promise<Album[]> => {
  const response = await fetch(
    `http://localhost:3001/api/users/${userId}/albums`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch albums");
  }
  return response.json();
};

export const updateAlbum = async (album: Album): Promise<Album> => {
  const response = await fetch(`http://localhost:3001/api/albums/${album.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(album),
  });
  if (!response.ok) {
    throw new Error("Failed to update album");
  }
  return response.json();
};

export const deleteAlbum = async (albumId: number): Promise<void> => {
  const response = await fetch(`http://localhost:3001/api/albums/${albumId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete album");
  }
};

export default function AlbumList({ userId, onAlbumSelect }: AlbumListProps) {
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const queryClient = useQueryClient();
  const {
    data: albums,
    isLoading,
    error,
  } = useQuery<Album[], Error>(["albums", userId], () => fetchAlbums(userId), {
    enabled: !!userId,
  });

  const updateMutation = useMutation(updateAlbum, {
    onSuccess: (updatedAlbum) => {
      queryClient.setQueryData<Album[]>(["albums", userId], (oldData) => {
        return oldData
          ? oldData.map((album) =>
              album.id === updatedAlbum.id ? updatedAlbum : album
            )
          : [];
      });
      setEditingAlbum(null);
    },
    onError: (error: Error) => {
      console.error("Failed to update album:", error);
    },
  });

  const deleteMutation = useMutation(deleteAlbum, {
    onSuccess: (_, deletedAlbumId) => {
      queryClient.setQueryData<Album[]>(["albums", userId], (oldData) => {
        return oldData
          ? oldData.filter((album) => album.id !== deletedAlbumId)
          : [];
      });
    },
    onError: (error: Error) => {
      console.error("Failed to delete album:", error);
    },
  });

  if (isLoading) return <div>Loading albums...</div>;
  if (error) return <div>Error fetching albums: {error.message}</div>;

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingAlbum) {
      updateMutation.mutate(editingAlbum);
    }
  };

  const handleDelete = (albumId: number) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      deleteMutation.mutate(albumId);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Albums for User {userId}</h2>
      {albums && albums.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div key={album.id} className="border p-4 rounded-lg shadow-sm">
              {editingAlbum && editingAlbum.id === album.id ? (
                <form onSubmit={handleUpdate} className="space-y-2">
                  <input
                    type="text"
                    value={editingAlbum.title}
                    onChange={(e) =>
                      setEditingAlbum({
                        ...editingAlbum,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-1 border rounded"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingAlbum(null)}
                    className="px-2 py-1 bg-gray-500 text-white rounded ml-2"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="font-bold">{album.title}</h3>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => onAlbumSelect(album.id, album.title)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Photos
                    </button>
                    <button
                      onClick={() => handleEdit(album)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(album.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No albums found for this user.</p>
      )}
    </div>
  );
}
