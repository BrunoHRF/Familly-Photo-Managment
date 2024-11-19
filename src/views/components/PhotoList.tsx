import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
}

interface Album {
  id: number;
  title: string;
}

interface PhotoListProps {
  selectedAlbum: Album;
}

const fetchPhotos = async (albumId: number): Promise<Photo[]> => {
  const response = await fetch(
    `http://localhost:3001/api/albums/${albumId}/photos`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }
  return response.json();
};

const deletePhoto = async (photoId: number): Promise<void> => {
  const response = await fetch(`http://localhost:3001/api/photos/${photoId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete photo");
  }
};

const updatePhoto = async (photo: Photo): Promise<Photo> => {
  const response = await fetch(`http://localhost:3001/api/photos/${photo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photo),
  });
  if (!response.ok) {
    throw new Error("Failed to update photo");
  }
  return response.json();
};

export default function PhotoList({ selectedAlbum }: PhotoListProps) {
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const queryClient = useQueryClient();
  const {
    data: photos,
    isLoading,
    error,
  } = useQuery<Photo[], Error>(
    ["photos", selectedAlbum.id],
    () => fetchPhotos(selectedAlbum.id),
    { enabled: !!selectedAlbum }
  );

  const deleteMutation = useMutation(deletePhoto, {
    onSuccess: () => {
      queryClient.invalidateQueries(["photos", selectedAlbum.id]);
    },
  });

  const updateMutation = useMutation(updatePhoto, {
    onSuccess: () => {
      queryClient.invalidateQueries(["photos", selectedAlbum.id]);
      setEditingPhoto(null);
    },
  });

  if (isLoading) return <div>Loading photos...</div>;
  if (error) return <div>Error fetching photos: {error.message}</div>;

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
  };

  const handleDelete = (photoId: number) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      deleteMutation.mutate(photoId);
    }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingPhoto) {
      updateMutation.mutate(editingPhoto);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Photos in {selectedAlbum.title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {photos?.map((photo) => (
          <div key={photo.id} className="border p-4 rounded-lg shadow-sm">
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="w-full h-40 object-cover mb-2 rounded-md"
            />
            {editingPhoto && editingPhoto.id === photo.id ? (
              <form onSubmit={handleUpdate} className="space-y-2">
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, title: e.target.value })
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
                  onClick={() => setEditingPhoto(null)}
                  className="px-2 py-1 bg-gray-500 text-white rounded ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p className="font-semibold">{photo.title}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
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
    </div>
  );
}
