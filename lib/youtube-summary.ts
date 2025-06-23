// lib/youtube-summary.ts
export async function summarizeYouTubeVideo(videoId: string) {
    const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) throw new Error('缺少 YouTube API 金鑰');

    //   進一步摘要分析影片的資訊
    // 1. 拿影片標題與描述
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
        throw new Error('找不到這支影片');
    }

    const snippet = data.items[0].snippet;
    const { title, description } = snippet;

    // 2. 呼叫分析 API
    const summaryRes = await fetch(`/api/videos/${videoId}/summary`, {
        method: 'POST',
        body: JSON.stringify({ title, description }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (!summaryRes.ok) {
        const errText = await summaryRes.text();
        throw new Error(`分析失敗：${summaryRes.status} ${errText}`);
    }

    const result = await summaryRes.json();

    // 3. 整理回傳資料
    return {
        videoId,
        title,
        description,
        ...result // summary, category, keywords
    };
}