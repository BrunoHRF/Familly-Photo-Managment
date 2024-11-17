import { useQuery } from 'react-query'

interface User {
  id: number
  name: string
  email: string
  username: string
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('http://localhost:3001/api/users')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export default function UserList() {
  const { data: users, isLoading, error } = useQuery<User[], Error>('users', fetchUsers)

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div>Error fetching users: {error.message}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map(user => (
          <div key={user.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-bold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">@{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  )
}