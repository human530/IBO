/**
 * 教材書庫：各本生奧常用教材的「原創重點摘要筆記」，依各書標準章節結構組織。
 *
 * ⚠️ 內容為以自己的話撰寫的學習摘要（重點 + 秒懂），並非書本原文，
 * 章節標題沿用教科書通用的主題結構，方便對照閱讀。
 */
export interface ChapterNote {
  ch: string;
  title: string;
  /** 🧒 一句話秒懂 */
  simple: string;
  points: string[];
}
export interface Unit {
  unit: string;
  chapters: ChapterNote[];
}
export interface Textbook {
  id: string;
  title: string;
  zh: string;
  color: string;
  units: Unit[];
}

export const TEXTBOOKS: Textbook[] = [
  {
    id: 'campbell',
    title: 'Campbell Biology',
    zh: '坎貝爾生物學（核心全貌）',
    color: '#6e8a4a',
    units: [
      {
        unit: '單元1 生命的化學',
        chapters: [
          { ch: '2–3', title: '原子、鍵結與水', simple: '生命靠水當舞台；水會牽手(氫鍵)所以有黏性、能調溫。', points: ['共價/離子/氫鍵與凡得瓦力', '水的內聚、比熱、溶劑性質', 'pH 與緩衝'] },
          { ch: '4–5', title: '碳與生物大分子', simple: '碳是樂高底座；醣、脂、蛋白、核酸是四種積木。', points: ['醣類/脂質/蛋白質/核酸結構與功能', '蛋白質四級結構與摺疊', '脫水合成與水解'] },
        ],
      },
      {
        unit: '單元2 細胞',
        chapters: [
          { ch: '6', title: '細胞構造', simple: '細胞像分工工廠，各胞器各司其職。', points: ['原核 vs 真核', '內膜系統、粒線體、葉綠體(內共生)', '細胞骨架'] },
          { ch: '7', title: '細胞膜', simple: '膜是會挑人進出的牆(流體鑲嵌)。', points: ['磷脂雙層、膜蛋白', '被動 vs 主動運輸、滲透', '胞吞/胞吐'] },
          { ch: '8', title: '代謝與酶', simple: '酶是媒人，降低門檻讓反應快發生。', points: ['自由能 ΔG、ATP', '酶專一性、抑制(競爭/非競爭)', '別構與回饋調控'] },
          { ch: '9', title: '細胞呼吸', simple: '把糖慢慢拆，最後一關用氧氣發最多電。', points: ['糖解→丙酮酸氧化→檸檬酸→氧化磷酸化', '化學滲透與 ATP 合成酶', '發酵'] },
          { ch: '10', title: '光合作用', simple: '白天用光發電，再把空氣的碳組裝成糖。', points: ['光反應(類囊體, 放O₂)', '卡爾文循環(固碳)', 'C3/C4/CAM 與光呼吸'] },
          { ch: '11', title: '細胞訊息傳遞', simple: '門鈴被按，屋裡小幫手傳話。', points: ['受體類型、GPCR', '第二傳訊者 cAMP/IP₃/Ca²⁺', '訊號級聯與放大'] },
          { ch: '12', title: '細胞週期', simple: '分裂前要過檢查哨，油門(cyclin)顧速度。', points: ['有絲分裂期相', 'cyclin/CDK 檢查點', 'p53 與癌化'] },
        ],
      },
      {
        unit: '單元3 遺傳',
        chapters: [
          { ch: '13', title: '減數分裂', simple: '生殖細胞染色體減半，洗牌產生多樣性。', points: ['同源染色體配對、互換', '獨立分配', '減一/減二'] },
          { ch: '14', title: '孟德爾遺傳', simple: '丟硬幣分配基因；Aa×Aa 顯隱 3:1。', points: ['分離律、自由組合', '測交、機率法則', '顯隱變化(共顯/不完全)'] },
          { ch: '15', title: '染色體遺傳', simple: '同條染色體的基因會一起走，離越遠越易拆。', points: ['性聯遺傳', '連鎖與重組、圖距', '不分離與染色體異常'] },
          { ch: '16–17', title: 'DNA 與基因表現', simple: 'DNA 食譜先抄成 RNA 再做成蛋白。', points: ['DNA 複製(半保留)', '轉錄、RNA 加工', '轉譯與密碼子'] },
          { ch: '18', title: '基因調控', simple: '基因有開關，要用才打開。', points: ['原核操縱組(lac/trp)', '真核：增強子、染色質、甲基化', 'miRNA 調控'] },
          { ch: '20–21', title: '生物技術與基因體', simple: 'PCR 是影印機、定序是讀字母、CRISPR 是剪刀。', points: ['選殖、PCR、電泳、定序', 'CRISPR', '基因體學概念'] },
        ],
      },
      {
        unit: '單元4 演化',
        chapters: [
          { ch: '22–23', title: '天擇與族群演化', simple: '有用的留下來；族群的基因比例會變。', points: ['天擇證據與類型', '哈溫定律', '遺傳漂變、基因流、突變'] },
          { ch: '24–25', title: '物種形成與生命史', simple: '隔離久了就變成不同物種。', points: ['生殖隔離(合子前/後)', '異域/同域', '大滅絕與適應輻射'] },
        ],
      },
      {
        unit: '單元5 生物多樣性',
        chapters: [
          { ch: '26–27', title: '親緣樹與原核生物', simple: '把祖先和全部子孫圈一起(單系)；細菌古菌很會生。', points: ['支序分類、單/並/多系', '三域系統', '原核代謝多樣性'] },
          { ch: '28–34', title: '原生、植物、真菌、動物', simple: '各大類群有招牌特徵要記。', points: ['原生生物分群', '植物登陸與維管束演化', '動物各門:對稱、體腔、胚層'] },
        ],
      },
      {
        unit: '單元6 植物形態與生理',
        chapters: [
          { ch: '35–36', title: '植物體與運輸', simple: '木質部往上送水，韌皮部把糖送去需要的地方。', points: ['分生組織、初級/次級生長', '內聚-張力學說', '壓力流(源-匯)'] },
          { ch: '37–39', title: '營養、生殖與反應', simple: '缺水時 ABA 關氣孔；生長素只往一方向流。', points: ['礦物營養、固氮共生', '雙重受精、種子', '激素、向性、光週期(光敏素)'] },
        ],
      },
      {
        unit: '單元7 動物形態與生理',
        chapters: [
          { ch: '40', title: '構造、功能與恆定', simple: '身體用負回饋維持剛剛好。', points: ['組織類型', '恆定與回饋', '代謝率與體溫調節'] },
          { ch: '41–42', title: '消化、循環與氣體交換', simple: 'O₂ 搭血紅素、CO₂ 多變碳酸氫根。', points: ['消化酶與吸收', '雙循環、心臟傳導', '氣體運輸、波耳效應'] },
          { ch: '43', title: '免疫系統', simple: '先天是門禁，後天是會記仇的特種部隊。', points: ['先天/後天免疫', 'B/T 細胞、抗體、MHC', '記憶與二次反應'] },
          { ch: '44–45', title: '排泄與內分泌', simple: '腎臟撿回有用的；激素用回饋調控。', points: ['腎元、逆流倍增、ADH', '滲透調節', '下視丘-腦垂腺軸、血糖'] },
          { ch: '48–50', title: '神經與感覺運動', simple: '門(通道)快速開關造成電位變化。', points: ['動作電位、突觸', '中樞與感覺受器', '肌肉收縮(滑動纖絲)'] },
          { ch: '51', title: '動物行為', simple: '天生(本能)＋後天(學習)；幫親人要划算。', points: ['FAP、學習類型、銘印', '溝通與性擇', '親緣選擇 rB>C'] },
        ],
      },
      {
        unit: '單元8 生態學',
        chapters: [
          { ch: '52–53', title: '生態圈與族群', simple: '東西不夠成長就停(邏輯斯, 上限K)。', points: ['氣候與生物群系', '指數/邏輯斯成長', '存活曲線、密度制約'] },
          { ch: '54–56', title: '群落、生態系與保育', simple: '能量一層只傳約十分之一；物質會循環。', points: ['交互作用、演替、關鍵種', '能量流、營養階', '氮/碳循環、生物多樣性保育'] },
        ],
      },
    ],
  },
  {
    id: 'vander',
    title: "Vander's Human Physiology",
    zh: '人體生理學（機制導向）',
    color: '#c8714e',
    units: [
      {
        unit: '生理基礎與調控',
        chapters: [
          { ch: '1', title: '恆定與回饋', simple: '身體像自動空調，太高就降、太低就升。', points: ['內環境恆定', '負/正回饋', '前饋調節'] },
          { ch: '6', title: '神經訊號', simple: '門快速開關＝電位變化；幫浦只是慢慢充電。', points: ['膜電位、動作電位', '突觸傳遞、整合', '神經傳遞物質'] },
        ],
      },
      {
        unit: '系統生理',
        chapters: [
          { ch: '9', title: '肌肉', simple: '細絲互相滑動讓肌肉縮短。', points: ['滑動纖絲學說', '興奮-收縮偶聯(Ca²⁺)', '骨骼/平滑/心肌'] },
          { ch: '12', title: '心血管', simple: '身體有自動血壓計(壓力受器)。', points: ['心動週期、Frank-Starling', '血壓與血流調控', '壓力反射'] },
          { ch: '13', title: '呼吸', simple: 'CO₂ 多→血變酸→呼吸加快吐酸。', points: ['通氣與氣體交換', 'O₂/CO₂ 運輸', '呼吸調控與酸鹼'] },
          { ch: '14', title: '腎臟與體液', simple: '腎臟用逆流把鹽濃縮，需要時留住水。', points: ['過濾/再吸收/分泌、清除率', '逆流倍增、ADH', '酸鹼與電解質平衡'] },
          { ch: '11', title: '內分泌', simple: '三層上司互相通報，多了就叫上面停工。', points: ['激素機制(水溶/脂溶)', '下視丘-腦垂腺軸', '血糖/鈣/壓力調控'] },
        ],
      },
    ],
  },
  {
    id: 'immunology',
    title: 'Immunology (Janeway / Kuby)',
    zh: '免疫學',
    color: '#d9a441',
    units: [
      {
        unit: '免疫核心',
        chapters: [
          { ch: '1', title: '先天免疫', simple: '門口警衛，人人一樣、反應快但沒記憶。', points: ['屏障、發炎、吞噬', '補體三途徑', '模式辨識受體(PRR)'] },
          { ch: '2', title: '抗原呈現與 MHC', simple: 'MHC 是識別證；認錯就出事。', points: ['MHC I(內生)→CTL；MHC II(外來)→Th', '抗原處理途徑', '交叉呈現'] },
          { ch: '3', title: 'T 細胞', simple: '指揮官(Th)＋殺手(CTL)。', points: ['TCR 與共刺激', 'Th1/Th2/Th17/Treg', '細胞性免疫'] },
          { ch: '4', title: 'B 細胞與抗體', simple: 'B 細胞變工廠做抗體。', points: ['抗體結構與類型', '類別轉換、親和力成熟', '體液免疫'] },
          { ch: '5', title: '記憶與調節失常', simple: '記得壞蛋，第二次更快更猛。', points: ['免疫記憶與疫苗', '超敏反應 I–IV 型', '自體免疫與耐受'] },
        ],
      },
    ],
  },
  {
    id: 'plantphys',
    title: 'Plant Physiology (Taiz & Zeiger)',
    zh: '植物生理學',
    color: '#7aa35a',
    units: [
      {
        unit: '水分、養分與光合',
        chapters: [
          { ch: '4', title: '水分與蒸散', simple: '從葉子上面吸，水柱手牽手被拉上去。', points: ['水勢、滲透', '內聚-張力、氣孔調控', '蒸散與環境'] },
          { ch: '7–8', title: '光合：光反應與碳同化', simple: '光發電(ATP/NADPH)再固碳。', points: ['光系統 I/II、電子傳遞', '卡爾文循環', 'C4/CAM 與光呼吸'] },
        ],
      },
      {
        unit: '運輸與訊息',
        chapters: [
          { ch: '11', title: '韌皮部運輸', simple: '把糖從產地壓送到需要處。', points: ['源-匯、壓力流', '裝載/卸載'] },
          { ch: '激素', title: '植物激素與訊息', simple: '缺水 ABA 關氣孔；生長素極性運輸。', points: ['生長素/激勃素/細胞分裂素/ABA/乙烯', '訊息傳導與受體', '光敏素與光形態'] },
        ],
      },
    ],
  },
  {
    id: 'genetics',
    title: '基礎遺傳學',
    zh: '遺傳分析',
    color: '#8d7aa0',
    units: [
      {
        unit: '傳遞與分析',
        chapters: [
          { ch: '1', title: '孟德爾與機率', simple: '用機率算子代比例。', points: ['分離/自由組合', '機率與分支法', '卡方檢定'] },
          { ch: '2', title: '連鎖與作圖', simple: '重組比例＝地圖距離。', points: ['連鎖、重組率=cM', '三點測交、干涉', '基因圖譜'] },
          { ch: '3', title: '族群與數量遺傳', simple: '族群基因比例的變化與遺傳力。', points: ['哈溫定律', '選擇/漂變/遷移', '數量性狀與遺傳力'] },
        ],
      },
      {
        unit: '分子遺傳',
        chapters: [
          { ch: '4', title: '基因突變與修復', simple: '抄錯字會突變，細胞有校對與修復。', points: ['點突變/框移', '誘變與修復機制', '轉位子'] },
        ],
      },
    ],
  },
  {
    id: 'cellmol',
    title: '細胞與分子生物學 (Alberts)',
    zh: '細胞分子生物學',
    color: '#5ec8b8',
    units: [
      {
        unit: '分子機制',
        chapters: [
          { ch: '4–6', title: 'DNA、染色質與複製', simple: 'DNA 捲在組蛋白上，複製要半保留。', points: ['核小體、染色質', '複製機制與校對', 'DNA 修復'] },
          { ch: '7', title: '轉錄與基因調控', simple: '增強子像遙控器；染色質捲緊就關機。', points: ['轉錄因子、增強子', '染色質重塑、表觀遺傳', 'RNA 加工與 ncRNA'] },
          { ch: '15', title: '細胞訊息傳遞', simple: '訊號可放大也可互相喊停。', points: ['受體與第二傳訊者', '激酶級聯', '訊息網路整合'] },
          { ch: '17', title: '細胞週期與凋亡', simple: '檢查哨把關；壞了就自我了結。', points: ['cyclin/CDK', '檢查點', '凋亡(caspase)'] },
        ],
      },
    ],
  },
  {
    id: 'molbio',
    title: '分子生物學',
    zh: '分子技術與調控',
    color: '#b9573e',
    units: [
      {
        unit: '中心法則與技術',
        chapters: [
          { ch: '1', title: '中心法則', simple: 'DNA→RNA→蛋白；反轉錄是倒帶特例。', points: ['複製/轉錄/轉譯', '反轉錄', '密碼子與校對'] },
          { ch: '2', title: '重組 DNA 與技術', simple: 'PCR 影印、選殖搬家、定序讀字母。', points: ['限制酶、載體、選殖', 'PCR/qPCR、電泳', '定序(Sanger/NGS)、CRISPR'] },
        ],
      },
    ],
  },
  {
    id: 'chen',
    title: '陳佳芬 生物學三部曲',
    zh: '中文奧林匹亞綜整',
    color: '#e0a35e',
    units: [
      {
        unit: '綜整重點（依主題）',
        chapters: [
          { ch: '一', title: '細胞與分子綜整', simple: '把細胞、代謝、分子的難題拆成易懂原理。', points: ['細胞構造與膜運輸', '呼吸光合與酶', '分子遺傳重點整合'] },
          { ch: '二', title: '生理與遺傳綜整', simple: '動植物生理 + 遺傳的整合題型。', points: ['動物各系統生理', '植物生理重點', '遺傳分析與計算'] },
          { ch: '三', title: '演化、生態與分類綜整', simple: '演化、生態、分類的脈絡與常考。', points: ['演化機制與物種形成', '生態與族群', '分類與親緣'] },
        ],
      },
    ],
  },
];
