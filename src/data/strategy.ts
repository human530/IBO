import type { DomainId } from '../types';

/**
 * 邁向國手：成功心法與書單。
 * 整理自對國際生物奧林匹亞（IBO/USABO）獎牌得主備考方式，以及學習科學
 * （刻意練習、間隔重複、成長型思維）研究的綜整，轉化為可執行的策略。
 */

export interface SuccessFactor {
  emoji: string;
  title: string;
  /** 🧒 一句話白話 */
  simple: string;
  detail: string;
}

export const SUCCESS_FACTORS: SuccessFactor[] = [
  {
    emoji: '🔁',
    title: '黃金循環：做題 → 分析錯誤 → 回課本 → 再做',
    simple: '寫完不是結束，把錯的搞懂、回課本補洞、再寫一次才會真的會。',
    detail:
      '獎牌得主公認最有效的方法：先做歷屆題，仔細分析每個錯誤的原因，回到課本把觀念補起來，過一陣子再重做同一份，確認自己真的進步。本軟體的「弱點強化」與「成績分析」就是為這個循環設計的。',
  },
  {
    emoji: '🧱',
    title: '先用 Campbell 打地基，再讀進階',
    simple: '先把「生物聖經」Campbell 讀熟，再挑進階書補深度。',
    detail:
      '幾乎所有國家代表隊都以 Campbell Biology 為核心，完整讀過所有章節建立全貌，之後再用 Raven、Alberts、Lehninger 等補足較深的主題。',
  },
  {
    emoji: '⏳',
    title: '及早開始、長期累積',
    simple: '越早開始越好，給自己 2–3 年慢慢累積。',
    detail:
      '多數成功者在高一、高二就起步，先修完 AP/榮譽生物打底，再進入奧林匹亞專門準備，讓知識有時間沉澱。',
  },
  {
    emoji: '🧠',
    title: '間隔重複，對抗遺忘',
    simple: '同一個重點，隔幾天再複習一次，記得最牢。',
    detail:
      '學習科學顯示「間隔複習」比一次塞滿更利於長期記憶。把複習筆記排進每天的小份量複習，效果遠勝考前抱佛腳。',
  },
  {
    emoji: '🌱',
    title: '成長型思維：把錯誤當養分',
    simple: '不是「我不夠聰明」，而是「我還沒學會」。',
    detail:
      '研究指出頂尖表現並非靠天生固定的天賦；相信能力可以成長、把錯題視為線索的人，進步更快也更持久。',
  },
  {
    emoji: '🔬',
    title: '重視實作與資料判讀',
    simple: '不只背知識，還要會用顯微鏡、看圖表、做實驗。',
    detail:
      'IBO 實作占比高。認真做每一個學校實驗、練習判讀數據與圖表、熟悉顯微鏡與標本辨識，往往是拉開差距的關鍵。',
  },
  {
    emoji: '🌍',
    title: '超越課綱、跨科連結',
    simple: '讀比課本更難的東西，連結化學、物理、數學。',
    detail:
      '閱讀原文教材、科學期刊與新研究，並把化學、物理、統計的概念連起來，才能應付 IBO 的跨領域難題。',
  },
  {
    emoji: '🤝',
    title: '同儕與導師',
    simple: '找伴一起練、找老師或學長姊指點。',
    detail:
      '與程度相近的夥伴互相出題、討論，並向有經驗的老師或前輩請教解題策略，能少走很多冤枉路。',
  },
];

export interface BookRef {
  title: string;
  zh: string;
  use: string;
  level: '入門' | '核心' | '進階' | '實作';
}

export const READING_LIST: BookRef[] = [
  {
    title: 'Campbell Biology',
    zh: '坎貝爾生物學（生物聖經）',
    use: '打地基的核心教材，完整讀過所有章節建立全貌。',
    level: '核心',
  },
  {
    title: 'Raven — Biology',
    zh: 'Raven 生物學',
    use: '補 Campbell 較淺之處，部分進階主題講得更深。',
    level: '進階',
  },
  {
    title: 'Molecular Biology of the Cell (Alberts)',
    zh: '細胞分子生物學',
    use: '細胞與分子生物學的進階首選，深入機制。',
    level: '進階',
  },
  {
    title: 'Biology of Plants (Raven/Evert/Eichhorn)',
    zh: '植物生物學',
    use: '植物解剖、生理、運輸與生殖的專書。',
    level: '進階',
  },
  {
    title: 'Lehninger Principles of Biochemistry',
    zh: '雷氏生物化學原理',
    use: '生化深入補充；建議打好底後挑特定章節讀。',
    level: '進階',
  },
  {
    title: 'Brooker — Genetics',
    zh: 'Brooker 遺傳學',
    use: '遺傳與分子遺傳的系統教材。',
    level: '進階',
  },
  {
    title: "Vander's Human Physiology",
    zh: '人體生理學',
    use: '機制導向，理解神經、循環、呼吸、腎臟、內分泌的調控與回饋首選。',
    level: '進階',
  },
  {
    title: 'Janeway / Kuby Immunology',
    zh: '免疫學',
    use: '免疫辨識與機制最完整，補足 Campbell 不足之處。',
    level: '進階',
  },
  {
    title: '植物生理學（Taiz & Zeiger）',
    zh: '植物生理學',
    use: '光合、運輸、激素訊息系統化，植物題加深。',
    level: '進階',
  },
  {
    title: '基礎遺傳學',
    zh: '基礎遺傳學',
    use: '遺傳分析題型(連鎖、三點測交、卡方)扎實。',
    level: '進階',
  },
  {
    title: '陳佳芬 生物學三部曲',
    zh: '中文奧林匹亞綜整',
    use: '中文系統綜整，擅長把難題拆解成易懂原理，適合搭配複習。',
    level: '進階',
  },
  {
    title: 'Practical Skills in Biomolecular Science (Reed)',
    zh: '生物分子科學實作技能',
    use: '為實作測驗打底：技術、計算與數據分析。',
    level: '實作',
  },
  {
    title: '歷屆 IBO / USABO / 台灣初複賽試題',
    zh: '歷屆考古題',
    use: '最重要的練習素材，配合「黃金循環」反覆精練。',
    level: '核心',
  },
];

/** 各領域對應的 Campbell 章節（11 版約略單元），方便對照讀書。 */
export const DOMAIN_BOOKS: Record<DomainId, { campbell: string; also: string }> = {
  cell: { campbell: 'Campbell 第 1–3 單元（化學、細胞、代謝、呼吸與光合、訊息傳遞、細胞週期）', also: 'Alberts 細胞分子生物學' },
  plant: { campbell: 'Campbell 第 6 單元（植物形態、運輸、生殖、反應）', also: 'Biology of Plants（Raven）' },
  animal: { campbell: 'Campbell 第 7 單元（動物形態與生理：神經、循環、免疫、內分泌、排泄）', also: 'Campbell 動物生理章節' },
  ethology: { campbell: 'Campbell 行為生態章（動物行為）', also: 'Alcock — Animal Behavior' },
  genetics: { campbell: 'Campbell 第 3、4 單元（遺傳、分子生物、演化）', also: 'Brooker — Genetics' },
  ecology: { campbell: 'Campbell 第 8 單元（生態學：族群、群落、生態系、保育）', also: 'Begon — Ecology' },
  systematics: { campbell: 'Campbell 第 5 單元（生物多樣性：原核、原生、真菌、植物、動物）', also: 'Raven 生物學分類章' },
};
