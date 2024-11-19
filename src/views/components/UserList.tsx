import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface UserListProps {
  onUserSelect: (userId: number) => void;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("http://localhost:3001/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

const deleteUser = async (userId: number): Promise<void> => {
  const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

const updateUser = async (user: User): Promise<User> => {
  const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};

export default function UserList({ onUserSelect }: UserListProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[], Error>("users", fetchUsers);

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  const updateMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setEditingUser(null);
    },
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users: {error.message}</div>;

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(userId);
    }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate(editingUser);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <div key={user.id} className="border p-4 rounded-lg shadow-sm">
            {editingUser && editingUser.id === user.id ? (
              <form onSubmit={handleUpdate} className="space-y-2">
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full p-1 border rounded"
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full p-1 border rounded"
                />
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
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
                  onClick={() => setEditingUser(null)}
                  className="px-2 py-1 bg-gray-500 text-white rounded ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => onUserSelect(user.id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    View Albums
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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
