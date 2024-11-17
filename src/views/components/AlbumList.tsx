import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'

interface Album {
  id: number
  title: string
  userId: number
}

interface User {
  id: number
  name: string
}

const fetchAlbums = async (userId: number): Promise<Album[]> => {
  const response = await fetch(`http://localhost:3001/api/users/${userId}/albums`)
  if (!response.ok) {
    throw new Error('Failed to fetch albums')
  }
  return response.json()
}

const createAlbum = async (newAlbum: Partial<Album>): Promise<Album> => {
  const response = await fetch('http://localhost:3001/api/albums', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAlbum),
  })
  if (!response.ok) {
    throw new Error('Failed to create album')
  }
  return response.json()
}

export default function AlbumList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newAlbumTitle, setNewAlbumTitle] = useState('')
  const queryClient = useQueryClient()

  const { data: albums, isLoading, error } = useQuery<Album[], Error>(
    ['albums', selectedUser?.id],
    () => fetchAlbums(selectedUser?.id ?? 0),
    { enabled: !!selectedUser }
  )

  const createAlbumMutation = useMutation(createAlbum, {
    onSuccess: (newAlbum) => {
      queryClient.setQueryData<Album[]>(['albums', selectedUser?.id], (oldAlbums) => [
        ...(oldAlbums ?? []),
        newAlbum,
      ])
      setNewAlbumTitle('')
    },
    onError: (error: Error) => {
      console.error('Failed to create album:', error)
    },
  })

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !newAlbumTitle.trim()) return
    createAlbumMutation.mutate({ title: newAlbumTitle, userId: selectedUser.id })
  }

  if (!selectedUser) return <p>Please select a user first.</p>
  if (isLoading) return <div>Loading albums...</div>
  if (error) return <div>Error fetching albums: {error.message}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Albums for {selectedUser.name}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {albums?.map(album => (
          <div key={album.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-bold">{album.title}</h3>
          </div>
        ))}
      </div>
      <form onSubmit={handleCreateAlbum} className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="New album title"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create New Album</button>
      </form>
    </div>
  )
}