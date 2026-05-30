/**
 * 選拔營特訓資料：考試方向、高強度複習重點（難題簡單化 + 必考），以及
 * 各主題的教材對照整合（Vander's、免疫學、陳佳芬三部曲、基礎遺傳學、
 * 細胞生物學、分子生物學、植物生理學、Campbell 等）。
 */

export const CAMP_INFO = {
  title: '選拔營特訓',
  direction:
    '選拔營是國手產生前的最後關卡，理論更深、題目更整合，並大量加入「實作（實驗操作與數據判讀）」。準備方向：在 Campbell 全貌之上，針對人體生理、免疫、分子技術、遺傳分析、植物生理等用專書深入，並把「難題拆解成簡單原理」+「反覆精練歷屆與實作」。',
  tips: [
    '理論題更長、跨章節整合，常以實驗情境包裝。',
    '實作占比高：熟悉技術原理、會看圖表、會做統計。',
    '把每個難概念都練到能用一句話講給別人聽。',
  ],
};

export interface CampFocus {
  area: string;
  /** 常見難點 */
  hard: string;
  /** 🧒 難題簡單化（一句話） */
  simple: string;
  /** 必考核心 */
  must: string;
  /** 對應教材 */
  book: string;
}

export const CAMP_FOCUS: CampFocus[] = [
  {
    area: '神經整合與突觸可塑性',
    hard: '時間／空間加成、EPSP/IPSP 整合、長期增強(LTP)',
    simple: '很多小訊號加起來才夠力觸發；常用的突觸會「越練越強」(LTP)。',
    must: '動作電位離子流、突觸整合、神經傳遞物質受體',
    book: "Vander's 人體生理學",
  },
  {
    area: '心血管調控',
    hard: '壓力反射、心輸出與血壓的多變數回饋',
    simple: '身體有自動血壓計(壓力受器)，太高就讓心跳慢、血管放鬆。',
    must: '心動週期、Frank–Starling、壓力反射',
    book: "Vander's 人體生理學",
  },
  {
    area: '呼吸與酸鹼平衡',
    hard: 'O₂/CO₂ 解離、波耳/何爾登效應、酸鹼緩衝與代償',
    simple: 'CO₂ 多→血變酸→呼吸加快把酸吐掉；腎臟再慢慢調 HCO₃⁻ 當靠山。',
    must: '氣體運輸、碳酸-碳酸氫根緩衝、呼吸/代謝性酸鹼',
    book: "Vander's 人體生理學",
  },
  {
    area: '腎臟與體液恆定',
    hard: '逆流倍增、清除率、ADH/醛固酮/RAAS',
    simple: '腎臟用「逆流」把鹽濃縮在深處，需要時就把水留住(ADH)。',
    must: '過濾/再吸收/分泌、清除率計算、逆流倍增',
    book: "Vander's 人體生理學",
  },
  {
    area: '內分泌軸與回饋',
    hard: '下視丘–腦垂腺–標的腺多層負回饋',
    simple: '三層上司互相通報，產品太多就叫上面停工(負回饋)。',
    must: 'HPA/HPT 軸、回饋調控、激素作用機制',
    book: "Vander's 人體生理學",
  },
  {
    area: '免疫：辨識與調控',
    hard: 'MHC 限制、T/B 活化、補體三途徑、超敏分型、免疫耐受',
    simple: '免疫像門禁＋特種部隊；MHC 是識別證，認錯了會過敏或打自己人。',
    must: '先天/後天、MHC I/II、抗體類型、補體、超敏反應',
    book: '免疫學（Janeway / Kuby）',
  },
  {
    area: '分子生物技術',
    hard: 'PCR/qPCR、選殖、定序(Sanger/NGS)、CRISPR、blotting',
    simple: 'PCR 是 DNA 影印機；CRISPR 是基因剪刀；定序是把字母讀出來。',
    must: 'PCR 原理、限制酶選殖、電泳、定序、CRISPR',
    book: '分子生物學 / Alberts',
  },
  {
    area: '基因調控與表觀遺傳',
    hard: '操縱組、增強子、染色質重塑、甲基化、組蛋白修飾、ncRNA',
    simple: '基因有開關；貼標籤(甲基化)或把 DNA 捲緊就能把它關起來。',
    must: 'lac/trp 操縱組、真核調控、表觀遺傳、miRNA',
    book: '分子生物學 / 細胞生物學',
  },
  {
    area: '遺傳分析與連鎖作圖',
    hard: '三點測交、卡方檢定、族群遺傳、連鎖不平衡',
    simple: '用重組比例畫基因地圖；用卡方檢查結果是真的還是巧合。',
    must: '連鎖/重組、三點測交、卡方、哈溫',
    book: '基礎遺傳學',
  },
  {
    area: '植物生理：訊息與運輸',
    hard: '光合電子傳遞、氣孔訊息(ABA)、生長素極性運輸、光敏素',
    simple: '葉子用光發電；缺水時 ABA 叫氣孔關門；生長素只往一個方向流。',
    must: '光反應/卡爾文、蒸散/氣孔、激素訊息、光形態發生',
    book: '植物生理學（Taiz & Zeiger）',
  },
  {
    area: '細胞代謝與訊息整合',
    hard: '代謝調控(別構/共價)、訊息級聯交錯',
    simple: '細胞像工廠；訊號像指令，可以放大也可以互相喊停。',
    must: '酶調控、呼吸/光合、訊息傳遞、細胞週期',
    book: '細胞生物學 / Campbell',
  },
  {
    area: '生物統計與實驗設計',
    hard: '假說檢定、t 檢定/卡方、對照與變因、誤差',
    simple: '先設好對照組；再用統計看差異是真的還是運氣。',
    must: '平均/標準差、t/卡方檢定、實驗設計、信賴區間',
    book: '統計與實作補充',
  },
];

export interface BookCompare {
  topic: string;
  best: string;
  note: string;
}

export const BOOK_COMPARE: BookCompare[] = [
  { topic: '全面地基', best: 'Campbell Biology', note: '最完整的入門全貌，先把所有章節讀熟。' },
  { topic: '人體生理學', best: "Vander's Human Physiology", note: '機制導向，最適合理解調控與回饋。' },
  { topic: '免疫學', best: 'Janeway / Kuby Immunology', note: '免疫辨識與機制講得最完整。' },
  { topic: '細胞生物學', best: '細胞生物學 / Alberts', note: '胞器、訊息、細胞週期深入。' },
  { topic: '分子生物學', best: '分子生物學 / Alberts', note: '技術原理與基因調控。' },
  { topic: '遺傳學', best: '基礎遺傳學', note: '題型與遺傳分析(連鎖、卡方)扎實。' },
  { topic: '植物生理學', best: '植物生理學（Taiz & Zeiger）', note: '光合、運輸、激素訊息系統化。' },
  { topic: '中文綜整／難題拆解', best: '陳佳芬 生物學三部曲', note: '中文奧林匹亞綜整，把難題拆成易懂原理。' },
];
