import Anthropic from '@anthropic-ai/sdk';

/**
 * Vercel Serverless Function: /api/ai
 *
 * 闖進IBO大作戰的 AI 後端。金鑰只存在伺服器端環境變數 ANTHROPIC_API_KEY,
 * 絕不外洩到前端。支援兩種模式:
 *   - mode: "generate" → 依領域/難度/階段生成一題生物奧林匹亞風格選擇題(JSON)
 *   - mode: "explain"  → 針對某題目提供五歲也懂 + 深入的 AI 解析
 */

const MODEL = 'claude-opus-4-8';

const DOMAIN_NAMES: Record<string, string> = {
  cell: '細胞生物學',
  plant: '植物解剖與生理',
  animal: '動物解剖與生理',
  ethology: '動物行為',
  genetics: '遺傳與演化',
  ecology: '生態學',
  systematics: '生物系統分類',
};

interface GenBody {
  mode: 'generate';
  domain?: string;
  difficulty?: number;
  round?: 'preliminary' | 'semifinal';
  multiple?: boolean;
}
interface ExplainBody {
  mode: 'explain';
  question: string;
  options?: { id: string; text: string }[];
  answer?: string[];
  userAsk?: string;
}
type Body = GenBody | ExplainBody;

const GENERATE_SCHEMA = {
  type: 'object' as const,
  properties: {
    domain: { type: 'string' as const },
    subtopic: { type: 'string' as const },
    difficulty: { type: 'integer' as const },
    type: { type: 'string' as const, enum: ['single', 'multiple'] },
    stem: { type: 'string' as const },
    options: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: { id: { type: 'string' as const }, text: { type: 'string' as const } },
        required: ['id', 'text'],
        additionalProperties: false,
      },
    },
    answer: { type: 'array' as const, items: { type: 'string' as const } },
    explanation: { type: 'string' as const },
    simple: { type: 'string' as const },
    concepts: { type: 'array' as const, items: { type: 'string' as const } },
  },
  required: ['domain', 'subtopic', 'difficulty', 'type', 'stem', 'options', 'answer', 'explanation', 'simple', 'concepts'],
  additionalProperties: false,
};

export default async function handler(req: { method?: string; body?: unknown }, res: VercelRes) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'AI 尚未設定 (缺少 ANTHROPIC_API_KEY)' });
    return;
  }

  let body: Body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as Body);
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  const client = new Anthropic({ apiKey });

  try {
    if (body.mode === 'generate') {
      const domainName = DOMAIN_NAMES[body.domain ?? ''] ?? '任一領域';
      const round = body.round === 'semifinal' ? '複賽(較難、整合)' : '初賽(基礎)';
      const diff = body.difficulty ?? 3;
      const wantMultiple = body.multiple ? '請出複選題(多個正確選項)' : '請出單選題(只有一個正確選項)';

      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 2000,
        thinking: { type: 'adaptive' },
        system:
          '你是生物奧林匹亞命題老師。請以繁體中文出一題符合台灣高中生物奧林匹亞風格的選擇題,內容須科學正確、有鑑別度。' +
          'options 用 A/B/C/D 四個選項;answer 放正確選項代號;explanation 為完整詳解;simple 為「五歲也懂」的白話比喻;concepts 為 2-4 個考點標籤。',
        messages: [
          {
            role: 'user',
            content: `請出一題:領域=${domainName}、難度=${diff}/5、階段=${round}。${wantMultiple}。`,
          },
        ],
        output_config: { format: { type: 'json_schema', schema: GENERATE_SCHEMA } },
      } as Anthropic.MessageCreateParamsNonStreaming);

      const textBlock = msg.content.find((b) => b.type === 'text');
      const raw = textBlock && 'text' in textBlock ? textBlock.text : '{}';
      res.status(200).json({ ok: true, question: JSON.parse(raw) });
      return;
    }

    if (body.mode === 'explain') {
      const opts = (body.options ?? []).map((o) => `(${o.id}) ${o.text}`).join('  ');
      const ask = body.userAsk?.trim()
        ? `學生的問題:「${body.userAsk}」。`
        : '請解釋為什麼正確答案是對的、其他選項為什麼錯,並補充相關背景知識。';
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 1500,
        thinking: { type: 'adaptive' },
        system:
          '你是生物奧林匹亞家教,用繁體中文回答。先用一句「五歲也懂」的白話比喻,再給條理清楚的深入解析(機制、為何如此、易錯點)。語氣鼓勵、精準。',
        messages: [
          {
            role: 'user',
            content: `題目:${body.question}\n選項:${opts}\n正確答案:${(body.answer ?? []).join('、')}\n\n${ask}`,
          },
        ],
      } as Anthropic.MessageCreateParamsNonStreaming);

      const textBlock = msg.content.find((b) => b.type === 'text');
      const answer = textBlock && 'text' in textBlock ? textBlock.text : '';
      res.status(200).json({ ok: true, answer });
      return;
    }

    res.status(400).json({ error: 'Unknown mode' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI 請求失敗';
    res.status(502).json({ error: message });
  }
}

interface VercelRes {
  status: (code: number) => { json: (body: unknown) => void };
}
