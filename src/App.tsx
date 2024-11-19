import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import UserList from "./views/components/UserList";
import AlbumList from "./views/components/AlbumList";
import PhotoList from "./views/components/PhotoList";
import AddPhoto from "./views/components/AddPhoto";

const queryClient = new QueryClient();

export default function App() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedAlbum(null);
    setActiveTab("albums");
  };

  const handleAlbumSelect = (albumId: number, albumTitle: string) => {
    setSelectedAlbum({ id: albumId, title: albumTitle });
    setActiveTab("photos");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Family Photo Management</h1>
        <div className="mb-4">
          <button
            className={`mr-2 px-4 py-2 ${
              activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`mr-2 px-4 py-2 ${
              activeTab === "albums" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("albums")}
          >
            Albums
          </button>
          <button
            className={`mr-2 px-4 py-2 ${
              activeTab === "photos" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
          <button
            className={`mr-2 px-4 py-2 ${
              activeTab === "add-photo"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("add-photo")}
          >
            Add Photo
          </button>
        </div>

        {activeTab === "users" && <UserList onUserSelect={handleUserSelect} />}
        {activeTab === "albums" && selectedUserId !== null && (
          <AlbumList
            userId={selectedUserId}
            onAlbumSelect={handleAlbumSelect}
          />
        )}
        {activeTab === "photos" && selectedAlbum !== null && (
          <PhotoList selectedAlbum={selectedAlbum} />
        )}
        {activeTab === "add-photo" && <AddPhoto />}
      </div>
    </QueryClientProvider>
  );
}
