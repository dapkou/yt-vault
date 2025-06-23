'use client'

import { useEffect, useState } from 'react'
import { getSavedVideos, clearVideos } from '@/lib/storage'

export default function HomePage() {
  const [videos, setVideos] = useState<any[]>([])

  useEffect(() => {
    setVideos(getSavedVideos())
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">收藏清單</h1>
        <button
          onClick={() => {
            clearVideos()
            setVideos([])
          }}
          className="text-sm text-red-500 hover:underline"
        >
          清空收藏
        </button>
      </div>

      {videos.length === 0 ? (
        <p className="text-gray-500">尚無收藏影片，請前往 /add 加入</p>
      ) : (
        <div className="grid gap-6">
          {videos.map((v, i) => (
            <div key={i} className="flex items-start gap-4 border p-4 rounded bg-white">
              <img src={v.thumbnails?.default?.url || v.thumbnails?.high?.url} className="w-32 h-20 object-cover rounded" />
              <div>
                <h2 className="font-semibold">{v.title}</h2>
                <p className="text-sm text-gray-500">{v.channelTitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}