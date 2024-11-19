import { useQuery } from "react-query";

interface Album {
  id: number;
  title: string;
  userId: number;
}

interface AlbumListProps {
  userId: number;
  onAlbumSelect: (albumId: number, albumTitle: string) => void;
}

const fetchAlbums = async (userId: number): Promise<Album[]> => {
  const response = await fetch(
    `http://localhost:3001/api/users/${userId}/albums`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch albums");
  }
  return response.json();
};

export default function AlbumList({ userId, onAlbumSelect }: AlbumListProps) {
  const {
    data: albums,
    isLoading,
    error,
  } = useQuery<Album[], Error>(["albums", userId], () => fetchAlbums(userId), {
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading albums...</div>;
  if (error) return <div>Error fetching albums: {error.message}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Albums for User {userId}</h2>
      {albums && albums.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className="border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
              onClick={() => onAlbumSelect(album.id, album.title)}
            >
              <h3 className="font-bold">{album.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>No albums found for this user.</p>
      )}
    </div>
  );
}
