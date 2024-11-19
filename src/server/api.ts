import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const BASE_URL = "https://jsonplaceholder.typicode.com";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface Album {
  id: number;
  title: string;
  userId: number;
}

interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
}

function isUserArray(data: unknown): data is User[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "number" &&
        "name" in item &&
        typeof item.name === "string" &&
        "email" in item &&
        typeof item.email === "string" &&
        "username" in item &&
        typeof item.username === "string"
    )
  );
}

function isAlbumArray(data: unknown): data is Album[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "number" &&
        "title" in item &&
        typeof item.title === "string" &&
        "userId" in item &&
        typeof item.userId === "number"
    )
  );
}

function isPhotoArray(data: unknown): data is Photo[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "number" &&
        "title" in item &&
        typeof item.title === "string" &&
        "url" in item &&
        typeof item.url === "string" &&
        "thumbnailUrl" in item &&
        typeof item.thumbnailUrl === "string" &&
        "albumId" in item &&
        typeof item.albumId === "number"
    )
  );
}

app.get("/api/users", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const data: unknown = await response.json();

    if (isUserArray(data)) {
      res.json(data);
    } else {
      throw new Error("Invalid data format for users");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/users/:userId/albums", async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await fetch(`${BASE_URL}/users/${userId}/albums`);
    const data: unknown = await response.json();

    if (isAlbumArray(data)) {
      res.json(data);
    } else {
      throw new Error("Invalid data format for albums");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

app.get("/api/albums/:albumId/photos", async (req, res) => {
  try {
    const { albumId } = req.params;
    const response = await fetch(`${BASE_URL}/albums/${albumId}/photos`);
    const data: unknown = await response.json();

    if (isPhotoArray(data)) {
      res.json(data);
    } else {
      throw new Error("Invalid data format for photos");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

app.put("/api/albums/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;
    const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
      method: "PUT",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });
    const data: unknown = await response.json();

    if (typeof data === "object" && data !== null && "id" in data) {
      res.json(data);
    } else {
      throw new Error("Invalid data format for updated album");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update album" });
  }
});

app.put("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });
    const data: unknown = await response.json();

    if (typeof data === "object" && data !== null && "id" in data) {
      res.json(data);
    } else {
      throw new Error("Invalid data format for updated user");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.post("/api/photos", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/photos`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });
    const data: unknown = await response.json();

    if (isPhotoArray([data])) {
      res.status(201).json(data[0]);
    } else {
      throw new Error("Invalid data format for created photo");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create photo" });
  }
});

app.post("/api/albums", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/albums`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });
    const data: unknown = await response.json();

    if (isAlbumArray([data])) {
      res.status(201).json(data[0]);
    } else {
      throw new Error("Invalid data format for created album");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create album" });
  }
});

app.delete("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      res.status(204).send();
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.delete("/api/albums/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;
    const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      res.status(204).send();
    } else {
      throw new Error("Failed to delete album");
    }
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ error: "Failed to delete album" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
