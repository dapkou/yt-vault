import { NextRequest } from 'next/server';
import { fetchGeminiSummary } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  if (!title || !description) {
    return new Response(JSON.stringify({ error: 'Missing title or description' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 從 URL 抓出 [id]
  const url = new URL(req.url);
  const match = url.pathname.match(/\/api\/videos\/([^/]+)\/summary/);
  const id = match?.[1];

  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid video ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 確保 fetchGeminiSummary 回傳的是 { summary, category, keywords }
  const result = await fetchGeminiSummary(title, description);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}