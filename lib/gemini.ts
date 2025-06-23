//gemini.ts
export async function fetchGeminiSummary(title: string, description: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("缺少 GEMINI_API_KEY");

  const prompt = `
    你是資深 YouTube 影片內容分析師，請根據以下資訊產生：

    1. 簡短摘要（100 字以內）
    2. 分類（例如：教學、音樂、生活、科技、娛樂）
    3. 影片關鍵字陣列（最多 5 個）

    以下是影片內容：

    標題：
    ${title}

    描述：
    ${description}

    請輸出以下 JSON 格式（不要解釋）：
    {
      "summary": "摘要內容",
      "category": "影片類型，如音樂、教學、科技等",
      "keywords": ["關鍵字1", "關鍵字2", "關鍵字3"]
    }
  `.trim();

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const json = await res.json();
  console.log("Gemini API 原始回應：", JSON.stringify(json, null, 2));

  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  console.log("Gemini 回傳的文字內容：", rawText);

  // 去除 Markdown 包裹（```json ... ```）
  const cleanedText = rawText.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(cleanedText);
    return {
      summary: parsed.summary ?? "無摘要",
      category: parsed.category ?? "未知分類",
      keywords: parsed.keywords ?? []
    };
  } catch (err) {
    console.error("JSON 解析失敗：", err);
    return {
      summary: rawText || "無回應",
      category: "unknown",
      keywords: []
    };
  }
}