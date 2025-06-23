// app/page.tsx
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-20 flex flex-col items-center justify-center text-center bg-black text-white gap-10">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-yellow-400 to-lime-400 text-transparent bg-clip-text">
        YouTube 影片 與 Gemini 分析
      </h1>

      <div className="max-w-xl text-gray-300 space-y-6 text-base sm:text-lg leading-relaxed">
        <p>
          本專案提供將 YouTube 影片內容透過 Gemini API 進行 AI 摘要分析，獲取影片的摘要、分類、關鍵字等資訊。
        </p>
        <div className="text-sm sm:text-base text-center leading-relaxed">
          <p className="font-semibold text-white mb-2">技術棧：</p>
          <ul className="space-y-2">
            <li>
              <strong>Gemini API</strong>（AI 影片摘要、分類、關鍵字分析）
            </li>
            <li>
              <strong>YouTube Data API</strong>（取得影片 / 播放清單資料）
            </li>
            <li>
              React + Next.js（App Router）、Tailwind CSS、TypeScript
            </li>
          </ul>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Link
          href="/analysis"
          className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-3 rounded-full font-bold shadow-lg transition hover:scale-105 hover:brightness-110"
        >
          開始分析影片
        </Link>
      </div>
    </main>
  )
}