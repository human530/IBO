// Core domain types for the Biology Olympiad prep simulator.

/** The seven IBO theory domains (生物奧林匹亞理論領域). */
export type DomainId =
  | 'cell'
  | 'plant'
  | 'animal'
  | 'ethology'
  | 'genetics'
  | 'ecology'
  | 'systematics';

/** Competition stage. 初賽 = preliminary, 複賽 = semifinal. */
export type Round = 'preliminary' | 'semifinal';

export type QuestionType = 'single' | 'multiple' | 'truefalse';

export interface Option {
  id: string; // 'A' | 'B' | ...
  text: string;
}

export interface Question {
  id: string;
  /** Exam year (西元). 0 = author-generated / variant. */
  year: number;
  round: Round;
  domain: DomainId;
  subtopic: string;
  /** 1 (easy) – 5 (hard). */
  difficulty: number;
  type: QuestionType;
  stem: string;
  options: Option[];
  /** Correct option id(s). */
  answer: string[];
  /** 詳解 */
  explanation: string;
  /** Concept tags used for trend + weakness analysis. */
  concepts: string[];
  source?: string;
  /** True when produced by the question generator. */
  generated?: boolean;
}

/** A single answered question within a session. */
export interface AttemptRecord {
  questionId: string;
  domain: DomainId;
  round: Round;
  difficulty: number;
  selected: string[];
  /** True only when the response is fully correct (set-exact). */
  correct: boolean;
  /** Official IBO partial score for this question, 0–1. */
  score?: number;
  /** Seconds spent on the question. */
  timeSpent: number;
  timestamp: number;
  /** Data-URL of the handwritten answer sheet, when handwriting mode is used. */
  answerImage?: string;
}

export type SessionMode = 'mock' | 'practice' | 'adaptive';

/** How the candidate enters answers. */
export type InputMode = 'select' | 'handwriting';

export interface ExamSession {
  id: string;
  mode: SessionMode;
  round: Round;
  /** Domains included in this session. */
  domains: DomainId[];
  questionIds: string[];
  attempts: AttemptRecord[];
  startedAt: number;
  completedAt?: number;
  /** Total seconds allowed; 0 = untimed. */
  durationSec: number;
}

export interface DomainMeta {
  id: DomainId;
  name: string; // 中文名稱
  enName: string;
  /** IBO official theory weighting (0–1). */
  weight: number;
  color: string;
  description: string;
}
