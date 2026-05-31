import type { DomainId, Question, Round } from '../types';

/**
 * 前端 AI 用戶端:呼叫 /api/ai(Vercel Serverless,金鑰留在伺服器端)。
 * 本機開發若無 API,呼叫會失敗並回傳錯誤訊息,UI 需自行處理。
 */

export interface AIGenerateParams {
  domain?: DomainId;
  difficulty?: number;
  round?: Round;
  multiple?: boolean;
}

/** 請 AI 生成一題,回傳可直接使用的 Question。 */
export async function aiGenerateQuestion(params: AIGenerateParams): Promise<Question> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'generate', ...params }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'AI 生題失敗');
  const q = data.question;
  return {
    id: `ai-${Date.now()}`,
    year: 0,
    round: params.round ?? 'preliminary',
    domain: (q.domain as DomainId) ?? params.domain ?? 'cell',
    subtopic: q.subtopic ?? 'AI 生成',
    difficulty: q.difficulty ?? params.difficulty ?? 3,
    type: q.type === 'multiple' ? 'multiple' : 'single',
    stem: q.stem,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    simple: q.simple,
    concepts: q.concepts ?? [],
    generated: true,
    source: 'AI 生成',
  };
}

/** 請 AI 解析某題(或回答學生追問)。 */
export async function aiExplain(args: {
  question: string;
  options?: { id: string; text: string }[];
  answer?: string[];
  userAsk?: string;
}): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'explain', ...args }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'AI 解析失敗');
  return data.answer as string;
}
