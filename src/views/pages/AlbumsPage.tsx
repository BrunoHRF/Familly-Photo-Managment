import { useParams } from "react-router-dom";
import { Album } from "../components/AlbumList";
import { useQuery } from "@tanstack/react-query";

export default function AlbumsPage() {
  const { userId } = useParams();

  const fetchAlbums = async (userId: number): Promise<Album[]> => {
    const response = await fetch(
      `http://localhost:3001/api/users/${userId}/albums`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch albums");
    }
    return response.json();
  };

  const { data: albums } = useQuery({
    queryKey: ["albums", userId],
    queryFn: () => fetchAlbums(Number(userId)),
    enabled: Boolean(userId),
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Albums for {userId}</h2>
      <form className="mt-2 space-y-2 r">
        <input
          type="text"
          placeholder="New album title"
          value={"as"}
          //onChange={(e) => setNewAlbumTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create New Album
        </button>
      </form>
      {albums?.map((album) => (
        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div key={album.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-bold">{album.title}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
