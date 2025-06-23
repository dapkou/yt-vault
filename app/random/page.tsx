'use client'

import { useState } from 'react'
import KeenCarousel from '@/components/KeenCarousel'
import { extractPlaylistId, fetchPlaylistVideos } from '@/lib/youtube'

export default function RandomPage() {
  const [url, setUrl] = useState('')
  const [videos, setVideos] = useState<any[]>([])
  const [randomVideo, setRandomVideo] = useState<any | null>(null)

  const handleLoadPlaylist = async () => {
    const playlistId = extractPlaylistId(url)
    if (!playlistId) {
      alert('請輸入有效的 YouTube 播放清單網址')
      return
    }

    const fetched = await fetchPlaylistVideos(playlistId)
    setVideos(fetched)
    setRandomVideo(null)
  }

  const handleReroll = () => {
    if (videos.length > 0) {
      const random = videos[Math.floor(Math.random() * videos.length)]
      setRandomVideo(random)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📺 播放清單預覽 + 隨機抽取</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="請貼上 YouTube 播放清單網址"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleLoadPlaylist}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          載入播放清單
        </button>
      </div>

      {videos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">🎞 播放清單輪播</h2>
          <KeenCarousel videos={videos} />
          <button
            onClick={handleReroll}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            🎲 抽一支來看
          </button>
        </div>
      )}

      {randomVideo && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">✨ 隨機影片</h2>
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${randomVideo.videoId}`}
              title={randomVideo.title}
              allowFullScreen
            />
          </div>
          <p className="text-center text-sm">{randomVideo.title}</p>
        </div>
      )}
    </div>
  )
}