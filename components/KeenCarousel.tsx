'use client'
import { useState, useEffect, useRef } from 'react'
import { useKeenSlider, KeenSliderInstance } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

type Video = {
  videoId: string
  title: string
  channelTitle: string
  description: string
  thumbnails: {
    high: {
      url: string
    }
  }
}

export default function KeenCarousel({
  videos,
  analysisMap,
  analyzingId,
  onAnalyze,
}: {
  videos: Video[]
  analysisMap: Record<string, any>
  analyzingId: string | null
  onAnalyze: (video: Video) => Promise<void>
}) {
  const [ref, sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 10 },
  })
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const [autoplay] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const instance = sliderRef.current
    if (!instance) return

    const start = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (instance.track?.details) instance.next()
        }, 3000)
      }
    }

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    instance.on('created', () => {
      setIsReady(true)
      start()
    })

    const node = sliderContainerRef.current
    node?.addEventListener('mouseenter', stop)
    node?.addEventListener('mouseleave', start)

    return () => {
      stop()
      node?.removeEventListener('mouseenter', stop)
      node?.removeEventListener('mouseleave', start)
    }
  }, [sliderRef])

  const handleNext = () => {
    const instance = sliderRef.current
    const details = instance?.track?.details
    if (instance && details) {
      instance.moveToIdx(details.rel + 1)
    }
  }

  const handlePrev = () => {
    const instance = sliderRef.current
    const details = instance?.track?.details
    if (instance && details) {
      instance.moveToIdx(details.rel - 1)
    }
  }
  return (
    <div ref={sliderContainerRef} className="relative">
        <button
          onClick={handlePrev}
          className="absolute left-[-20] top-1/2 -translate-y-1/2 z-30
                    w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
                    border border-white/40 backdrop-blur-md
                    text-white text-xl sm:text-2xl rounded-full
                    hover:border-cyan-400 hover:text-cyan-400
                    transition duration-200"
          aria-label="上一張"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-[-20] top-1/2 -translate-y-1/2 z-30
                    w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
                    border border-white/40 backdrop-blur-md
                    text-white text-xl sm:text-2xl rounded-full
                    hover:border-fuchsia-400 hover:text-fuchsia-400
                    transition duration-200"
          aria-label="下一張"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      <div ref={ref} className="keen-slider">
        {videos.map((video, idx) => (
          <div key={idx} className="keen-slider__slide min-w-full px-4">
            <div className="relative border-4 border-lime-500 bg-gradient-to-br from-black via-zinc-900 to-black text-white rounded-2xl shadow-2xl p-6 transition-transform hover:scale-[1.03] hover:rotate-[-0.5deg] hover:shadow-neon">
              <img
                src={video.thumbnails?.high?.url}
                alt={video.title}
                className="w-full rounded-xl mb-4 border-2 border-white/20"
              />
              <h2 className="text-xl font-bold text-lime-400 mb-1">{video.title}</h2>
              <p className="text-sm text-lime-300 mb-2">頻道：{video.channelTitle}</p>
              <p className="text-sm text-white/80 line-clamp-2">{video.description}</p>

              {/* 分析結果 or 分析按鈕 */}
              {analysisMap[video.videoId] ? (
                <div className="mt-4 bg-white/5 p-4 rounded-lg border border-white/10 text-sm space-y-1">
                  <p><span className="text-cyan-400 font-bold">摘要：</span>{analysisMap[video.videoId].summary}</p>
                  <p><span className="text-emerald-400 font-bold">分類：</span>{analysisMap[video.videoId].category}</p>
                  <p><span className="text-yellow-400 font-bold">關鍵字：</span>
                    {Array.isArray(analysisMap[video.videoId]?.keywords) ? analysisMap[video.videoId].keywords.join(', ') : '無'}
                  </p>
                </div>
              ) : (
                <button
                  className="w-full mt-4 py-3 rounded-full bg-gradient-to-br from-lime-500 via-yellow-400 to-lime-400 text-black text-lg font-extrabold tracking-wide shadow-lg hover:scale-105 hover:brightness-110 transition-transform"
                  onClick={async () => {
                    console.log('分析按鈕被點擊', video.videoId)
                    await onAnalyze(video)
                  }}
                  disabled={analyzingId === video.videoId}
                >
                  {analyzingId === video.videoId ? '分析中…' : 'Gemini 分析'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}