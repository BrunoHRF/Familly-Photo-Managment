import { useState } from "react";
import UserList from "../components/UserList";
import AlbumsPage from "./AlbumsPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("users");

  return (
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
            activeTab === "add-photo" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("add-photo")}
        >
          Add Photo
        </button>
      </div>
      {activeTab === "users" && <UserList />}
      {activeTab === "albums" && <AlbumsPage />}
      {activeTab === "photos" && <UserList />}
      {activeTab === "add-photo" && <UserList />}
      <UserList />
    </div>
  );
}
