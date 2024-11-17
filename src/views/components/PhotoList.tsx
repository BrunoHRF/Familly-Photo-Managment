import { useState } from 'react'
import { useQuery } from 'react-query'

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

const fetchPhotos = async (albumId: number): Promise<Photo[]> => {
  const response = await fetch(`http://localhost:3001/api/albums/${albumId}/photos`)
  if (!response.ok) {
    throw new Error('Failed to fetch photos')
  }
  return response.json()
}

export default function PhotoList() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  const { data: photos, isLoading, error } = useQuery<Photo[], Error>(
    ['photos', selectedAlbum?.id],
    () => fetchPhotos(selectedAlbum?.id ?? 0),
    { enabled: !!selectedAlbum }
  )

  if (!selectedAlbum) return <p>Please select an album first.</p>
  if (isLoading) return <div>Loading photos...</div>
  if (error) return <div>Error fetching photos: {error.message}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Photos in {selectedAlbum.title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {photos?.map(photo => (
          <div key={photo.id} className="border p-4 rounded-lg shadow-sm">
            <img 
              src={photo.thumbnailUrl} 
              alt={photo.title} 
              className="w-full h-40 object-cover mb-2 rounded-md"
            />
            <p className="font-semibold">{photo.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}