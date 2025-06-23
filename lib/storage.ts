const STORAGE_KEY = 'yt-vault-collection'

export const getSavedVideos = (): any[] => {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export const saveVideo = (video: any) => {
  const current = getSavedVideos()
  const exists = current.find((v) => v.title === video.title) // 防止重複
  if (!exists) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([video, ...current]))
  }
}

export const clearVideos = () => {
  localStorage.removeItem(STORAGE_KEY)
}