// app/analysis/page.tsx
'use client'
import { useState } from "react";
import {
  extractVideoId,
  extractPlaylistId,
  fetchYouTubeVideoData,
  fetchPlaylistVideos,
} from '@/lib/youtube'
import { summarizeYouTubeVideo } from '@/lib/youtube-summary';
import KeenCarousel from '@/components/KeenCarousel';

export default function AddPage() {
  const [url, setUrl] = useState('')
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [analysisMap, setAnalysisMap] = useState<Record<string, any>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const handleAnalyze = async (video: any) => {
  console.log('影片 ID:', video.videoId);
  try {
    setAnalyzingId(video.videoId);
    const raw = await summarizeYouTubeVideo(video.videoId);

    // 保證前端結構正確，即使是空的也要佔位
    const result = {
      summary: raw.summary ?? '',
      category: raw.category ?? '',
      keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
    };

    setAnalysisMap((prev) => ({ ...prev, [video.videoId]: result }));
  } catch (err) {
    console.error(err);
    alert(`分析失敗：${err}`);
  } finally {
    setAnalyzingId(null);
  }
};
  const handleFetch = async () => {
    setLoading(true)
    setVideos([])

    const videoId = extractVideoId(url)
    const playlistId = extractPlaylistId(url)

    if (videoId) {
      const data = await fetchYouTubeVideoData(videoId)
      setVideos(data ? [data] : [])
    } else if (playlistId) {
      const list = await fetchPlaylistVideos(playlistId)
      setVideos(list)
    } else {
      alert('無效的 YouTube 連結')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">貼上 YouTube 影片或播放清單連結</h1>
      <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-lg border-2 border-transparent focus:border-pink-500 focus:ring-2 focus:ring-pink-300 bg-gray-100 text-black placeholder-gray-500 shadow-inner transition duration-200"
          placeholder="貼上 YouTube 影片或播放清單連結"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleFetch}
          className={`min-w-[140px] px-5 py-3 rounded-lg font-semibold text-black shadow-md transition duration-200
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 via-yellow-400 to-lime-400 hover:brightness-110'}`}
          disabled={loading}
        >
          {loading ? '載入中…' : '取得資料'}
        </button>
      </div>
      <p>直接複製 YouTube 播放清單網址 (music playlist)</p>
      <div className="flex items-center gap-2 mb-6 bg-gray-100/80 p-3 rounded-lg text-sm text-gray-700">
        <span className="truncate">
          https://www.youtube.com/playlist?list=PLbpi6ZahtOH7DrxWUmkwvsXnFeCfB5LUp
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              'https://www.youtube.com/playlist?list=PLbpi6ZahtOH7DrxWUmkwvsXnFeCfB5LUp'
            )
          }}
          className="ml-auto px-3 py-1 bg-pink-500 text-white text-xs rounded hover:bg-pink-600 transition"
        >
          複製
        </button>
      </div>
      <div className="my-6 space-y-4">
        <KeenCarousel videos={videos} analysisMap={analysisMap} analyzingId={analyzingId} onAnalyze={handleAnalyze} />
      </div>
    </div>
  )
}