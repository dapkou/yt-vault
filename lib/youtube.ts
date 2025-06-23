// lib/youtube.ts
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY! // 用 NEXT_PUBLIC 開頭的，才能在 client 被讀到

// 處理 YouTube 影片／播放清單
// 取得單獨影片
export const extractVideoId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

// 取得播放清單
export const extractPlaylistId = (url: string): string | null => {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

// 抓單支影片資料
// export const fetchYouTubeVideoData = async (videoId: string) => {
//   const res = await fetch(
//     `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
//   )
//   const data = await res.json()
//   return data.items?.[0]?.snippet ?? null
// }
export const fetchYouTubeVideoData = async (videoId: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
  )
  const data = await res.json()
  const item = data.items?.[0]
  if (!item) return null

  const snippet = item.snippet
  return {
    videoId: item.id,
    title: snippet.title,
    description: snippet.description,
    channelTitle: snippet.channelTitle,
    thumbnails: snippet.thumbnails
  }
}
// 抓播放清單中所有影片（最多 20）
// export const fetchPlaylistVideos = async (playlistId: string) => {
//   const res = await fetch(
//     `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`
//   )
//   const data = await res.json()
//   return data.items.map((item: any) => item.snippet)
// }
export const fetchPlaylistVideos = async (playlistId: string) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`
  )
  const data = await res.json()

  return data.items.map((item: any) => {
    const snippet = item.snippet
    return {
      videoId: snippet.resourceId.videoId,
      title: snippet.title,
      description: snippet.description,
      channelTitle: snippet.channelTitle,
      thumbnails: snippet.thumbnails
    }
  })
}