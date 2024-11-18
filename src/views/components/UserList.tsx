import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("http://localhost:3001/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export default function UserList() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users: {error.message}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <Link to={`/albums/${user.id}`}>
            <div key={user.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
