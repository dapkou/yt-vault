// app/api/videos/[id]/summary/route.ts
import { NextRequest } from 'next/server';
import { fetchGeminiSummary } from '@/lib/gemini';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { title, description } = await req.json();

  if (!title || !description) {
    return new Response(JSON.stringify({ error: 'Missing title or description' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGeminiSummary(title, description);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}