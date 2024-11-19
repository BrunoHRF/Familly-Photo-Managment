import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
  userId: number;
}

interface AddPhotoProps {
  selectedUserId: number | null;
  selectedAlbum: { id: number; title: string } | null;
}

const createPhoto = async (newPhoto: FormData): Promise<Photo> => {
  const response = await fetch("http://localhost:3001/api/photos", {
    method: "POST",
    body: newPhoto,
  });
  if (!response.ok) {
    throw new Error("Failed to create photo");
  }
  return response.json();
};

const fetchAlbums = async (userId: number): Promise<Album[]> => {
  const response = await fetch(
    `http://localhost:3001/api/users/${userId}/albums`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch albums");
  }
  return response.json();
};

export default function AddPhoto({
  selectedUserId,
  selectedAlbum,
}: AddPhotoProps) {
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoDescription, setNewPhotoDescription] = useState("");
  const [newPhotoAlbum, setNewPhotoAlbum] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const {
    data: albums,
    isLoading: isLoadingAlbums,
    error: albumsError,
  } = useQuery<Album[], Error>(
    ["albums", selectedUserId],
    () => fetchAlbums(selectedUserId!),
    { enabled: !!selectedUserId }
  );

  useEffect(() => {
    if (selectedAlbum) {
      setNewPhotoAlbum(selectedAlbum.id.toString());
    }
  }, [selectedAlbum]);

  const createPhotoMutation = useMutation(createPhoto, {
    onSuccess: (newPhoto) => {
      queryClient.setQueryData<Photo[]>(
        ["photos", newPhoto.albumId],
        (oldPhotos) => [...(oldPhotos ?? []), newPhoto]
      );
      setNewPhotoTitle("");
      setNewPhotoDescription("");
      setNewPhotoAlbum("");
      setNewPhotoFile(null);
    },
    onError: (error: Error) => {
      console.error("Failed to add photo:", error);
    },
  });

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoAlbum || !newPhotoFile) return;

    const formData = new FormData();
    formData.append("title", newPhotoTitle);
    formData.append("description", newPhotoDescription);
    formData.append("albumId", newPhotoAlbum);
    formData.append("photo", newPhotoFile);

    createPhotoMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhotoFile(e.target.files[0]);
    }
  };

  if (!selectedUserId) return <div>Please select a user first.</div>;
  if (isLoadingAlbums) return <div>Loading albums...</div>;
  if (albumsError)
    return <div>Error fetching albums: {albumsError.message}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Add New Photo</h2>
      <form onSubmit={handleAddPhoto} className="space-y-4">
        <input
          type="text"
          placeholder="Photo title"
          value={newPhotoTitle}
          onChange={(e) => setNewPhotoTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Photo description"
          value={newPhotoDescription}
          onChange={(e) => setNewPhotoDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={newPhotoAlbum}
          onChange={(e) => setNewPhotoAlbum(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select album</option>
          {albums?.map((album) => (
            <option key={album.id} value={album.id.toString()}>
              {album.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Photo
        </button>
      </form>
    </div>
  );
}
