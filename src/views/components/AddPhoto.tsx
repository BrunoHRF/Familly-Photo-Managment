import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

interface Photo {
  id: number
  title: string
  url: string
  thumbnailUrl: string
  albumId: number
}

interface Album {
  id: number
  title: string
}

const createPhoto = async (newPhoto: Partial<Photo>): Promise<Photo> => {
  const response = await fetch('http://localhost:3001/api/photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPhoto),
  })
  if (!response.ok) {
    throw new Error('Failed to create photo')
  }
  return response.json()
}

export default function AddPhoto() {
  const [newPhotoTitle, setNewPhotoTitle] = useState('')
  const [newPhotoDescription, setNewPhotoDescription] = useState('')
  const [newPhotoAlbum, setNewPhotoAlbum] = useState('')
  const queryClient = useQueryClient()

  const createPhotoMutation = useMutation(createPhoto, {
    onSuccess: (newPhoto) => {
      queryClient.setQueryData<Photo[]>(['photos', newPhoto.albumId], (oldPhotos) => [
        ...(oldPhotos ?? []),
        newPhoto,
      ])
      setNewPhotoTitle('')
      setNewPhotoDescription('')
      setNewPhotoAlbum('')
    },
    onError: (error: Error) => {
      console.error('Failed to add photo:', error)
    },
  })

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPhotoAlbum) return
    createPhotoMutation.mutate({
      title: newPhotoTitle,
      albumId: parseInt(newPhotoAlbum),
      url: '/placeholder.svg?height=200&width=200',
      thumbnailUrl: '/placeholder.svg?height=100&width=100'
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Add New Photo</h2>
      <form onSubmit={handleAddPhoto} className="space-y-4">
        <input
          type="text"
          placeholder="Photo title"
          value={newPhotoTitle}
          onChange={(e) => setNewPhotoTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Photo description"
          value={newPhotoDescription}
          onChange={(e) => setNewPhotoDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={newPhotoAlbum}
          onChange={(e) => setNewPhotoAlbum(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select album</option>
          {/* You would need to fetch albums here or pass them as props */}
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Photo</button>
      </form>
    </div>
  )
}