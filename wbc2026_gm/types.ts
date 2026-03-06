export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED'
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  stats: {
    avg?: string;
    hr?: number;
    era?: string;
    so?: number;
    ops?: string;
  };
  image: string;
  analysis?: string; // AI generated description
  careerStats?: {
    year: number;
    team: string;
    g: number;
    avg?: string;
    hr?: number;
    era?: string;
    w?: number;
    sv?: number;
    ops?: string;
  }[];
  achievements?: string[];
}

export interface Team {
  id: string;
  name: string;
  group: string;
  logo: string;
  winRate: number; // For ranking
  wins: number;
  losses: number;
  players: Player[];
  description: string;
  ranking: number;
}

export interface PredictionData {
  homeScore: number;
  awayScore: number;
  confidence: number;
  model: string;
  generatedAt: string;
  summary?: string;
  keyMatchups?: string[];
  winningFactor?: string;
  winProbability: {
    home: number;
    away: number;
  };
  detailedAnalysis?: {
    pitchingAnalysis: string;
    battingAnalysis: string;
    tacticalAnalysis: string;
    recentFormAnalysis: string;
    historyAnalysis: string;
  };
  isMock?: boolean;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  startTime: string; // ISO string
  status: MatchStatus;
  scores?: {
    home: number;
    away: number;
    innings?: number[]; // For live/finished
  };
  stats?: {
    home: { hits: number; errors: number };
    away: { hits: number; errors: number };
  };
  liveData?: {
    currentInning: string; // "Top 7"
    outs: number;
    bases: [boolean, boolean, boolean]; // 1st, 2nd, 3rd
    pitcher?: string;
    batter?: string;
    count: { b: number; s: number; o: number };
  };
  aiPrediction?: PredictionData; // Existing prediction (for finished matches comparison)
}

export enum ViewState {
  HOME = 'HOME',
  STANDINGS = 'STANDINGS',
  TEAMS = 'TEAMS',
  MATCHES = 'MATCHES',
  STATS = 'STATS'
}