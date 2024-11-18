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
