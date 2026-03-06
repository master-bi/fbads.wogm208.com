import { Match, MatchStatus, Team, ViewState } from './types';

// Helper to generate placeholder player image
// Using a generated SVG data URI for a faceless baseball player icon
const pImg = (id: number) => {
  // Generate a consistent color based on ID range (Team Colors)
  let color = '#3b82f6'; // Default Blue

  if (id >= 100 && id < 200) color = '#1D4487'; // TPE Blue
  else if (id >= 200 && id < 300) color = '#000B45'; // JPN Navy
  else if (id >= 300 && id < 400) color = '#002B5C'; // USA Navy
  else if (id >= 400 && id < 500) color = '#003478'; // KOR Blue
  else if (id >= 500 && id < 600) color = '#CE1126'; // DOM Red
  else if (id >= 600 && id < 610) color = '#CC0000'; // CUB Red
  else if (id >= 610 && id < 620) color = '#D21034'; // PAN Red
  else if (id >= 620 && id < 630) color = '#FCD116'; // COL Yellow
  else if (id >= 700 && id < 710) color = '#0050F0'; // PUR Blue
  else if (id >= 710 && id < 720) color = '#FF0000'; // CAN Red
  else if (id >= 720 && id < 730) color = '#006847'; // MEX Green
  else if (id >= 730 && id < 740) color = '#800000'; // VEN Burgundy
  else if (id >= 740 && id < 750) color = '#FF8200'; // NED Orange
  else if (id >= 800 && id < 810) color = '#00843D'; // AUS Green
  else if (id >= 810 && id < 820) color = '#003399'; // ITA Azure
  else if (id >= 820 && id < 830) color = '#00247D'; // GBR Blue
  else if (id >= 830 && id < 840) color = '#009739'; // BRA Green
  else if (id >= 840 && id < 850) color = '#0038B8'; // ISR Blue
  else if (id >= 850 && id < 860) color = '#0067C6'; // NIC Blue
  else if (id >= 900 && id < 910) color = '#11457E'; // CZE Blue
  else if (id >= 910 && id < 920) color = '#DE2910'; // CHN Red

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="#1e293b"/>
    <circle cx="100" cy="85" r="45" fill="${color}"/>
    <path d="M100 40 L145 85 L100 85 Z" fill="#000000" opacity="0.2"/>
    <path d="M55 85 Q55 110 80 125 L120 125 Q145 110 145 85" fill="${color}"/>
    <path d="M50 85 Q100 50 150 85" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    <path d="M20 200 Q100 140 180 200" fill="${color}"/>
  </svg>
  `;
  const base64 = (str: string) => typeof window !== 'undefined' ? window.btoa(str) : Buffer.from(str).toString('base64');
  return `data:image/svg+xml;base64,${base64(svg)}`;
};

export const TEAMS: Team[] = [
  // --- Pool C (Tokyo) ---
  {
    id: 'tpe',
    name: '中華台北',
    group: 'C',
    logo: '🇹🇼',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 2,
    description: '以堅強的防守與團隊合作著稱，擁有主場優勢的勁旅。',
    players: [
      { 
        id: 'tpe1', 
        name: '張育成', 
        position: 'INF', 
        number: 18, 
        stats: { avg: '.276', hr: 15, ops: '.890' }, 
        image: pImg(101), 
        analysis: '台灣巨砲，具備大聯盟等級的長打火力，內野守備穩健，是中華隊不動的第四棒與精神領袖。',
        careerStats: [
          { year: 2021, team: 'CLE (MLB)', g: 89, avg: '.228', hr: 9 },
          { year: 2022, team: 'TB/PIT (MLB)', g: 69, avg: '.208', hr: 4 },
          { year: 2023, team: 'BOS (MLB)', g: 39, avg: '.162', hr: 6 },
          { year: 2024, team: '富邦悍將', g: 45, avg: '.276', hr: 10 }
        ],
        achievements: ['2023 WBC A組 MVP', '2023 WBC 最佳一壘手', '台灣球員MLB單季最多轟紀錄 (9支)']
      },
      { 
        id: 'tpe2', 
        name: '林立', 
        position: 'INF', 
        number: 39, 
        stats: { avg: '.335', hr: 10, ops: '.905' }, 
        image: pImg(102), 
        analysis: '中職三冠王，打擊技巧全面，兼具速度與破壞力，是開路先鋒的最佳人選。',
        careerStats: [
          { year: 2021, team: '樂天桃猿', g: 98, avg: '.277', hr: 7 },
          { year: 2022, team: '樂天桃猿', g: 109, avg: '.335', hr: 14 },
          { year: 2023, team: '樂天桃猿', g: 85, avg: '.328', hr: 10 },
          { year: 2024, team: '樂天桃猿', g: 110, avg: '.340', hr: 8 }
        ],
        achievements: ['2022 CPBL 年度MVP', '2022 CPBL 打擊王', '2022 CPBL 安打王', '2022 CPBL 打點王']
      },
      { 
        id: 'tpe3', 
        name: '陳傑憲', 
        position: 'OF', 
        number: 24, 
        stats: { avg: '.320', hr: 3, ops: '.850' }, 
        image: pImg(103), 
        analysis: '台灣隊長，安打製造機，外野守備範圍廣，高上壘率能有效串聯攻勢。',
        careerStats: [
          { year: 2021, team: '統一獅', g: 104, avg: '.325', hr: 3 },
          { year: 2022, team: '統一獅', g: 108, avg: '.309', hr: 6 },
          { year: 2023, team: '統一獅', g: 110, avg: '.315', hr: 4 },
          { year: 2024, team: '統一獅', g: 115, avg: '.328', hr: 2 }
        ],
        achievements: ['2020 CPBL 打擊王', '2020 CPBL 安打王', '多次金手套與最佳十人']
      },
      { 
        id: 'tpe4', 
        name: '古林睿煬', 
        position: 'P', 
        number: 19, 
        stats: { era: '1.80', so: 150 }, 
        image: pImg(104), 
        analysis: '新生代火球男，直球尾勁極佳，搭配銳利的變化球，具有主宰比賽的潛力。',
        careerStats: [
          { year: 2021, team: '統一獅', g: 20, era: '3.15', w: 8 },
          { year: 2022, team: '統一獅', g: 12, era: '3.34', w: 7 },
          { year: 2023, team: '統一獅', g: 13, era: '1.80', w: 5 },
          { year: 2024, team: '統一獅', g: 22, era: '1.66', w: 10 }
        ],
        achievements: ['2024 CPBL 防禦率王', '2023 亞運銀牌', 'CPBL 最速本土投手之一']
      },
      { id: 'tpe5', name: '吉力吉撈·鞏冠', position: 'C', number: 4, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(105), analysis: '具備一棒擊沉對手的長打能力，引導投手功力日益成熟，是捕手位置的重砲威脅。' },
      { id: 'tpe6', name: '江少慶', position: 'P', number: 71, stats: { era: '0.00', so: 0 }, image: pImg(106), analysis: '經驗豐富的先發投手，擁有厚重的直球與多樣變化球，是球隊倚重的吃局數大將。' },
      { id: 'tpe7', name: '王維中', position: 'P', number: 16, stats: { era: '0.00', so: 0 }, image: pImg(107), analysis: '左投優勢加上大聯盟資歷，球質剛猛，能勝任先發或長中繼的關鍵角色。' },
      { id: 'tpe8', name: '陳冠宇', position: 'P', number: 17, stats: { era: '0.00', so: 0 }, image: pImg(108), analysis: '控球精準的左投，國際賽經驗豐富，能在關鍵時刻穩定軍心，化解危機。' },
      { id: 'tpe9', name: '宋家豪', position: 'P', number: 43, stats: { era: '0.00', so: 0 }, image: pImg(109), analysis: '日職後援大將，擁有剛猛的直球與指叉球，是牛棚中不可或缺的終結者人選。' },
      { id: 'tpe10', name: '鄭宗哲', position: 'INF', number: 6, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(110), analysis: '攻守俱佳的游擊手，速度飛快，戰術執行能力強，能為球隊帶來更多得分機會。' },
      { id: 'tpe11', name: '吳念庭', position: 'INF', number: 10, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(111), analysis: '選球眼精準，得點圈打擊率高，內野多面手，是教練團調度的活棋。' },
      { id: 'tpe12', name: '王柏融', position: 'OF', number: 9, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(112), analysis: '台灣大王，打擊爆發力強，經過日職洗禮後心態更為成熟，期待重拾身手。' },
      { id: 'tpe13', name: '林安可', position: 'OF', number: 77, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(113), analysis: '混血王子，揮棒豪邁，具有全方向開轟的能力，是打線中的恐怖份子。' },
      { id: 'tpe14', name: '戴培峰', position: 'C', number: 95, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(114), analysis: '守備型捕手，配球靈活，阻殺能力強，能給予投手極大的安定感。' },
      { id: 'tpe15', name: '曾峻岳', position: 'P', number: 81, stats: { era: '0.00', so: 0 }, image: pImg(115), analysis: '年輕終結者，直球速度快且尾勁強，心臟大顆，敢於對決打者。' },
    ]
  },
  {
    id: 'jpn',
    name: '日本',
    group: 'C',
    logo: '🇯🇵',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 1,
    description: '衛冕冠軍，擁有世界上最頂尖的投手群與打擊技巧。',
    players: [
      { 
        id: 'jpn1', 
        name: '大谷翔平', 
        position: 'DH/P', 
        number: 17, 
        stats: { avg: '.310', hr: 54, era: '3.14' }, 
        image: pImg(201), 
        analysis: '現代棒球神獸，二刀流投打俱佳，擁有改變比賽的絕對能力，是日本隊的王牌核心。',
        careerStats: [
          { year: 2021, team: 'LAA (MLB)', g: 155, avg: '.257', hr: 46 },
          { year: 2022, team: 'LAA (MLB)', g: 157, avg: '.273', hr: 34 },
          { year: 2023, team: 'LAA (MLB)', g: 135, avg: '.304', hr: 44 },
          { year: 2024, team: 'LAD (MLB)', g: 159, avg: '.310', hr: 54 }
        ],
        achievements: ['2021, 2023 AL MVP', '2024 NL MVP', '2023 WBC MVP', 'MLB 史上首位 50-50 俱樂部成員']
      },
      { 
        id: 'jpn2', 
        name: '山本由伸', 
        position: 'P', 
        number: 18, 
        stats: { era: '2.90', so: 200 }, 
        image: pImg(202), 
        analysis: '日職最強投手，控球精準，球種犀利，擁有宰制大聯盟打者的實力。',
        careerStats: [
          { year: 2021, team: '歐力士 (NPB)', g: 26, era: '1.39', w: 18 },
          { year: 2022, team: '歐力士 (NPB)', g: 26, era: '1.68', w: 15 },
          { year: 2023, team: '歐力士 (NPB)', g: 23, era: '1.21', w: 16 },
          { year: 2024, team: 'LAD (MLB)', g: 28, era: '2.95', w: 12 }
        ],
        achievements: ['3度澤村賞 (2021-2023)', '3度日職MVP', '2023 WBC 冠軍成員']
      },
      { 
        id: 'jpn3', 
        name: '佐佐木朗希', 
        position: 'P', 
        number: 14, 
        stats: { era: '2.00', so: 180 }, 
        image: pImg(203), 
        analysis: '令和怪物，擁有超過160公里的火球與極品指叉球，是令人畏懼的先發投手。',
        careerStats: [
          { year: 2021, team: '羅德 (NPB)', g: 11, era: '2.27', w: 3 },
          { year: 2022, team: '羅德 (NPB)', g: 20, era: '2.02', w: 9 },
          { year: 2023, team: '羅德 (NPB)', g: 15, era: '1.78', w: 7 },
          { year: 2024, team: '羅德 (NPB)', g: 18, era: '2.35', w: 10 }
        ],
        achievements: ['2022 投出完全比賽', '日職最年輕完全比賽投手', '單場19K紀錄']
      },
      { 
        id: 'jpn4', 
        name: '村上宗隆', 
        position: 'INF', 
        number: 55, 
        stats: { avg: '.280', hr: 40, ops: '.950' }, 
        image: pImg(204), 
        analysis: '村神降臨，日職三冠王，長打能力驚人，是日本隊中心打線的恐怖重砲。',
        careerStats: [
          { year: 2021, team: '養樂多 (NPB)', g: 143, avg: '.278', hr: 39 },
          { year: 2022, team: '養樂多 (NPB)', g: 141, avg: '.318', hr: 56 },
          { year: 2023, team: '養樂多 (NPB)', g: 140, avg: '.256', hr: 31 },
          { year: 2024, team: '養樂多 (NPB)', g: 142, avg: '.285', hr: 35 }
        ],
        achievements: ['2022 日職三冠王', '2021, 2022 日職MVP', '日職本土單季最多轟 (56支)']
      },
      { id: 'jpn5', name: '岡本和真', position: 'INF', number: 25, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(205), analysis: '巨人軍主砲，打擊廣角且力量十足，關鍵時刻的打擊能力備受肯定。' },
      { id: 'jpn6', name: '近藤健介', position: 'OF', number: 8, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(206), analysis: '選球機器，上壘率極高，打擊技巧高超，能有效串聯攻勢。' },
      { id: 'jpn7', name: '今永昇太', position: 'P', number: 21, stats: { era: '0.00', so: 0 }, image: pImg(207), analysis: '投球哲學獨特，直球轉速高，擁有極佳的奪三振能力，是可靠的先發戰力。' },
      { id: 'jpn8', name: '鈴木誠也', position: 'OF', number: 51, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(208), analysis: '攻守跑三拍子好手，大聯盟等級的外野手，打擊爆發力與穩定性兼具。' },
      { id: 'jpn9', name: '吉田正尚', position: 'OF', number: 34, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(209), analysis: '紅襪強打，擊球率極高，不易被三振，是打線中穩定的輸出點。' },
      { id: 'jpn10', name: '達比修有', position: 'P', number: 11, stats: { era: '0.00', so: 0 }, image: pImg(210), analysis: '經驗豐富的老將，球種多樣且變化莫測，能傳承經驗並穩定投手群。' },
      { id: 'jpn11', name: '源田壯亮', position: 'INF', number: 6, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(211), analysis: '守備教科書，游擊防區固若金湯，打擊雖非強項但戰術執行力高。' },
      { id: 'jpn12', name: '甲斐拓也', position: 'C', number: 19, stats: { avg: '.000', hr: 0, ops: '.000' }, image: pImg(212), analysis: '加農砲捕手，阻殺能力頂尖，配球靈活，是投手群最信賴的搭檔。' },
    ]
  },
  {
    id: 'kor',
    name: '南韓',
    group: 'C',
    logo: '🇰🇷',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 4,
    description: '亞洲傳統勁旅，球風強悍，誓言雪恥。',
    players: [
      { 
        id: 'kor1', 
        name: '金河成', 
        position: 'INF', 
        number: 7, 
        stats: { avg: '.260', hr: 17 }, 
        image: pImg(401), 
        analysis: '大聯盟金手套級內野手，守備範圍廣，打擊兼具力量與速度，是韓國隊的攻守核心。',
        careerStats: [
          { year: 2021, team: 'SD (MLB)', g: 117, avg: '.202', hr: 8 },
          { year: 2022, team: 'SD (MLB)', g: 150, avg: '.251', hr: 11 },
          { year: 2023, team: 'SD (MLB)', g: 152, avg: '.260', hr: 17 },
          { year: 2024, team: 'SD (MLB)', g: 145, avg: '.255', hr: 15 }
        ],
        achievements: ['2023 NL 金手套獎 (工具人)', 'KBO 3度金手套', '2023 亞洲球員MLB盜壘紀錄']
      },
      { 
        id: 'kor2', 
        name: '李政厚', 
        position: 'OF', 
        number: 51, 
        stats: { avg: '.285', hr: 10 }, 
        image: pImg(402), 
        analysis: '風之孫，打擊技巧精湛，安打率高，外野守備判斷精準，是球隊的開路先鋒。',
        careerStats: [
          { year: 2021, team: '培證英雄 (KBO)', g: 123, avg: '.360', hr: 7 },
          { year: 2022, team: '培證英雄 (KBO)', g: 142, avg: '.349', hr: 23 },
          { year: 2023, team: '培證英雄 (KBO)', g: 86, avg: '.318', hr: 6 },
          { year: 2024, team: 'SF (MLB)', g: 130, avg: '.285', hr: 10 }
        ],
        achievements: ['2022 KBO MVP', '5度 KBO 金手套', '2022 KBO 打擊五冠王']
      },
      { id: 'kor3', name: '高佑錫', position: 'P', number: 19, stats: { era: '0.00', so: 0 }, image: pImg(403), analysis: '韓國頂尖終結者，直球速度快，滑球犀利，能在比賽後段鎖住勝利。' },
      { id: 'kor4', name: '姜白虎', position: 'INF', number: 50, stats: { avg: '.000', hr: 0 }, image: pImg(404), analysis: '天才打者，揮棒豪邁，具有一棒擊沉對手的長打能力，是中心打線的關鍵人物。' },
      { id: 'kor5', name: '朴炳鎬', position: 'INF', number: 52, stats: { avg: '.000', hr: 0 }, image: pImg(405), analysis: '韓國國民打者，長打爆發力驚人，經驗豐富，能給予對手極大的威脅。' },
      { id: 'kor6', name: '梁玹種', position: 'P', number: 54, stats: { era: '0.00', so: 0 }, image: pImg(406), analysis: '經驗豐富的左投，控球精準，變速球是其招牌武器，能有效混淆打者節奏。' },
      { id: 'kor7', name: '金廣鉉', position: 'P', number: 29, stats: { era: '0.00', so: 0 }, image: pImg(407), analysis: '韓國王牌左投，滑球極具威力，國際賽經驗豐富，是球隊倚重的先發戰力。' },
      { id: 'kor8', name: '崔志萬', position: 'INF', number: 26, stats: { avg: '.000', hr: 0 }, image: pImg(408), analysis: '大聯盟資歷豐富，選球眼佳，具備長打能力，一壘守備穩健。' },
      { id: 'kor9', name: '艾德曼', position: 'INF', number: 11, stats: { avg: '.000', hr: 0 }, image: pImg(409), analysis: '紅雀金手套二壘手，攻守俱佳，速度快，能為韓國隊帶來美式球風的衝擊。' },
      { id: 'kor10', name: '李義理', position: 'P', number: 48, stats: { era: '0.00', so: 0 }, image: pImg(410), analysis: '新生代左投，直球尾勁好，變速球犀利，具有極高的奪三振率。' },
    ]
  },
  {
    id: 'aus',
    name: '澳洲',
    group: 'C',
    logo: '🇦🇺',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 11,
    description: '大洋洲霸主，球風粗獷有力。',
    players: [
      { id: 'aus1', name: 'Liam Hendriks', position: 'P', number: 31, stats: { era: '0.00' }, image: pImg(801), analysis: '頂級終結者，直球剛猛，充滿鬥志。' },
      { id: 'aus2', name: 'Aaron Whitefield', position: 'OF', number: 43, stats: { avg: '.000' }, image: pImg(802), analysis: '速度飛快，外野守備範圍廣，是球隊的開路先鋒。' },
      { id: 'aus3', name: 'Robbie Glendinning', position: 'INF', number: 10, stats: { avg: '.000' }, image: pImg(803), analysis: '內野重砲，長打能力不錯。' },
      { id: 'aus4', name: 'Tim Kennelly', position: 'OF', number: 23, stats: { avg: '.000' }, image: pImg(804), analysis: '經驗豐富的老將，能勝任多個守備位置。' },
      { id: 'aus5', name: 'Warwick Saupold', position: 'P', number: 30, stats: { era: '0.00' }, image: pImg(805), analysis: '曾效力韓職，控球精準，能吃下局數。' },
    ]
  },
  {
    id: 'cze',
    name: '捷克',
    group: 'C',
    logo: '🇨🇿',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 15,
    description: '歐洲黑馬，業餘球員組成的驚奇隊伍。',
    players: [
      { id: 'cze1', name: 'Martin Schneider', position: 'P/INF', number: 13, stats: { avg: '.000' }, image: pImg(901), analysis: '消防員投手，球速雖不快但控球精準，投打二刀流。' },
      { id: 'cze2', name: 'Marek Chlup', position: 'OF', number: 7, stats: { avg: '.000' }, image: pImg(902), analysis: '捷克重砲，長打能力驚人，外野守備穩健。' },
      { id: 'cze3', name: 'Martin Cervenka', position: 'C', number: 55, stats: { avg: '.000' }, image: pImg(903), analysis: '經驗豐富的捕手，曾在小聯盟打拼多年。' },
      { id: 'cze4', name: 'Ondrej Satoria', position: 'P', number: 35, stats: { era: '0.00' }, image: pImg(904), analysis: '對戰日本一戰成名，變速球極具威力。' },
      { id: 'cze5', name: 'Vojtech Mensik', position: 'INF', number: 2, stats: { avg: '.000' }, image: pImg(905), analysis: '內野守備穩健，打擊技巧不錯。' },
    ]
  },

  // --- Pool A (San Juan) ---
  {
    id: 'pur',
    name: '波多黎各',
    group: 'A',
    logo: '🇵🇷',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 11,
    description: '加勒比海勁旅，擁有強大的內野陣容與熱情的球迷支持。',
    players: [
      { id: 'pur1', name: 'Francisco Lindor', position: 'INF', number: 12, stats: { avg: '.000' }, image: pImg(701), analysis: '游擊魔術師，攻守俱佳，具備領袖氣質，是波多黎各的核心。' },
      { id: 'pur2', name: 'Javier Báez', position: 'INF', number: 9, stats: { avg: '.000' }, image: pImg(702), analysis: '充滿創造力的球員，守備華麗，打擊爆發力強，但揮空率較高。' },
      { id: 'pur3', name: 'Carlos Correa', position: 'INF', number: 4, stats: { avg: '.000' }, image: pImg(703), analysis: '大賽型球員，關鍵時刻打擊能力強，內野守備穩健。' },
      { id: 'pur4', name: 'Edwin Díaz', position: 'P', number: 39, stats: { era: '0.00' }, image: pImg(704), analysis: '頂級終結者，直球與滑球極具威力，出場曲更是全場焦點。' },
      { id: 'pur5', name: 'Kike Hernández', position: 'OF', number: 14, stats: { avg: '.000' }, image: pImg(705), analysis: '季後賽殺手，內外野皆可守的工具人，打擊爆發力不容小覷。' },
      { id: 'pur6', name: 'Marcus Stroman', position: 'P', number: 0, stats: { era: '0.00' }, image: pImg(706), analysis: '伸卡球大師，滾地球製造機，投球充滿激情。' },
      { id: 'pur7', name: 'Christian Vázquez', position: 'C', number: 7, stats: { avg: '.000' }, image: pImg(707), analysis: '經驗豐富的捕手，配球靈活，阻殺能力強。' },
      { id: 'pur8', name: 'Eddie Rosario', position: 'OF', number: 8, stats: { avg: '.000' }, image: pImg(708), analysis: '季後賽英雄，打擊手感火燙時無人能擋。' },
    ]
  },
  {
    id: 'cub',
    name: '古巴',
    group: 'A',
    logo: '🇨🇺',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 8,
    description: '紅色閃電，擁有深厚的棒球底蘊與經驗。',
    players: [
      { id: 'cub1', name: 'Yoan Moncada', position: 'INF', number: 10, stats: { avg: '.000' }, image: pImg(601), analysis: '攻守俱佳的三壘手，選球眼佳，具備長打潛力。' },
      { id: 'cub2', name: 'Luis Robert Jr.', position: 'OF', number: 88, stats: { avg: '.000' }, image: pImg(602), analysis: '五拍子球員，兼具力量與速度，外野守備範圍廣。' },
      { id: 'cub3', name: 'Yariel Rodríguez', position: 'P', number: 29, stats: { era: '0.00' }, image: pImg(603), analysis: '投球霸氣十足，直球尾勁強，滑球犀利。' },
      { id: 'cub4', name: 'Liván Moinelo', position: 'P', number: 89, stats: { era: '0.00' }, image: pImg(604), analysis: '日職頂級後援，直球與曲球搭配完美，奪三振率極高。' },
      { id: 'cub5', name: 'Raidel Martínez', position: 'P', number: 92, stats: { era: '0.00' }, image: pImg(605), analysis: '日職救援王，直球剛猛，指叉球極品，是牛棚的守護神。' },
      { id: 'cub6', name: 'Alfredo Despaigne', position: 'DH', number: 54, stats: { avg: '.000' }, image: pImg(606), analysis: '古巴重砲，長打能力驚人，是球隊的精神領袖。' },
      { id: 'cub7', name: 'Yoenis Céspedes', position: 'OF', number: 52, stats: { avg: '.000' }, image: pImg(607), analysis: '經驗豐富的老將，爆發力強，臂力驚人。' },
    ]
  },
  {
    id: 'can',
    name: '加拿大',
    group: 'A',
    logo: '🇨🇦',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 14,
    description: '北國勁旅，球風紮實，擁有多位大聯盟球星。',
    players: [
      { id: 'can1', name: 'Freddie Freeman', position: 'INF', number: 5, stats: { avg: '.000' }, image: pImg(711), analysis: '道奇MVP，打擊技巧全面，是加拿大隊的精神領袖。' },
      { id: 'can2', name: 'Tyler O\'Neill', position: 'OF', number: 27, stats: { avg: '.000' }, image: pImg(712), analysis: '肌肉猛男，兼具力量與速度，外野守備範圍廣。' },
      { id: 'can3', name: 'Cal Quantrill', position: 'P', number: 47, stats: { era: '0.00' }, image: pImg(713), analysis: '穩定性高的先發投手，控球精準，能吃下局數。' },
      { id: 'can4', name: 'Nick Pivetta', position: 'P', number: 37, stats: { era: '0.00' }, image: pImg(714), analysis: '直球剛猛，三振能力出色，是球隊倚重的先發戰力。' },
      { id: 'can5', name: 'Bo Naylor', position: 'C', number: 23, stats: { avg: '.000' }, image: pImg(715), analysis: '年輕捕手，具備長打潛力，守備進步神速。' },
      { id: 'can6', name: 'Josh Naylor', position: 'INF', number: 22, stats: { avg: '.000' }, image: pImg(716), analysis: '充滿激情的重砲手，關鍵時刻常有驚人表現。' },
    ]
  },
  {
    id: 'pan',
    name: '巴拿馬',
    group: 'A',
    logo: '🇵🇦',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 10,
    description: '中美洲強權，近年實力大幅提升。',
    players: [
      { id: 'pan1', name: 'Christian Bethancourt', position: 'C', number: 27, stats: { avg: '.000' }, image: pImg(611), analysis: '強肩捕手，阻殺能力強，具備長打能力。' },
      { id: 'pan2', name: 'Jaime Barría', position: 'P', number: 41, stats: { era: '0.00' }, image: pImg(612), analysis: '控球型投手，能有效混淆打者節奏。' },
      { id: 'pan3', name: 'Rubén Tejada', position: 'INF', number: 11, stats: { avg: '.000' }, image: pImg(613), analysis: '經驗豐富的內野手，守備穩健。' },
      { id: 'pan4', name: 'Javy Guerra', position: 'P', number: 25, stats: { era: '0.00' }, image: pImg(614), analysis: '火球男，轉任投手後表現亮眼。' },
      { id: 'pan5', name: 'José Ramos', position: 'OF', number: 99, stats: { avg: '.000' }, image: pImg(615), analysis: '新生代外野手，長打潛力十足。' },
    ]
  },
  {
    id: 'col',
    name: '哥倫比亞',
    group: 'A',
    logo: '🇨🇴',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 15,
    description: '南美新興勢力，投手戰力不容小覷。',
    players: [
      { id: 'col1', name: 'Gio Urshela', position: 'INF', number: 16, stats: { avg: '.000' }, image: pImg(621), analysis: '攻守俱佳的三壘手，守備美技連發，打擊穩定。' },
      { id: 'col2', name: 'Jorge Alfaro', position: 'C', number: 38, stats: { avg: '.000' }, image: pImg(622), analysis: '強打捕手，臂力驚人，但揮空率較高。' },
      { id: 'col3', name: 'Harold Ramírez', position: 'OF', number: 43, stats: { avg: '.000' }, image: pImg(623), analysis: '打擊技巧佳，能勝任外野與內野。' },
      { id: 'col4', name: 'José Quintana', position: 'P', number: 62, stats: { era: '0.00' }, image: pImg(624), analysis: '經驗豐富的左投，控球精準，能有效壓制對手。' },
      { id: 'col5', name: 'Julio Teherán', position: 'P', number: 49, stats: { era: '0.00' }, image: pImg(625), analysis: '老將投手，經驗豐富，能吃下局數。' },
    ]
  },

  // --- Pool B (Houston) ---
  {
    id: 'usa',
    name: '美國',
    group: 'B',
    logo: '🇺🇸',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 2,
    description: '全明星陣容，火力強大的奪冠熱門。',
    players: [
      { 
        id: 'usa1', 
        name: 'Mike Trout', 
        position: 'OF', 
        number: 27, 
        stats: { avg: '.290', hr: 35 }, 
        image: pImg(301), 
        analysis: '現代神獸，五拍子全能球員，打擊無死角，是美國隊長與精神領袖。',
        careerStats: [
          { year: 2021, team: 'LAA (MLB)', g: 36, avg: '.333', hr: 8 },
          { year: 2022, team: 'LAA (MLB)', g: 119, avg: '.283', hr: 40 },
          { year: 2023, team: 'LAA (MLB)', g: 82, avg: '.263', hr: 18 },
          { year: 2024, team: 'LAA (MLB)', g: 130, avg: '.290', hr: 35 }
        ],
        achievements: ['3度 AL MVP', '11度 MLB 明星賽', '9度 銀棒獎', '2012 AL 新人王']
      },
      { 
        id: 'usa2', 
        name: 'Mookie Betts', 
        position: 'OF', 
        number: 50, 
        stats: { avg: '.307', hr: 30 }, 
        image: pImg(302), 
        analysis: '運動能力極佳，兼具長打與速度，守備範圍廣，是球隊的核彈頭。',
        careerStats: [
          { year: 2021, team: 'LAD (MLB)', g: 122, avg: '.264', hr: 23 },
          { year: 2022, team: 'LAD (MLB)', g: 142, avg: '.269', hr: 35 },
          { year: 2023, team: 'LAD (MLB)', g: 152, avg: '.307', hr: 39 },
          { year: 2024, team: 'LAD (MLB)', g: 150, avg: '.300', hr: 30 }
        ],
        achievements: ['2018 AL MVP', '2度 世界大賽冠軍', '6度 金手套獎', '6度 銀棒獎']
      },
      { 
        id: 'usa3', 
        name: 'Bryce Harper', 
        position: 'OF', 
        number: 3, 
        stats: { avg: '.295', hr: 32 }, 
        image: pImg(303), 
        analysis: '強力左打，揮棒速度快，具備驚人的長打爆發力，關鍵時刻屢建奇功。',
        careerStats: [
          { year: 2021, team: 'PHI (MLB)', g: 141, avg: '.309', hr: 35 },
          { year: 2022, team: 'PHI (MLB)', g: 99, avg: '.286', hr: 18 },
          { year: 2023, team: 'PHI (MLB)', g: 126, avg: '.293', hr: 21 },
          { year: 2024, team: 'PHI (MLB)', g: 145, avg: '.295', hr: 32 }
        ],
        achievements: ['2度 NL MVP (2015, 2021)', '2012 NL 新人王', '7度 MLB 明星賽', '3度 銀棒獎']
      },
      { id: 'usa4', name: 'Nolan Arenado', position: 'INF', number: 28, stats: { avg: '.000', hr: 0 }, image: pImg(304), analysis: '攻守俱佳的三壘手，金手套常客，打擊穩定且具長打力。' },
      { id: 'usa5', name: 'Paul Goldschmidt', position: 'INF', number: 46, stats: { avg: '.000', hr: 0 }, image: pImg(305), analysis: '國聯MVP，打擊技巧全面，選球精準，是一壘防區的定海神針。' },
      { id: 'usa6', name: 'Trea Turner', position: 'INF', number: 7, stats: { avg: '.000', hr: 0 }, image: pImg(306), analysis: '速度飛快，游擊守備範圍廣，打擊兼具安打與長打能力，破壞力十足。' },
      { id: 'usa7', name: 'J.T. Realmuto', position: 'C', number: 10, stats: { avg: '.000', hr: 0 }, image: pImg(307), analysis: '鐵捕，攻守俱佳，引導投手功力一流，阻殺能力頂尖，跑壘速度驚人。' },
      { id: 'usa8', name: 'Pete Alonso', position: 'INF', number: 20, stats: { avg: '.000', hr: 0 }, image: pImg(308), analysis: '北極熊，全壘打大賽冠軍，力量驚人，隨時能將球轟出大牆。' },
      { id: 'usa9', name: 'Kyle Tucker', position: 'OF', number: 30, stats: { avg: '.000', hr: 0 }, image: pImg(309), analysis: '攻守均衡的外野手，揮棒流暢，具備長打潛力，守備判斷精準。' },
      { id: 'usa10', name: 'Gerrit Cole', position: 'P', number: 45, stats: { era: '0.00' }, image: pImg(310), analysis: '洋基王牌，直球剛猛，滑球犀利，擁有主宰比賽的壓制力。' },
      { id: 'usa11', name: 'Devin Williams', position: 'P', number: 38, stats: { era: '0.00' }, image: pImg(311), analysis: '擁有「空氣變速球」的終結者，奪三振率極高，是牛棚的絕對保險。' },
      { id: 'usa12', name: 'Logan Webb', position: 'P', number: 62, stats: { era: '0.00' }, image: pImg(312), analysis: '伸卡球大師，滾地球製造機，能有效精簡用球數，吃下長局數。' },
    ]
  },
  {
    id: 'mex',
    name: '墨西哥',
    group: 'B',
    logo: '🇲🇽',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 3,
    description: '上屆四強，投打實力均衡，球風激情。',
    players: [
      { id: 'mex1', name: 'Randy Arozarena', position: 'OF', number: 56, stats: { avg: '.000' }, image: pImg(721), analysis: '國際賽專武，大場面球員，充滿激情的球風能帶動球隊氣勢。' },
      { id: 'mex2', name: 'Joey Meneses', position: 'INF', number: 32, stats: { avg: '.000' }, image: pImg(722), analysis: '上屆WBC爆發的重砲，打擊穩定，具備長打能力。' },
      { id: 'mex3', name: 'Patrick Sandoval', position: 'P', number: 43, stats: { era: '0.00' }, image: pImg(723), analysis: '左投優勢，滑球犀利，三振能力出色。' },
      { id: 'mex4', name: 'Taijuan Walker', position: 'P', number: 99, stats: { era: '0.00' }, image: pImg(724), analysis: '經驗豐富的先發投手，直球剛猛，能吃下局數。' },
      { id: 'mex5', name: 'Isaac Paredes', position: 'INF', number: 17, stats: { avg: '.000' }, image: pImg(725), analysis: '拉打型重砲，長打爆發力強，內野守備穩健。' },
      { id: 'mex6', name: 'Alex Verdugo', position: 'OF', number: 24, stats: { avg: '.000' }, image: pImg(726), analysis: '攻守均衡的外野手，打擊技巧佳，臂力強。' },
      { id: 'mex7', name: 'Julio Urías', position: 'P', number: 7, stats: { era: '0.00' }, image: pImg(727), analysis: '頂級左投，控球精準，大賽經驗豐富，是球隊的王牌。' },
    ]
  },
  {
    id: 'ita',
    name: '義大利',
    group: 'B',
    logo: '🇮🇹',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 16,
    description: '歐洲勁旅，常有驚奇表現，戰術靈活。',
    players: [
      { id: 'ita1', name: 'Vinnie Pasquantino', position: 'INF', number: 9, stats: { avg: '.000' }, image: pImg(811), analysis: '義大利早餐，選球眼佳，打擊技巧高超。' },
      { id: 'ita2', name: 'Nicky Lopez', position: 'INF', number: 8, stats: { avg: '.000' }, image: pImg(812), analysis: '守備型內野手，戰術執行能力強，不易被三振。' },
      { id: 'ita3', name: 'Sal Frelick', position: 'OF', number: 10, stats: { avg: '.000' }, image: pImg(813), analysis: '新生代外野手，速度快，打擊技巧佳。' },
      { id: 'ita4', name: 'Matt Harvey', position: 'P', number: 33, stats: { era: '0.00' }, image: pImg(814), analysis: '黑暗騎士，雖然身手不如以往，但經驗豐富，能穩定軍心。' },
      { id: 'ita5', name: 'Andre Pallante', position: 'P', number: 53, stats: { era: '0.00' }, image: pImg(815), analysis: '滾地球投手，能有效壓制對手打線。' },
    ]
  },
  {
    id: 'gbr',
    name: '英國',
    group: 'B',
    logo: '🇬🇧',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 18,
    description: '棒球發展迅速，力求在小組賽突圍。',
    players: [
      { id: 'gbr1', name: 'Harry Ford', position: 'C', number: 8, stats: { avg: '.000' }, image: pImg(821), analysis: '英國隊的未來希望，攻守俱佳的捕手，速度飛快。' },
      { id: 'gbr2', name: 'Trayce Thompson', position: 'OF', number: 43, stats: { avg: '.000' }, image: pImg(822), analysis: '具備長打能力的重砲手，外野守備範圍廣。' },
      { id: 'gbr3', name: 'Vance Worley', position: 'P', number: 48, stats: { era: '0.00' }, image: pImg(823), analysis: '經驗豐富的投手，控球穩健。' },
      { id: 'gbr4', name: 'Chavez Young', position: 'OF', number: 1, stats: { avg: '.000' }, image: pImg(824), analysis: '速度快，外野守備範圍廣，充滿活力。' },
    ]
  },
  {
    id: 'bra',
    name: '巴西',
    group: 'B',
    logo: '🇧🇷',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 20,
    description: '南美森巴軍團，資格賽強勢晉級。',
    players: [
      { id: 'bra1', name: 'Yan Gomes', position: 'C', number: 10, stats: { avg: '.000' }, image: pImg(831), analysis: '經驗豐富的捕手，引導投手功力一流，具備長打能力。' },
      { id: 'bra2', name: 'Thyago Vieira', position: 'P', number: 40, stats: { era: '0.00' }, image: pImg(832), analysis: '火球男，直球速度快，能有效壓制打者。' },
      { id: 'bra3', name: 'Bo Takahashi', position: 'P', number: 22, stats: { era: '0.00' }, image: pImg(833), analysis: '控球型投手，能有效混淆打者。' },
      { id: 'bra4', name: 'Paulo Orlando', position: 'OF', number: 16, stats: { avg: '.000' }, image: pImg(834), analysis: '經驗豐富的外野手，守備穩健。' },
    ]
  },

  // --- Pool D (Miami) ---
  {
    id: 'dom',
    name: '多明尼加',
    group: 'D',
    logo: '🇩🇴',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 9,
    description: '棒球王國，球員天賦異稟，充滿爆發力。',
    players: [
      { id: 'dom1', name: 'Juan Soto', position: 'OF', number: 22, stats: { avg: '.000', hr: 0 }, image: pImg(501), analysis: '選球大師，打擊技巧高超，年紀輕輕便具備領袖氣質，是打線的核心。' },
      { id: 'dom2', name: 'Manny Machado', position: 'INF', number: 13, stats: { avg: '.000', hr: 0 }, image: pImg(502), analysis: '攻守俱佳的三壘手，臂力驚人，打擊爆發力強，關鍵時刻值得信賴。' },
      { id: 'dom3', name: 'Rafael Devers', position: 'INF', number: 11, stats: { avg: '.000', hr: 0 }, image: pImg(503), analysis: '強力左打，面對速球毫不畏懼，長打能力驚人，是紅襪隊的當家球星。' },
      { id: 'dom4', name: 'Sandy Alcántara', position: 'P', number: 22, stats: { era: '0.00' }, image: pImg(504), analysis: '賽揚獎投手，直球與變速球搭配完美，續航力極佳，是球隊的王牌先發。' },
      { id: 'dom5', name: 'Julio Rodríguez', position: 'OF', number: 44, stats: { avg: '.000', hr: 0 }, image: pImg(505), analysis: '新生代巨星，兼具速度與力量，外野守備範圍廣，充滿活力的球風。' },
      { id: 'dom6', name: 'Vladimir Guerrero Jr.', position: 'INF', number: 27, stats: { avg: '.000', hr: 0 }, image: pImg(506), analysis: '承襲父親的怪力，打擊死角少，擊球初速驚人，是一壘的重砲手。' },
      { id: 'dom7', name: 'Jeremy Peña', position: 'INF', number: 3, stats: { avg: '.000', hr: 0 }, image: pImg(507), analysis: '季後賽英雄，大心臟球員，游擊守備穩健，打擊在關鍵時刻常有佳作。' },
      { id: 'dom8', name: 'Teoscar Hernández', position: 'OF', number: 37, stats: { avg: '.000', hr: 0 }, image: pImg(508), analysis: '強力右打，長打能力優異，外野助殺能力強，能提供穩定的火力輸出。' },
      { id: 'dom9', name: 'Framber Valdez', position: 'P', number: 59, stats: { era: '0.00' }, image: pImg(509), analysis: '頂級左投，曲球極品，滾地球製造率高，能有效壓制對手打線。' },
      { id: 'dom10', name: 'Cristian Javier', position: 'P', number: 53, stats: { era: '0.00' }, image: pImg(510), analysis: '擁有「隱形直球」，高轉速直球讓打者難以掌握，奪三振能力出色。' },
      { id: 'dom11', name: 'Camilo Doval', position: 'P', number: 75, stats: { era: '0.00' }, image: pImg(511), analysis: '火球男終結者，直球輕鬆飆破百英里，搭配犀利滑球，讓打者望球興嘆。' },
    ]
  },
  {
    id: 'ven',
    name: '委內瑞拉',
    group: 'D',
    logo: '🇻🇪',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 6,
    description: '南美強權，擁有強大的打擊火力與投手群。',
    players: [
      { id: 'ven1', name: 'Ronald Acuña Jr.', position: 'OF', number: 13, stats: { avg: '.000', hr: 0 }, image: pImg(731), analysis: '國聯MVP，擁有驚人的力量與速度，是委內瑞拉隊的核彈頭。' },
      { id: 'ven2', name: 'Jose Altuve', position: 'INF', number: 27, stats: { avg: '.000', hr: 0 }, image: pImg(732), analysis: '經驗豐富的安打機器，季後賽經驗豐富，是球隊的精神領袖。' },
      { id: 'ven3', name: 'Salvador Pérez', position: 'C', number: 13, stats: { avg: '.000', hr: 0 }, image: pImg(733), analysis: '鐵捕，長打能力優異，引導投手功力一流，是場上的指揮官。' },
      { id: 'ven4', name: 'Luis Arráez', position: 'INF', number: 2, stats: { avg: '.000', hr: 0 }, image: pImg(734), analysis: '打擊王，擊球技巧高超，不易被三振，能有效串聯攻勢。' },
      { id: 'ven5', name: 'Andrés Giménez', position: 'INF', number: 0, stats: { avg: '.000', hr: 0 }, image: pImg(735), analysis: '金手套二壘手，守備範圍廣，打擊穩定，具備速度優勢。' },
      { id: 'ven6', name: 'Pablo López', position: 'P', number: 49, stats: { era: '0.00' }, image: pImg(736), analysis: '穩定性高的先發投手，變速球極品，能有效壓制對手打線。' },
      { id: 'ven7', name: 'Martín Pérez', position: 'P', number: 54, stats: { era: '0.00' }, image: pImg(737), analysis: '經驗豐富的左投，滾地球製造機，能吃下長局數。' },
      { id: 'ven8', name: 'Anthony Santander', position: 'OF', number: 25, stats: { avg: '.000', hr: 0 }, image: pImg(738), analysis: '左右開弓的重砲手，長打爆發力強，是中心打線的關鍵人物。' },
    ]
  },
  {
    id: 'ned',
    name: '荷蘭',
    group: 'D',
    logo: '🇳🇱',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 7,
    description: '歐洲最強，擁有多位加勒比海出身的好手。',
    players: [
      { id: 'ned1', name: 'Xander Bogaerts', position: 'INF', number: 2, stats: { avg: '.000' }, image: pImg(741), analysis: '大聯盟頂級游擊手，攻守俱佳，是荷蘭隊的核心。' },
      { id: 'ned2', name: 'Jurickson Profar', position: 'OF', number: 10, stats: { avg: '.000' }, image: pImg(742), analysis: '工具人屬性，內外野皆可守，打擊穩定。' },
      { id: 'ned3', name: 'Kenley Jansen', position: 'P', number: 74, stats: { era: '0.00' }, image: pImg(743), analysis: '傳奇終結者，卡特球極具威力，是牛棚的定海神針。' },
      { id: 'ned4', name: 'Didi Gregorius', position: 'INF', number: 18, stats: { avg: '.000' }, image: pImg(744), analysis: '經驗豐富的游擊手，長打能力不錯，守備穩健。' },
      { id: 'ned5', name: 'Jonathan Schoop', position: 'INF', number: 6, stats: { avg: '.000' }, image: pImg(745), analysis: '二壘重砲，守備範圍廣，臂力強。' },
    ]
  },
  {
    id: 'isr',
    name: '以色列',
    group: 'D',
    logo: '🇮🇱',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 19,
    description: '猶太裔球星助陣，智慧與韌性兼具。',
    players: [
      { id: 'isr1', name: 'Joc Pederson', position: 'OF', number: 23, stats: { avg: '.000' }, image: pImg(841), analysis: '強力左打，長打爆發力強，季後賽經驗豐富。' },
      { id: 'isr2', name: 'Dean Kremer', position: 'P', number: 64, stats: { era: '0.00' }, image: pImg(842), analysis: '金鶯先發投手，曲球犀利，三振能力出色。' },
      { id: 'isr3', name: 'Garrett Stubbs', position: 'C', number: 21, stats: { avg: '.000' }, image: pImg(843), analysis: '替補捕手，守備穩健，具備速度優勢。' },
    ]
  },
  {
    id: 'nic',
    name: '尼加拉瓜',
    group: 'D',
    logo: '🇳🇮',
    winRate: 0,
    wins: 0,
    losses: 0,
    ranking: 17,
    description: '中美洲傳統勁旅，投手戰力堅強。',
    players: [
      { id: 'nic1', name: 'Jonathan Loáisiga', position: 'P', number: 43, stats: { era: '0.00' }, image: pImg(851), analysis: '洋基牛棚大將，伸卡球極具威力，能製造大量滾地球。' },
      { id: 'nic2', name: 'Erasmo Ramírez', position: 'P', number: 30, stats: { era: '0.00' }, image: pImg(852), analysis: '經驗豐富的投手，能勝任先發或中繼。' },
      { id: 'nic3', name: 'Cheslor Cuthbert', position: 'INF', number: 12, stats: { avg: '.000' }, image: pImg(853), analysis: '內野重砲，具備長打能力。' },
    ]
  },
];

// Matches with ISO times.
// Pool C: Tokyo (UTC+9) -> TW (UTC+8) is -1 hour.
// Pool A: San Juan (UTC-4) -> TW (UTC+8) is +12 hours.
// Pool B: Houston (UTC-6) -> TW (UTC+8) is +14 hours.
// Pool D: Miami (UTC-5) -> TW (UTC+8) is +13 hours.

export const MATCHES: Match[] = [
  // --- Pool C (Tokyo) - UTC+9 ---
  { 
    id: 'mc1', 
    homeTeamId: 'aus', 
    awayTeamId: 'tpe', 
    startTime: '2026-03-05T12:00:00+09:00', 
    status: MatchStatus.FINISHED,
    scores: { home: 3, away: 0 } // Australia shuts out Chinese Taipei 3-0
  },
  { 
    id: 'mc2', 
    homeTeamId: 'kor', 
    awayTeamId: 'cze', 
    startTime: '2026-03-05T19:00:00+09:00', 
    status: MatchStatus.LIVE,
    scores: { home: 10, away: 3 },
    liveData: {
      currentInning: '8局下',
      outs: 1,
      bases: [true, true, false], // Runners on 1st and 2nd based on visual cue estimate
      count: { b: 1, s: 2, o: 1 }
    }
  },
  { id: 'mc3', homeTeamId: 'cze', awayTeamId: 'aus', startTime: '2026-03-06T12:00:00+09:00', status: MatchStatus.SCHEDULED },
  { id: 'mc4', homeTeamId: 'tpe', awayTeamId: 'jpn', startTime: '2026-03-06T19:00:00+09:00', status: MatchStatus.SCHEDULED },
  { id: 'mc5', homeTeamId: 'cze', awayTeamId: 'tpe', startTime: '2026-03-07T12:00:00+09:00', status: MatchStatus.SCHEDULED },
  { id: 'mc6', homeTeamId: 'jpn', awayTeamId: 'kor', startTime: '2026-03-07T19:00:00+09:00', status: MatchStatus.SCHEDULED },
  { id: 'mc7', homeTeamId: 'kor', awayTeamId: 'tpe', startTime: '2026-03-08T12:00:00+09:00', status: MatchStatus.SCHEDULED },
  { id: 'mc8', homeTeamId: 'jpn', awayTeamId: 'aus', startTime: '2026-03-08T19:00:00+09:00', status: MatchStatus.SCHEDULED },
  { id: 'mc9', homeTeamId: 'aus', awayTeamId: 'kor', startTime: '2026-03-09T19:00:00+09:00', status: MatchStatus.SCHEDULED },
  { id: 'mc10', homeTeamId: 'jpn', awayTeamId: 'cze', startTime: '2026-03-10T19:00:00+09:00', status: MatchStatus.SCHEDULED },

  // --- Pool A (San Juan) - UTC-4 ---
  { id: 'ma1', homeTeamId: 'pan', awayTeamId: 'cub', startTime: '2026-03-06T12:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma2', homeTeamId: 'col', awayTeamId: 'pur', startTime: '2026-03-06T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma3', homeTeamId: 'can', awayTeamId: 'col', startTime: '2026-03-07T12:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma4', homeTeamId: 'pur', awayTeamId: 'pan', startTime: '2026-03-07T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma5', homeTeamId: 'cub', awayTeamId: 'col', startTime: '2026-03-08T12:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma6', homeTeamId: 'can', awayTeamId: 'pan', startTime: '2026-03-08T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma7', homeTeamId: 'pan', awayTeamId: 'col', startTime: '2026-03-09T12:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma8', homeTeamId: 'pur', awayTeamId: 'cub', startTime: '2026-03-09T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma9', homeTeamId: 'pur', awayTeamId: 'can', startTime: '2026-03-10T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'ma10', homeTeamId: 'cub', awayTeamId: 'can', startTime: '2026-03-11T15:00:00-04:00', status: MatchStatus.SCHEDULED },

  // --- Pool B (Houston) - UTC-6 (Standard), UTC-5 (DST from Mar 8) ---
  { id: 'mb1', homeTeamId: 'gbr', awayTeamId: 'mex', startTime: '2026-03-06T12:00:00-06:00', status: MatchStatus.SCHEDULED },
  { id: 'mb2', homeTeamId: 'bra', awayTeamId: 'usa', startTime: '2026-03-06T19:00:00-06:00', status: MatchStatus.SCHEDULED },
  { id: 'mb3', homeTeamId: 'ita', awayTeamId: 'bra', startTime: '2026-03-07T12:00:00-06:00', status: MatchStatus.SCHEDULED },
  { id: 'mb4', homeTeamId: 'usa', awayTeamId: 'gbr', startTime: '2026-03-07T19:00:00-06:00', status: MatchStatus.SCHEDULED },
  { id: 'mb5', homeTeamId: 'ita', awayTeamId: 'gbr', startTime: '2026-03-08T12:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'mb6', homeTeamId: 'mex', awayTeamId: 'bra', startTime: '2026-03-08T19:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'mb7', homeTeamId: 'gbr', awayTeamId: 'bra', startTime: '2026-03-09T12:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'mb8', homeTeamId: 'usa', awayTeamId: 'mex', startTime: '2026-03-09T19:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'mb9', homeTeamId: 'usa', awayTeamId: 'ita', startTime: '2026-03-10T20:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'mb10', homeTeamId: 'mex', awayTeamId: 'ita', startTime: '2026-03-11T18:00:00-05:00', status: MatchStatus.SCHEDULED },

  // --- Pool D (Miami) - UTC-5 (Standard), UTC-4 (DST from Mar 8) ---
  { id: 'md1', homeTeamId: 'ven', awayTeamId: 'ned', startTime: '2026-03-06T12:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'md2', homeTeamId: 'dom', awayTeamId: 'nic', startTime: '2026-03-06T19:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'md3', homeTeamId: 'ned', awayTeamId: 'nic', startTime: '2026-03-07T12:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'md4', homeTeamId: 'ven', awayTeamId: 'isr', startTime: '2026-03-07T19:00:00-05:00', status: MatchStatus.SCHEDULED },
  { id: 'md5', homeTeamId: 'dom', awayTeamId: 'ned', startTime: '2026-03-08T12:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'md6', homeTeamId: 'isr', awayTeamId: 'nic', startTime: '2026-03-08T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'md7', homeTeamId: 'isr', awayTeamId: 'dom', startTime: '2026-03-09T12:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'md8', homeTeamId: 'nic', awayTeamId: 'ven', startTime: '2026-03-09T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'md9', homeTeamId: 'ned', awayTeamId: 'isr', startTime: '2026-03-10T19:00:00-04:00', status: MatchStatus.SCHEDULED },
  { id: 'md10', homeTeamId: 'ven', awayTeamId: 'dom', startTime: '2026-03-11T20:00:00-04:00', status: MatchStatus.SCHEDULED },
];

export const MOCK_STATS_LEADERBOARD = {
  batting: [
    { name: '金河成', team: '🇰🇷', stat: '.667', category: 'AVG' },
    { name: 'Robbie Glendinning', team: '🇦🇺', stat: '.500', category: 'AVG' },
    { name: 'Marek Chlup', team: '🇨🇿', stat: '.400', category: 'AVG' },
    { name: '李政厚', team: '🇰🇷', stat: '.333', category: 'AVG' },
    { name: 'Aaron Whitefield', team: '🇦🇺', stat: '.333', category: 'AVG' },
  ],
  homeruns: [
    { name: '金河成', team: '🇰🇷', stat: '1', category: 'HR' },
    { name: 'Robbie Glendinning', team: '🇦🇺', stat: '1', category: 'HR' },
    { name: 'Marek Chlup', team: '🇨🇿', stat: '1', category: 'HR' },
    { name: '姜白虎', team: '🇰🇷', stat: '1', category: 'HR' },
    { name: 'Tim Kennelly', team: '🇦🇺', stat: '0', category: 'HR' },
  ],
  pitching: [
    { name: 'Warwick Saupold', team: '🇦🇺', stat: '0.00', category: 'ERA' },
    { name: 'Liam Hendriks', team: '🇦🇺', stat: '0.00', category: 'ERA' },
    { name: '高佑錫', team: '🇰🇷', stat: '0.00', category: 'ERA' },
    { name: '古林睿煬', team: '🇹🇼', stat: '3.00', category: 'ERA' },
    { name: 'Ondrej Satoria', team: '🇨🇿', stat: '4.50', category: 'ERA' },
  ]
};
