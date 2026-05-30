/**
 * 官方資源連結 (links to the Taiwan IBO selection programme site, tpmso.org/ibo).
 * Grouped for the 官方資源 page so students can jump to authoritative info.
 */
export interface ResourceLink {
  label: string;
  url: string;
  emoji: string;
  note?: string;
}

export interface ResourceGroup {
  title: string;
  emoji: string;
  links: ResourceLink[];
}

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: '競賽資訊',
    emoji: '📣',
    links: [
      { label: '最新消息', url: 'https://tpmso.org/ibo/index.php/news/', emoji: '🔔', note: '報名與公告' },
      { label: '競賽資訊 / 重要日程', url: 'https://tpmso.org/ibo/index.php/timeline/', emoji: '🗓️', note: '初賽・複賽・選拔營時程' },
      { label: '關於 IBO', url: 'https://tpmso.org/ibo/index.php/about/', emoji: '📖' },
    ],
  },
  {
    title: '準備重點',
    emoji: '🎯',
    links: [
      { label: '考試範圍', url: 'https://tpmso.org/ibo/index.php/exam-scope/', emoji: '📚', note: '官方公布的命題範圍' },
      { label: '歷屆試題', url: 'https://tpmso.org/ibo/index.php/test/', emoji: '📝', note: '官方歷屆考古題' },
      { label: '歷屆成績', url: 'https://tpmso.org/ibo/index.php/score/', emoji: '🏅', note: '了解錄取分數落點' },
    ],
  },
  {
    title: '各階段選拔',
    emoji: '🪜',
    links: [
      { label: '初賽', url: 'https://tpmso.org/ibo/index.php/first-round-selection/', emoji: '①' },
      { label: '複賽', url: 'https://tpmso.org/ibo/index.php/second-round-selection/', emoji: '②' },
      { label: '選拔營', url: 'https://tpmso.org/ibo/index.php/selection-competition/', emoji: '⛺' },
      { label: '理論', url: 'https://tpmso.org/ibo/index.php/theory/', emoji: '🧠' },
      { label: '實作', url: 'https://tpmso.org/ibo/index.php/practice/', emoji: '🔬' },
      { label: '國際競賽', url: 'https://tpmso.org/ibo/index.php/international-competition/', emoji: '🌏' },
    ],
  },
  {
    title: '延伸與聯絡',
    emoji: '🔗',
    links: [
      { label: '相關連結', url: 'https://tpmso.org/ibo/index.php/link/', emoji: '🧷' },
      { label: '主辦國家', url: 'https://tpmso.org/ibo/index.php/country/', emoji: '🏳️' },
      { label: 'IBO 相簿', url: 'https://tpmso.org/ibo/index.php/photoalbum/', emoji: '📷' },
      { label: '媒體影音', url: 'https://tpmso.org/ibo/index.php/video/', emoji: '🎬' },
    ],
  },
];

export const CONTACT = {
  email: 'taiwanibo@gmail.com',
  phone: '07-525-3621',
  site: 'https://tpmso.org/ibo/',
};
