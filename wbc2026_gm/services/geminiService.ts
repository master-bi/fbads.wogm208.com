import { GoogleGenAI, Type } from "@google/genai";
import { PredictionData, Team } from "../types";

// NOTE: In a real app, API key should not be exposed on client side directly if not restricted.
// The prompt instructions specify usage of process.env.API_KEY.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const predictScores = async (homeTeam: Team, awayTeam: Team): Promise<PredictionData> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock prediction.");
    return mockPrediction(homeTeam, awayTeam);
  }

  const model = "gemini-3-flash-preview";
  
  const formatPlayer = (p: any) => {
    let statsStr = '';
    if (p.stats) {
      if (p.position === 'P') {
        statsStr = `ERA: ${p.stats.era}, SO: ${p.stats.so || 'N/A'}`;
      } else {
        statsStr = `AVG: ${p.stats.avg}, HR: ${p.stats.hr}`;
      }
    }
    return `${p.name} (${p.position}) [${statsStr}]`;
  };

  const homePlayers = homeTeam.players.slice(0, 9).map(formatPlayer).join('\n    - ');
  const awayPlayers = awayTeam.players.slice(0, 9).map(formatPlayer).join('\n    - ');

  const prompt = `
    你是一位世界棒球經典賽(WBC)的頂尖數據分析師。
    請針對 2026 WBC 賽事：${homeTeam.name} (主場) vs ${awayTeam.name} (客場) 進行"高準確度"的勝負預測。
    
    【賽事背景】
    - 地點：主場優勢 (${homeTeam.name})
    - 重要性：小組賽關鍵戰役
    
    【隊伍數據與核心球員】
    主隊: ${homeTeam.name} (世界排名: ${homeTeam.ranking})
    - 球風: ${homeTeam.description}
    - 核心陣容:
    - ${homePlayers}
    
    客隊: ${awayTeam.name} (世界排名: ${awayTeam.ranking})
    - 球風: ${awayTeam.description}
    - 核心陣容:
    - ${awayPlayers}
    
    請回傳 JSON 格式 (嚴禁 Markdown):
    {
      "homeScore": integer,
      "awayScore": integer,
      "confidence": integer (0-100),
      "winProbability": { "home": integer, "away": integer }
    }
  `;

  try {
    console.log("Generating scores with Gemini...");
    
    // 15-second timeout for fast "Stage 1" response
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 15000)
    );

    const apiCall = ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 200, // Limit tokens for speed
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            homeScore: { type: Type.INTEGER },
            awayScore: { type: Type.INTEGER },
            confidence: { type: Type.INTEGER },
            winProbability: {
              type: Type.OBJECT,
              properties: {
                home: { type: Type.INTEGER },
                away: { type: Type.INTEGER }
              }
            }
          }
        }
      }
    });

    const response = await Promise.race([apiCall, timeoutPromise]) as any;

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    // Clean JSON text (remove markdown code blocks if present)
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const data = JSON.parse(cleanText);

    return {
      ...data,
      model: model,
      generatedAt: new Date().toISOString(),
      isMock: false
    };
  } catch (error) {
    console.warn("Gemini API Error or Timeout (Scores), falling back to mock:", error);
    return mockPrediction(homeTeam, awayTeam);
  }
};

export const analyzeMatch = async (homeTeam: Team, awayTeam: Team, scoreData: PredictionData): Promise<Partial<PredictionData>> => {
  if (!apiKey) return {};

  const model = "gemini-3-flash-preview";
  
  const formatPlayer = (p: any) => {
    let statsStr = '';
    if (p.stats) {
      if (p.position === 'P') {
        statsStr = `ERA: ${p.stats.era}, SO: ${p.stats.so || 'N/A'}`;
      } else {
        statsStr = `AVG: ${p.stats.avg}, HR: ${p.stats.hr}`;
      }
    }
    return `${p.name} (${p.position}) [${statsStr}]`;
  };

  const homePlayers = homeTeam.players.slice(0, 9).map(formatPlayer).join('\n    - ');
  const awayPlayers = awayTeam.players.slice(0, 9).map(formatPlayer).join('\n    - ');

  const prompt = `
    你是一位世界棒球經典賽(WBC)的頂尖數據分析師。
    請針對 2026 WBC 賽事：${homeTeam.name} (主場) vs ${awayTeam.name} (客場) 進行"專業且精闢"的戰術分析。
    
    【預測結果】
    - 比分: ${homeTeam.name} ${scoreData.homeScore} : ${scoreData.awayScore} ${awayTeam.name}
    - 勝率: ${homeTeam.name} ${scoreData.winProbability.home}% vs ${awayTeam.name} ${scoreData.winProbability.away}%
    
    【隊伍數據與核心球員】
    主隊: ${homeTeam.name}
    - 球風: ${homeTeam.description}
    - 核心陣容:
    - ${homePlayers}
    
    客隊: ${awayTeam.name}
    - 球風: ${awayTeam.description}
    - 核心陣容:
    - ${awayPlayers}
    
    【分析要求】
    1. **即時且具體**：請"嚴格"根據上述提供的球員名單與數據進行分析，禁止使用通用的模板文字。
    2. **數據導向**：請高度重視球員的個人數據（如 ERA, AVG, HR），並將其作為分析的核心依據，務必在分析中引用具體數據。
    3. **關鍵對決**：請挑選出最具影響力的投打對決，並說明原因（例如：左投剋左打、速球對決等）。
    4. **避免重複**：請確保每個分析區塊的內容不重複，且具有獨到的見解。
    5. **專業完整**：請提供完整且專業的分析，嚴禁使用省略號(...)或截斷句子。
    6. **獨立分析**：請針對這場比賽的獨特性進行分析，不要使用"這是一場勢均力敵的對決"這類空泛的開頭。
    7. **精簡扼要**：請用最精鍊的文字表達，避免冗長的鋪陳。每一句話都必須包含具體的分析觀點或數據，拒絕廢話。
    8. **嚴禁後設語言**：禁止使用「分析完畢」、「描述結束」、「結果呈現」等後設語言，直接給出分析內容即可。
    
    請回傳 JSON 格式 (嚴禁 Markdown):
    {
      "summary": string (精簡總結這場比賽的走勢，請直接切入重點，不要廢話，限 4 句話以內，務必以完整句號結尾),
      "keyMatchups": string[] (3組關鍵對決，需包含具體球員姓名與對決看點),
      "winningFactor": string (請以「精鍊、高密度」的文字分析致勝關鍵。限 4 句話以內。務必以完整句號結尾，禁止中斷),
      "detailedAnalysis": {
        "pitchingAnalysis": string (投手戰力重點分析，包含先發與牛棚，勿冗長，限 4 句話以內，務必以完整句號結尾),
        "battingAnalysis": string (打擊火力重點分析，包含中心打線與得點圈，勿冗長，限 4 句話以內，務必以完整句號結尾),
        "tacticalAnalysis": string (戰術運用重點分析，包含盜壘與守備佈陣，勿冗長，限 4 句話以內，務必以完整句號結尾),
        "recentFormAnalysis": string (近期狀態重點分析，包含熱身賽表現與傷病，勿冗長，限 4 句話以內，務必以完整句號結尾),
        "historyAnalysis": string (過往交手紀錄與心理優勢，勿冗長，限 4 句話以內，務必以完整句號結尾)
      }
    }
    
    請確保所有字串內的引號與換行都已正確跳脫，以符合 JSON 格式規範。
  `;

  try {
    let retryCount = 0;
    const maxRetries = 3;
    let text = '';

    while (retryCount < maxRetries) {
      try {
        console.log(`Generating analysis with Gemini (Attempt ${retryCount + 1})...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.2, // Lowered to 0.2 for maximum stability
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000, // Increased to 3000 to allow for 5 sentences
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyMatchups: { type: Type.ARRAY, items: { type: Type.STRING } },
                winningFactor: { type: Type.STRING },
                detailedAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    pitchingAnalysis: { type: Type.STRING },
                    battingAnalysis: { type: Type.STRING },
                    tacticalAnalysis: { type: Type.STRING },
                    recentFormAnalysis: { type: Type.STRING },
                    historyAnalysis: { type: Type.STRING }
                  }
                }
              }
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
            ]
          }
        });

        text = response.text;
        if (text) break;
        
        console.warn(`Attempt ${retryCount + 1} failed: Empty response text.`);
      } catch (e) {
        console.warn(`Attempt ${retryCount + 1} failed with error:`, e);
      }
      retryCount++;
      if (retryCount < maxRetries) await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!text) throw new Error("Empty analysis response after retries");

    // Clean JSON text (remove markdown code blocks if present)
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Helper to remove repetitive loops from text
    const removeRepetitiveText = (text: string): string => {
      if (!text) return text;
      
      // 1. Remove specific hallucinated meta-phrases that often trigger loops
      let clean = text.replace(/內容細節描述完畢/g, '')
                      .replace(/結果呈現/g, '')
                      .replace(/分析結果顯示/g, '')
                      .replace(/數據模型推演/g, '');

      // 2. Aggressive consecutive loop removal (standard regex)
      clean = clean.replace(/(.{5,})(?:\1)+/g, '$1');

      // 3. Sentence-level deduplication (Fixes A.B.A.B loops)
      // Split by common Chinese/English punctuation
      const sentences = clean.split(/([。！？.!?])/);
      const uniqueSentences = new Set<string>();
      let result = "";

      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i];
        const punctuation = sentences[i + 1] || "";
        
        const trimmed = sentence.trim();
        if (trimmed.length > 0 && !uniqueSentences.has(trimmed)) {
          uniqueSentences.add(trimmed);
          result += sentence + punctuation;
        }
      }
      
      return result || clean; // Fallback to clean if result is empty
    };

    // Helper to ensure text ends naturally with punctuation
    const ensureNaturalEnding = (text: string): string => {
      if (!text) return text;
      const trimmed = text.trim();
      // Check if ends with punctuation (Chinese or English)
      if (/[.!?。！？]$/.test(trimmed)) {
        return trimmed;
      }
      
      // If not, find the last punctuation to cut off the incomplete sentence
      const lastPunctuationIndex = Math.max(
        trimmed.lastIndexOf('。'),
        trimmed.lastIndexOf('！'),
        trimmed.lastIndexOf('？'),
        trimmed.lastIndexOf('.'),
        trimmed.lastIndexOf('!'),
        trimmed.lastIndexOf('?')
      );

      if (lastPunctuationIndex > 0) {
        return trimmed.substring(0, lastPunctuationIndex + 1);
      }
      
      // If no punctuation found at all, just append a period
      return trimmed + "。";
    };

    // Helper to enforce hard length limits
    const enforceLengthLimit = (text: string, maxLength: number): string => {
      if (!text || text.length <= maxLength) return text;
      let truncated = text.substring(0, maxLength);
      return ensureNaturalEnding(truncated);
    };

    let data;
    try {
      data = JSON.parse(cleanText);
    } catch (parseError) {
      console.warn("JSON parse failed, attempting to repair truncated JSON...", parseError);
      // Simple repair attempt for truncated JSON
      let repairedText = cleanText;
      
      // Check if we are inside a string (odd number of unescaped quotes)
      const quoteCount = (repairedText.match(/(?<!\\)"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        repairedText += '"';
      }
      
      // Close open braces/brackets
      const openBraces = (repairedText.match(/\{/g) || []).length;
      const closeBraces = (repairedText.match(/\}/g) || []).length;
      const openBrackets = (repairedText.match(/\[/g) || []).length;
      const closeBrackets = (repairedText.match(/\]/g) || []).length;
      
      for (let i = 0; i < openBrackets - closeBrackets; i++) repairedText += ']';
      for (let i = 0; i < openBraces - closeBraces; i++) repairedText += '}';
      
      try {
        data = JSON.parse(repairedText);
        console.log("JSON repaired successfully.");
      } catch (repairError) {
        console.error("JSON repair failed:", repairError);
        throw parseError; // Throw original error if repair fails
      }
    }

    // Post-process fields to remove potential repetitions (Apply to data regardless of source)
    if (data) {
      if (data.winningFactor) {
        data.winningFactor = removeRepetitiveText(data.winningFactor);
        data.winningFactor = enforceLengthLimit(data.winningFactor, 500);
      }
      if (data.summary) {
        data.summary = removeRepetitiveText(data.summary);
        data.summary = enforceLengthLimit(data.summary, 500);
      }
      if (data.detailedAnalysis) {
        for (const key in data.detailedAnalysis) {
          if (typeof data.detailedAnalysis[key] === 'string') {
            data.detailedAnalysis[key] = removeRepetitiveText(data.detailedAnalysis[key]);
            data.detailedAnalysis[key] = enforceLengthLimit(data.detailedAnalysis[key], 500);
          }
        }
      }
    }

    return { ...data, isMock: false };
  } catch (error) {
    console.error("Gemini API Error (Analysis):", error);
    // Fallback to mock analysis on error
    const mock = mockPrediction(homeTeam, awayTeam);
    return {
      summary: mock.summary,
      keyMatchups: mock.keyMatchups,
      winningFactor: mock.winningFactor,
      detailedAnalysis: mock.detailedAnalysis,
      isMock: true
    };
  }
};

// Keep predictMatch for backward compatibility if needed, but we will update App.tsx to use the new functions
export const predictMatch = async (homeTeam: Team, awayTeam: Team): Promise<PredictionData> => {
    const scores = await predictScores(homeTeam, awayTeam);
    const analysis = await analyzeMatch(homeTeam, awayTeam, scores);
    return { ...scores, ...analysis };
};

const mockPrediction = (home: Team, away: Team): PredictionData => {
  // Deterministic "random" based on team IDs to ensure consistent results for the same matchup
  const seed = home.id.charCodeAt(0) + away.id.charCodeAt(0) + home.ranking + away.ranking;
  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  // Calculate realistic score based on ranking
  // Lower ranking is better. 
  const rankDiff = away.ranking - home.ranking; // Positive if Home is better (lower rank)
  
  let homeScore = 2 + Math.floor(pseudoRandom(1) * 5); // Base 2-6 runs
  let awayScore = 2 + Math.floor(pseudoRandom(2) * 5);
  
  // Adjust score by rank
  if (rankDiff > 5) homeScore += 2;
  else if (rankDiff < -5) awayScore += 2;
  
  // Ensure no tie for prediction fun
  if (homeScore === awayScore) {
    if (rankDiff > 0) homeScore++;
    else awayScore++;
  }

  const totalScore = homeScore + awayScore;
  const homeWinProb = Math.min(90, Math.max(10, 50 + rankDiff * 1.5));
  const awayWinProb = 100 - homeWinProb;

  // Pick realistic key players
  const hPlayer1 = home.players[0]?.name || home.name + "王牌";
  const hPlayer2 = home.players[1]?.name || home.name + "重砲";
  const aPlayer1 = away.players[0]?.name || away.name + "王牌";
  const aPlayer2 = away.players[1]?.name || away.name + "重砲";

  const matchups = [
    `${hPlayer1} (P) vs ${aPlayer2} (DH)`,
    `${aPlayer1} (P) vs ${hPlayer2} (INF)`,
    `牛棚決勝: ${home.name} vs ${away.name}`
  ];

  const homeAdvantage = home.ranking < away.ranking ? '主隊略佔優勢' : '勢均力敵';
  const gameType = totalScore > 8 ? '火力四射的打擊戰' : '張力十足的投手戰';
  
  const summaryTemplates = [
    `這是一場${homeAdvantage}的對決。${home.name}的${home.description}將是比賽的關鍵變數，特別是${hPlayer1}的表現至關重要。另一方面，${away.name}必須依靠${aPlayer1}的發揮來尋求突破，並利用${aPlayer2}的長打能力製造得分機會。預期這將是一場${gameType}，雙方牛棚的穩定性將決定最終勝負。`,
    `本場焦點在於${home.name}能否發揮主場優勢壓制${away.name}的${aPlayer2}。在${gameType}的預期下，雙方教練團的臨場調度將是決定勝負的分水嶺。`,
    `${home.name}近期氣勢如虹，但${away.name}的${aPlayer1}絕非省油的燈。這場比賽將嚴格考驗${home.name}打線對抗頂級投手的應變能力，關鍵在於能否突破封鎖。`,
    `雖然外界普遍看好${homeScore > awayScore ? home.name : away.name}，但${homeScore > awayScore ? away.name : home.name}若能減少失誤，仍有機會爆冷翻盤。${gameType}的走勢將讓比賽充滿懸念直到最後一刻。`,
    `這場${home.name}與${away.name}的對決，關鍵在於${hPlayer2}能否在得點圈有人時建功。${away.name}的投手群近期略顯疲態，若無法有效控制失分，恐將陷入苦戰。`
  ];

  // Helper to pick a random template based on seed
  const pick = (options: string[], seedOffset: number) => {
    const index = Math.floor(pseudoRandom(seedOffset) * options.length);
    return options[index];
  };

  const summary = pick(summaryTemplates, 5);

  // 1. Pitching Analysis Templates
  const pitchingTemplates = [
    `${home.name}的先發輪值在${hPlayer1}的帶領下展現出極高的穩定性，特別是針對右打者的壓制力相當出色。相對地，${away.name}的投手群近期控球略顯不穩，若無法有效搶下好球數，可能會陷入苦戰。`,
    `${away.name}擁有令人稱羨的強力牛棚，這將是他們在比賽後段決勝的關鍵籌碼。${home.name}則必須仰賴先發投手盡可能拉長局數，避免過早消耗牛棚戰力。`,
    `這場比賽將是兩隊王牌投手的正面對決。${hPlayer1}的球威與${aPlayer1}的變化球運用將決定比賽前段的走向。預期雙方都會採取精兵政策，投手調度將會相當頻繁。`,
    `${home.name}的投手群近期防禦率維持在高檔，特別是得點圈有人的危機處理能力極佳。${away.name}則需要留意中繼投手的銜接問題，避免在比賽中段被對手一波帶走。`
  ];

  // 2. Batting Analysis Templates
  const battingTemplates = [
    `${away.name}的中心打線破壞力十足，${aPlayer2}與${aPlayer1}的串聯將是得分之鑰。${home.name}則擅長利用速度壓迫對手防線，戰術執行成功率將是觀察重點。`,
    `${home.name}近期打擊手感火燙，團隊上壘率極高，能給予對手投手極大的壓力。${away.name}則擁有${aPlayer2}這位一棒擊沉對手的重砲，隨時可能改變比賽戰局。`,
    `兩隊的打擊風格截然不同，${home.name}講求擊球確實與戰術推進，${away.name}則偏向美式強力棒球風格。誰能掌握比賽節奏，誰就能在打擊戰中佔據優勢。`,
    `關鍵在於${home.name}能否有效突破${away.name}的封鎖。${hPlayer2}近期的長打表現將是關鍵指標。${away.name}的後段棒次近期也有不錯的發揮，不容小覷。`
  ];

  // 3. Tactical Analysis Templates
  const tacticalTemplates = [
    `${home.name}教練團向來以戰術靈活著稱，預期會有頻繁的打帶跑與盜壘嘗試，試圖擾亂${away.name}的投捕搭檔。${away.name}則可能採取穩紮穩打的策略，等待對手犯錯。`,
    `${away.name}在防守佈陣上相當靈活，針對${home.name}的強力左打者會有特殊的站位調整。${home.name}則需在壘間展現侵略性，利用速度優勢撕裂對手防線。`,
    `這場比賽的勝負可能取決於細節的執行。${home.name}在短打推進與高飛犧牲打的把握度較高，這在低比分的比賽中將是巨大優勢。${away.name}則需避免不必要的守備失誤。`,
    `預期${away.name}會針對${home.name}的中心打者採取較為閃躲的配球策略，甚至不排除在關鍵時刻使用敬遠戰術。${home.name}的教練團需適時做出代打調度來回應。`
  ];

  // 4. Recent Form Analysis Templates
  const recentFormTemplates = [
    `${home.name}在熱身賽中展現了強大的韌性，多次在比賽後段逆轉戰局，士氣正高昂。${away.name}雖然近期勝少敗多，但主力球員的狀態正在加溫，不容忽視。`,
    `${away.name}近期拉出一波連勝氣勢，投打磨合已臻完美境界。反觀${home.name}近期傷兵問題浮現，板凳深度將面臨嚴峻考驗。`,
    `兩隊近期的狀態都在伯仲之間，${home.name}的主場戰績相當亮眼，這將是他們最大的優勢。${away.name}則在客場作戰時展現出極高的抗壓性。`,
    `${home.name}的打線近期陷入小低潮，急需一場勝利來提振士氣。${away.name}的投手群則剛經歷高強度的連戰，體能調節將是隱憂。`
  ];

  // 5. History Analysis Templates
  const historyTemplates = [
    `翻開過往交手紀錄，${home.name}在主場對戰${away.name}擁有極高的勝率，心理層面佔據上風。但${away.name}近年來實力大幅提升，已非吳下阿蒙。`,
    `雙方過去幾次在國際賽的碰頭都打得難分難解，且多以一分差分出勝負。這將是一場宿命的對決，誰能減少失誤誰就能笑到最後。`,
    `${away.name}曾在上屆賽事中擊敗過${home.name}，這場比賽勢必充滿復仇的火藥味。${home.name}勢必會精銳盡出，力求討回顏面。`,
    `兩隊在WBC的歷史上交手次數不多，彼此都還在試探階段。臨場的應變能力與情蒐資料的完整度，將決定這場陌生對決的勝負。`
  ];

  return {
    homeScore,
    awayScore,
    confidence: 70 + Math.floor(pseudoRandom(3) * 20),
    model: 'Simulated (Analysis)',
    generatedAt: new Date().toISOString(),
    summary,
    keyMatchups: matchups,
    winningFactor: homeScore > awayScore ? `${home.name}的主場優勢與投手壓制力` : `${away.name}的關鍵一擊與韌性`,
    winProbability: { 
      home: Math.round(homeWinProb), 
      away: Math.round(awayWinProb) 
    },
    detailedAnalysis: {
      pitchingAnalysis: pick(pitchingTemplates, 10),
      battingAnalysis: pick(battingTemplates, 20),
      tacticalAnalysis: pick(tacticalTemplates, 30),
      recentFormAnalysis: pick(recentFormTemplates, 40),
      historyAnalysis: pick(historyTemplates, 50)
    },
    isMock: true
  };
};