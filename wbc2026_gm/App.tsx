import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart2, 
  Activity, 
  ChevronRight, 
  Play, 
  Info,
  ArrowUp,
  BrainCircuit,
  X,
  RefreshCw,
  Zap,
  Target,
  Database,
  Search
} from 'lucide-react';
import { Team, Player, Match, MatchStatus, ViewState, PredictionData } from './types';
import { TEAMS, MATCHES, MOCK_STATS_LEADERBOARD } from './constants';
import { predictScores, analyzeMatch } from './services/geminiService';

// --- Components ---

const Navbar = ({ active, setActive }: { active: ViewState, setActive: (v: ViewState) => void }) => {
  const items = [
    { id: ViewState.HOME, label: '首頁', icon: <Trophy size={18} /> },
    { id: ViewState.STANDINGS, label: '分組戰績', icon: <BarChart2 size={18} /> },
    { id: ViewState.TEAMS, label: '球隊', icon: <Users size={18} /> },
    { id: ViewState.MATCHES, label: '比賽', icon: <Calendar size={18} /> },
    { id: ViewState.STATS, label: '即時數據', icon: <Activity size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-sm">WBC</span>
            </div>
            <span className="font-bold text-xl text-white tracking-wide">2026 預測戰</span>
          </div>
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  active === item.id 
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Card: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-xl shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const PredictionModal = ({ match, onClose }: { match: Match, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loadingText, setLoadingText] = useState("正在初始化 AI 模型...");
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);

  const homeTeam = TEAMS.find(t => t.id === match.homeTeamId)!;
  const awayTeam = TEAMS.find(t => t.id === match.awayTeamId)!;

  // Effect to simulate analysis steps for visual feedback
  useEffect(() => {
    if (loading || analyzing) {
      const interval = setInterval(() => {
        setAnalysisStep(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading, analyzing]);

  const loadPrediction = async () => {
    setLoading(true);
    setPrediction(null);
    setAnalyzing(false);
    setProgress(0);
    
    try {
      // Stage 1: Fast scores
      const scores = await predictScores(homeTeam, awayTeam);
      setPrediction(scores);
      setLoading(false);
      setProgress(100);

      // Stage 2: Detailed analysis (Only for non-finished matches)
      if (match.status !== MatchStatus.FINISHED) {
        setAnalyzing(true);
        const analysis = await analyzeMatch(homeTeam, awayTeam, scores);
        setPrediction(prev => prev ? { ...prev, ...analysis } : null);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      setLoading(false);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    loadPrediction();
  }, [match.id]);

  // Dynamic loading text and progress simulation
  useEffect(() => {
    if (loading) {
      const texts = [
        `正在分析 ${homeTeam.name} 近期數據...`,
        `正在評估 ${awayTeam.name} 投手戰力...`,
        "正在模擬 10,000 場投打對決...",
        "正在計算勝率與比分模型...",
        "AI 戰情室生成報告中..."
      ];
      let step = 0;
      
      // Text cycle
      const textInterval = setInterval(() => {
        step = (step + 1) % texts.length;
        setLoadingText(texts[step]);
      }, 1500);

      // Progress bar simulation (up to 90%)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          // Non-linear progress for realism
          const increment = Math.max(1, Math.floor(Math.random() * 5)); 
          return Math.min(90, prev + increment);
        });
      }, 200);

      return () => {
        clearInterval(textInterval);
        clearInterval(progressInterval);
      };
    }
  }, [loading, homeTeam.name, awayTeam.name]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Analyzing Progress Bar (Top) */}
        {analyzing && !loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 z-20">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-progress-indeterminate"></div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center space-x-2 text-cyan-400">
            <BrainCircuit size={24} className={analyzing ? "animate-pulse" : ""} />
            <h2 className="text-xl font-bold text-white">AI 賽前權威分析</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12 space-y-8 relative overflow-hidden min-h-[400px]">
              
              {/* Background Data Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                 {[...Array(8)].map((_, i) => (
                    <div key={i} 
                         className="absolute text-cyan-500/40 font-mono text-[10px] animate-float flex items-center gap-1"
                         style={{
                           top: `${10 + Math.random() * 80}%`,
                           left: `${10 + Math.random() * 80}%`,
                           animationDelay: `${Math.random() * 2}s`,
                           animationDuration: `${3 + Math.random() * 3}s`
                         }}>
                       {i % 4 === 0 && <Activity size={10} />}
                       {i % 4 === 1 && <BarChart2 size={10} />}
                       {i % 4 === 2 && <Database size={10} />}
                       {i % 4 === 3 && <Search size={10} />}
                       {['ERA', 'OPS', 'WHIP', 'AVG', 'HR', 'SO', 'WAR', 'BABIP'][i]}
                    </div>
                 ))}
              </div>

              {/* Central Visualization */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                 {/* Radar/Scanner Effect */}
                 <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                 <div className="absolute inset-12 border border-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
                 
                 {/* Rotating Metrics Ring */}
                 <div className="absolute inset-0 animate-spin-slow pointer-events-none">
                    {[0, 90, 180, 270].map((deg, i) => (
                       <div key={i} 
                            className={`absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 flex items-center justify-center bg-slate-900 border border-slate-700 rounded-full shadow-lg transition-all duration-500 ${analysisStep === i ? 'scale-125 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'opacity-50'}`}
                            style={{ transform: `rotate(${deg}deg) translate(100px) rotate(-${deg}deg)` }}>
                          {i === 0 && <Activity size={16} className={analysisStep === i ? "text-green-400" : "text-slate-500"} />}
                          {i === 1 && <BarChart2 size={16} className={analysisStep === i ? "text-blue-400" : "text-slate-500"} />}
                          {i === 2 && <Zap size={16} className={analysisStep === i ? "text-yellow-400" : "text-slate-500"} />}
                          {i === 3 && <Target size={16} className={analysisStep === i ? "text-red-400" : "text-slate-500"} />}
                       </div>
                    ))}
                 </div>

                 {/* Connecting Lines */}
                 <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full opacity-20">
                       <line x1="50%" y1="50%" x2="50%" y2="10%" stroke="currentColor" className="text-cyan-500" strokeDasharray="4 4" />
                       <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="currentColor" className="text-cyan-500" strokeDasharray="4 4" />
                       <line x1="50%" y1="50%" x2="50%" y2="90%" stroke="currentColor" className="text-cyan-500" strokeDasharray="4 4" />
                       <line x1="50%" y1="50%" x2="10%" y2="50%" stroke="currentColor" className="text-cyan-500" strokeDasharray="4 4" />
                    </svg>
                 </div>

                 {/* Center Brain */}
                 <div className="relative z-10 bg-slate-900 p-6 rounded-full border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center">
                    <BrainCircuit size={48} className="text-cyan-400 animate-pulse mb-2" />
                    <div className="text-[10px] text-cyan-300/70 font-mono animate-pulse">AI PROCESSING</div>
                 </div>
              </div>
              
              <div className="w-full max-w-xs space-y-4 text-center z-10">
                <div className="h-8">
                  <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse transition-all duration-300">
                    {loadingText}
                  </h3>
                </div>
                
                {/* Dynamic Analysis Step Text */}
                <div className="text-xs text-slate-400 h-4 transition-opacity duration-300">
                   {analysisStep === 0 && "正在分析球員近期狀態數據..."}
                   {analysisStep === 1 && "正在模擬投打對決情境..."}
                   {analysisStep === 2 && "正在計算歷史交手勝率..."}
                   {analysisStep === 3 && "正在整合關鍵致勝因子..."}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700 relative">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>System Status: ONLINE</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          ) : prediction ? (
            <>
              {/* Score Prediction */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-xs text-slate-500 opacity-50 font-mono">
                  Model: {prediction.model}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">總分預測</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                    信心指數: {prediction.confidence}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center w-1/3">
                    <div className="text-4xl font-black text-white">{prediction.awayScore}</div>
                    <div className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
                      <span>{awayTeam.logo}</span>
                      <span>{awayTeam.name}</span>
                    </div>
                  </div>
                  <div className="text-center w-1/3 text-slate-500 font-serif italic text-lg">vs</div>
                  <div className="text-center w-1/3">
                    <div className="text-4xl font-black text-white">{prediction.homeScore}</div>
                    <div className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
                      <span>{homeTeam.logo}</span>
                      <span>{homeTeam.name}</span>
                    </div>
                  </div>
                </div>
                {/* Win Probability Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-1 text-slate-300">
                    <span>勝率 {prediction.winProbability?.away ?? 50}%</span>
                    <span>勝率 {prediction.winProbability?.home ?? 50}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 h-full" style={{ width: `${prediction.winProbability?.away ?? 50}%` }}></div>
                    <div className="bg-cyan-500 h-full" style={{ width: `${prediction.winProbability?.home ?? 50}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Finished Match: AI vs Real Comparison */}
              {match.status === MatchStatus.FINISHED && match.scores && (
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden animate-fadeIn">
                  <h3 className="text-purple-400 font-bold mb-4 text-sm uppercase flex items-center">
                    <BrainCircuit size={16} className="mr-2" />
                    AI 預測準確度分析
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Away Team Comparison */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="flex items-center gap-1">{awayTeam.logo} {awayTeam.name}</span>
                        <span>差異: {match.scores.away - prediction.awayScore > 0 ? '+' : ''}{match.scores.away - prediction.awayScore}</span>
                      </div>
                      <div className="relative h-6 bg-slate-900/50 rounded-full overflow-hidden flex items-center">
                        {/* Predicted Bar */}
                        <div 
                          className="absolute top-0 left-0 h-full bg-slate-600/30 flex items-center justify-end pr-2 text-[10px] text-slate-400 transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(100, (prediction.awayScore / Math.max(prediction.awayScore, match.scores.away, 10)) * 100)}%` }}
                        >
                          預測 {prediction.awayScore}
                        </div>
                        {/* Actual Bar (Overlay if larger, or separate?) - Let's use two bars for clarity */}
                      </div>
                      <div className="mt-1 relative h-6 bg-slate-900/50 rounded-full overflow-hidden flex items-center">
                         <div 
                          className="absolute top-0 left-0 h-full bg-blue-500 flex items-center justify-end pr-2 text-xs font-bold text-white transition-all duration-1000 ease-out delay-100"
                          style={{ width: `${Math.min(100, (match.scores.away / Math.max(prediction.awayScore, match.scores.away, 10)) * 100)}%` }}
                        >
                          實際 {match.scores.away}
                        </div>
                      </div>
                    </div>

                    {/* Home Team Comparison */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="flex items-center gap-1">{homeTeam.logo} {homeTeam.name}</span>
                        <span>差異: {match.scores.home - prediction.homeScore > 0 ? '+' : ''}{match.scores.home - prediction.homeScore}</span>
                      </div>
                      <div className="relative h-6 bg-slate-900/50 rounded-full overflow-hidden flex items-center">
                        {/* Predicted Bar */}
                        <div 
                          className="absolute top-0 left-0 h-full bg-slate-600/30 flex items-center justify-end pr-2 text-[10px] text-slate-400 transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(100, (prediction.homeScore / Math.max(prediction.homeScore, match.scores.home, 10)) * 100)}%` }}
                        >
                          預測 {prediction.homeScore}
                        </div>
                      </div>
                      <div className="mt-1 relative h-6 bg-slate-900/50 rounded-full overflow-hidden flex items-center">
                         <div 
                          className="absolute top-0 left-0 h-full bg-cyan-500 flex items-center justify-end pr-2 text-xs font-bold text-white transition-all duration-1000 ease-out delay-100"
                          style={{ width: `${Math.min(100, (match.scores.home / Math.max(prediction.homeScore, match.scores.home, 10)) * 100)}%` }}
                        >
                          實際 {match.scores.home}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-500 text-center">
                    {Math.abs((match.scores.home - match.scores.away) - (prediction.homeScore - prediction.awayScore)) <= 2 
                      ? "✨ AI 預測與實際賽果相當接近！" 
                      : "⚠️ 實際賽果與 AI 預測存在偏差，顯示球賽的不確定性。"}
                  </div>
                </div>
              )}

              {match.status === MatchStatus.FINISHED ? (
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-fadeIn">
                  <h3 className="text-white font-bold mb-6 text-sm uppercase flex items-center gap-2 border-b border-slate-700 pb-2">
                    <Activity size={16} className="text-cyan-400" />
                    賽事數據
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-4 text-center items-center">
                    {/* Header */}
                    <div className="text-slate-500 text-xs font-mono">TEAM</div>
                    <div className="text-slate-400 text-xs font-bold">R (得分)</div>
                    <div className="text-slate-400 text-xs font-bold">H (安打)</div>
                    <div className="text-slate-400 text-xs font-bold">E (失誤)</div>

                    {/* Away Team */}
                    <div className="flex items-center justify-center gap-2 font-bold text-slate-200">
                      <span className="text-lg">{awayTeam.logo}</span>
                      <span>{awayTeam.name}</span>
                    </div>
                    <div className="text-white font-mono text-xl font-bold bg-slate-900/50 py-2 rounded">{match.scores?.away}</div>
                    <div className="text-slate-300 font-mono text-lg">{match.stats?.away.hits ?? '-'}</div>
                    <div className="text-slate-300 font-mono text-lg">{match.stats?.away.errors ?? '-'}</div>

                    {/* Home Team */}
                    <div className="flex items-center justify-center gap-2 font-bold text-slate-200">
                      <span className="text-lg">{homeTeam.logo}</span>
                      <span>{homeTeam.name}</span>
                    </div>
                    <div className="text-white font-mono text-xl font-bold bg-slate-900/50 py-2 rounded">{match.scores?.home}</div>
                    <div className="text-slate-300 font-mono text-lg">{match.stats?.home.hits ?? '-'}</div>
                    <div className="text-slate-300 font-mono text-lg">{match.stats?.home.errors ?? '-'}</div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Analysis Text */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                        <h3 className="text-cyan-400 font-bold mb-2 text-sm uppercase flex items-center justify-between">
                          比賽關鍵
                          {analyzing && prediction.isMock && (
                            <span className="text-[10px] bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded-full animate-pulse border border-cyan-700/50">
                              AI 深度運算中...
                            </span>
                          )}
                        </h3>
                        {prediction.summary ? (
                          <p className={`text-slate-300 text-sm leading-relaxed ${analyzing && prediction.isMock ? 'opacity-70 blur-[0.5px] transition-all duration-500' : 'animate-fadeIn'}`}>
                            {prediction.summary}
                          </p>
                        ) : (
                          <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-700 rounded w-full"></div>
                            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                          </div>
                        )}
                     </div>
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                        <h3 className="text-yellow-400 font-bold mb-2 text-sm uppercase flex items-center justify-between">
                          致勝因素
                          {analyzing && prediction.isMock && (
                            <span className="text-[10px] bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded-full animate-pulse border border-yellow-700/50">
                              AI 深度運算中...
                            </span>
                          )}
                        </h3>
                        {prediction.winningFactor ? (
                          <p className={`text-slate-300 text-sm leading-relaxed ${analyzing && prediction.isMock ? 'opacity-70 blur-[0.5px] transition-all duration-500' : 'animate-fadeIn'}`}>
                            {prediction.winningFactor}
                          </p>
                        ) : (
                          <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-700 rounded w-full"></div>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Detailed Analysis */}
                  {(prediction.detailedAnalysis || analyzing) && (
                    <div className="space-y-4">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                        深度戰力分析
                      </h3>
                      
                      {analyzing && prediction.isMock ? (
                        <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-800/80 p-8 min-h-[300px] flex flex-col items-center justify-center">
                           {/* Background Grid Animation */}
                           <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
                           
                           {/* Central Processing Unit */}
                           <div className="relative z-10 mb-8">
                              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                              <BrainCircuit size={64} className="text-cyan-400 relative z-10 animate-bounce" />
                              
                              {/* Orbiting Icons */}
                              <div className="absolute inset-0 animate-spin-slow">
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 p-2 rounded-full border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/20">
                                    <Activity size={16} />
                                 </div>
                                 <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-slate-900 p-2 rounded-full border border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/20">
                                    <BarChart2 size={16} />
                                 </div>
                                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 p-2 rounded-full border border-purple-500/50 text-purple-400 shadow-lg shadow-purple-500/20">
                                    <Database size={16} />
                                 </div>
                                 <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-slate-900 p-2 rounded-full border border-green-500/50 text-green-400 shadow-lg shadow-green-500/20">
                                    <Target size={16} />
                                 </div>
                              </div>
                           </div>

                           {/* Dynamic Text */}
                           <div className="text-center space-y-2 z-10 max-w-md">
                              <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">
                                 AI 深度戰術推演中...
                              </h4>
                              <p className="text-slate-400 text-sm h-6 transition-all duration-300">
                                 {analysisStep === 0 && "正在分析雙方先發投手球種與進壘點..."}
                                 {analysisStep === 1 && "正在模擬關鍵打席的擊球落點..."}
                                 {analysisStep === 2 && "正在計算牛棚調度與體能消耗..."}
                                 {analysisStep === 3 && "正在整合歷史對戰數據與心理素質..."}
                              </p>
                           </div>

                           {/* Data Stream Effect */}
                           <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
                              <div className="h-full bg-cyan-500/50 w-1/3 animate-[shimmer_2s_infinite]"></div>
                           </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <h4 className="text-blue-400 font-bold text-sm mb-1">投手戰力</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{prediction.detailedAnalysis?.pitchingAnalysis}</p>
                          </div>
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <h4 className="text-red-400 font-bold text-sm mb-1">打擊火力</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{prediction.detailedAnalysis?.battingAnalysis}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                              <h4 className="text-green-400 font-bold text-sm mb-1">戰術運用</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{prediction.detailedAnalysis?.tacticalAnalysis}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                              <h4 className="text-orange-400 font-bold text-sm mb-1">近期狀態</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{prediction.detailedAnalysis?.recentFormAnalysis}</p>
                            </div>
                          </div>
                           <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                              <h4 className="text-purple-400 font-bold text-sm mb-1">歷史交手</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{prediction.detailedAnalysis?.historyAnalysis}</p>
                            </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                    <h3 className="text-pink-400 font-bold mb-3 text-sm uppercase flex items-center justify-between">
                      關鍵球員對決
                      {analyzing && prediction.isMock && (
                        <span className="text-[10px] bg-pink-900/50 text-pink-300 px-2 py-0.5 rounded-full animate-pulse border border-pink-700/50">
                          AI 深度運算中...
                        </span>
                      )}
                    </h3>
                    {prediction.keyMatchups ? (
                      <div className={`flex flex-wrap gap-2 ${analyzing && prediction.isMock ? 'opacity-70 blur-[0.5px] transition-all duration-500' : 'animate-fadeIn'}`}>
                        {prediction.keyMatchups.map((m, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-200 border border-slate-600">
                            {m}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-2 animate-pulse">
                          <div className="h-6 bg-slate-700 rounded-full w-24"></div>
                          <div className="h-6 bg-slate-700 rounded-full w-32"></div>
                          <div className="h-6 bg-slate-700 rounded-full w-20"></div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  分析產生時間: {new Date(prediction.generatedAt).toLocaleString('zh-TW')}
                </p>
              </div>
            </>
          ) : (
             <div className="text-red-400 text-center">無法產生預測</div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlayerModal = ({ player, team, onClose, onUpdateImage }: { player: Player, team: Team, onClose: () => void, onUpdateImage?: (url: string) => void }) => {
  const [showCareer, setShowCareer] = useState(false);

  const handleEditImage = () => {
    if (!onUpdateImage) return;
    const url = window.prompt("請輸入新的圖片網址:", player.image);
    if (url) {
      onUpdateImage(url);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-1 z-10 hover:bg-black/70">
          <X size={20} />
        </button>
        
        {!showCareer ? (
          <>
            <div className="relative h-48 bg-gradient-to-b from-slate-700 to-slate-900 group">
              <img src={player.image} alt={player.name} className="w-full h-full object-cover opacity-60" />
              {onUpdateImage && (
                <button 
                  onClick={handleEditImage}
                  className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  更換照片
                </button>
              )}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                     <div className="text-4xl font-bold text-white">{player.number}</div>
                     <h2 className="text-2xl font-bold text-white">{player.name}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold text-lg">{player.position}</div>
                    <div className="text-slate-400 text-sm flex items-center justify-end gap-1">
                      <span>{team.logo}</span>
                      <span>{team.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-cyan-400 font-bold uppercase text-xs mb-2 tracking-wider flex items-center">
                  <BrainCircuit size={14} className="mr-1" /> AI 球員分析
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  {player.analysis || "暫無分析資料。"}
                </p>
              </div>

              <h3 className="text-slate-500 font-bold uppercase text-xs mb-4 tracking-wider">即時數據</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {Object.entries(player.stats).map(([key, val]) => (
                  <div key={key} className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase mb-1">{key}</div>
                    <div className="text-xl font-bold text-white">{val}</div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowCareer(true)}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
              >
                查看詳細生涯紀錄
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">生涯紀錄</h2>
              <button 
                onClick={() => setShowCareer(false)}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                返回個人檔案
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {player.careerStats && player.careerStats.length > 0 ? (
                <>
                  <table className="w-full text-sm text-left mb-6">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">年份</th>
                        <th className="px-4 py-3">球隊</th>
                        <th className="px-4 py-3 text-center">出賽</th>
                        <th className="px-4 py-3 text-center">{player.position === 'P' ? '防禦率' : '打擊率'}</th>
                        <th className="px-4 py-3 text-center rounded-r-lg">{player.position === 'P' ? '勝投' : '全壘打'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {player.careerStats.map((stat) => (
                        <tr key={stat.year} className="hover:bg-slate-800/30">
                          <td className="px-4 py-3 font-mono text-slate-300">{stat.year}</td>
                          <td className="px-4 py-3 text-slate-300">{stat.team}</td>
                          <td className="px-4 py-3 text-center text-slate-400">{stat.g}</td>
                          <td className="px-4 py-3 text-center font-bold text-cyan-400">
                            {player.position === 'P' ? stat.era : stat.avg}
                          </td>
                          <td className="px-4 py-3 text-center text-white">
                            {player.position === 'P' ? stat.w : stat.hr}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {player.achievements && player.achievements.length > 0 && (
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">生涯成就</h3>
                      <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                        {player.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Info size={48} className="mb-4 opacity-50" />
                  <p>暫無詳細生涯數據</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- View Components ---

const HomeView = ({ setView, teams, matches }: { setView: (v: ViewState) => void, teams: Team[], matches: Match[] }) => {
  const topTeams = [...teams].sort((a, b) => {
    const netA = a.wins - a.losses;
    const netB = b.wins - b.losses;
    if (netB !== netA) return netB - netA;
    return b.winRate - a.winRate;
  }).slice(0, 5);
  
  return (
    <div className="space-y-6 pb-20">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden border border-slate-700">
         <div className="absolute -right-10 -top-10 text-white/5 rotate-12">
            <Trophy size={200} />
         </div>
         <h1 className="text-3xl md:text-4xl font-black text-white mb-2 z-10 relative">
           2026 WBC <span className="text-cyan-400">AI 預測中心</span>
         </h1>
         <p className="text-slate-300 max-w-lg mb-6 z-10 relative">
           運用 Gemini 模型即時分析球員狀態、對戰紀錄，提供最精準的勝率預測與賽況分析。
         </p>
         <button 
           onClick={() => setView(ViewState.MATCHES)}
           className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-full transition-transform transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 z-10 relative"
         >
           查看最新賽程
         </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rankings */}
        <Card className="p-5">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-white flex items-center">
               <Trophy className="mr-2 text-yellow-500" size={20}/> 國家勝率排行
             </h3>
             <button onClick={() => setView(ViewState.STANDINGS)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center">
               全部 <ChevronRight size={14} />
             </button>
           </div>
           <div className="space-y-3">
             {topTeams.map((team, idx) => (
               <div key={team.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-700/50 transition-colors">
                 <div className="flex items-center space-x-3">
                   <span className={`w-6 text-center font-bold ${idx < 3 ? 'text-yellow-400' : 'text-slate-500'}`}>
                     {idx + 1}
                   </span>
                   <span className="text-2xl">{team.logo}</span>
                   <span className="font-medium text-slate-200">{team.name}</span>
                 </div>
                 <div className="text-right">
                    <span className="text-sm font-bold text-cyan-400">{(team.winRate * 100).toFixed(0)}%</span>
                    <span className="text-xs text-slate-500 block">勝率</span>
                 </div>
               </div>
             ))}
           </div>
        </Card>

        {/* Featured Upcoming Match */}
        <Card className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-white flex items-center">
               <Calendar className="mr-2 text-cyan-500" size={20}/> 焦點賽事
             </h3>
             {(() => {
                const liveMatch = matches.find(m => m.status === MatchStatus.LIVE);
                if (liveMatch) {
                  return (
                    <span className="flex items-center text-red-500 font-bold animate-pulse text-xs">
                       <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> LIVE
                    </span>
                  );
                }
                return null;
             })()}
           </div>
           {(() => {
             // Prioritize LIVE match, then the next SCHEDULED match
             const featuredMatch = matches.find(m => m.status === MatchStatus.LIVE) || 
                                   matches.find(m => m.status === MatchStatus.SCHEDULED);
                                   
             if (!featuredMatch) return <div className="text-center text-slate-500 py-8">目前無即將開始的賽事</div>;
             
             const home = teams.find(t => t.id === featuredMatch.homeTeamId);
             const away = teams.find(t => t.id === featuredMatch.awayTeamId);
             
             if (!home || !away) return null;
             
             return (
               <div className="flex flex-col items-center justify-center h-full pb-4">
                  <div className="flex items-center justify-around w-full mb-4">
                     <div className="text-center">
                       <div className="text-4xl mb-2">{away.logo}</div>
                       <div className="font-bold text-white">{away.name}</div>
                       {featuredMatch.status === MatchStatus.LIVE && (
                         <div className="text-2xl font-black text-white mt-1">{featuredMatch.scores?.away}</div>
                       )}
                     </div>
                     <div className="flex flex-col items-center">
                        <div className="text-xl font-bold text-slate-500 italic">VS</div>
                        {featuredMatch.status === MatchStatus.LIVE && featuredMatch.liveData && (
                           <div className="mt-1 bg-slate-700 px-2 py-0.5 rounded text-yellow-400 font-mono text-xs">
                             {featuredMatch.liveData.currentInning}
                           </div>
                        )}
                     </div>
                     <div className="text-center">
                       <div className="text-4xl mb-2">{home.logo}</div>
                       <div className="font-bold text-white">{home.name}</div>
                       {featuredMatch.status === MatchStatus.LIVE && (
                         <div className="text-2xl font-black text-white mt-1">{featuredMatch.scores?.home}</div>
                       )}
                     </div>
                  </div>
                  <div className="text-center mb-6">
                    {featuredMatch.status === MatchStatus.LIVE ? (
                       <div className="text-xs text-slate-400 space-x-2">
                          <span>B:{featuredMatch.liveData?.count.b}</span>
                          <span>S:{featuredMatch.liveData?.count.s}</span>
                          <span className="text-red-400">O:{featuredMatch.liveData?.outs}</span>
                       </div>
                    ) : (
                       <span className="px-3 py-1 bg-slate-700 rounded text-xs text-cyan-300 border border-slate-600">
                         {new Date(featuredMatch.startTime).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Taipei' })}
                       </span>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      if (featuredMatch.status === MatchStatus.LIVE) {
                        window.open("https://ofagirls.com", "_blank");
                      } else {
                        setView(ViewState.MATCHES);
                      }
                    }}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      featuredMatch.status === MatchStatus.LIVE 
                        ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' 
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {featuredMatch.status === MatchStatus.LIVE ? '觀看即時賽況' : '前往預測分析'}
                  </button>
               </div>
             );
           })()}
        </Card>
      </div>
    </div>
  );
};

const StandingsView = ({ teams }: { teams: Team[] }) => {
  const groups = ['A', 'B', 'C', 'D'];
  
  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-2xl font-bold text-white mb-6">分組戰績</h2>
      {groups.map(group => {
        const groupTeams = teams.filter(t => t.group === group).sort((a, b) => {
            // Sort by Net Wins (Wins - Losses) which corresponds to Games Behind
            const netA = a.wins - a.losses;
            const netB = b.wins - b.losses;
            if (netB !== netA) return netB - netA;
            
            // Tie-breaker: Win Rate
            return b.winRate - a.winRate;
        });
        
        if (groupTeams.length === 0) return null;
        
        const leader = groupTeams[0];

        return (
          <Card key={group} className="p-0">
             <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
               <h3 className="font-bold text-lg text-white">Group {group}</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                     <th className="px-6 py-3 font-medium">排名</th>
                     <th className="px-6 py-3 font-medium">球隊</th>
                     <th className="px-6 py-3 font-medium text-center">勝</th>
                     <th className="px-6 py-3 font-medium text-center">負</th>
                     <th className="px-6 py-3 font-medium text-center">勝率</th>
                     <th className="px-6 py-3 font-medium text-right">勝差</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700">
                   {groupTeams.map((team, i) => {
                     let gb = '-';
                     if (i > 0) {
                        // GB = ((Leader Wins - Team Wins) + (Team Losses - Leader Losses)) / 2
                        const diff = ((leader.wins - team.wins) + (team.losses - leader.losses)) / 2;
                        gb = diff.toFixed(1);
                     }

                     return (
                       <tr key={team.id} className="hover:bg-slate-700/30 transition-colors">
                         <td className="px-6 py-4 text-slate-300 font-mono">{i + 1}</td>
                         <td className="px-6 py-4">
                           <div className="flex items-center space-x-3">
                             <span className="text-2xl">{team.logo}</span>
                             <span className="font-bold text-white">{team.name}</span>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-center text-slate-300">{team.wins}</td>
                         <td className="px-6 py-4 text-center text-slate-300">{team.losses}</td>
                         <td className="px-6 py-4 text-center font-bold text-cyan-400">{(team.winRate).toFixed(3)}</td>
                         <td className="px-6 py-4 text-right text-slate-500">{gb}</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
          </Card>
        );
      })}
    </div>
  );
};

const TeamsView = ({ teams, setTeams }: { teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>> }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<{player: Player, team: Team} | null>(null);

  const handleUpdatePlayerImage = (url: string) => {
    if (!selectedPlayer) return;
    
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== selectedPlayer.team.id) return t;
      return {
        ...t,
        players: t.players.map(p => {
          if (p.id !== selectedPlayer.player.id) return p;
          return { ...p, image: url };
        })
      };
    }));
    
    // Update local selected player state to reflect change immediately in modal
    setSelectedPlayer(prev => prev ? ({ ...prev, player: { ...prev.player, image: url } }) : null);
  };

  return (
    <div className="pb-20">
       <h2 className="text-2xl font-bold text-white mb-6">球隊名單</h2>
       <div className="space-y-8">
         {teams.map(team => (
           <div key={team.id}>
             <div className="flex items-center space-x-3 mb-4 px-2">
               <span className="text-3xl">{team.logo}</span>
               <h3 className="text-xl font-bold text-white">{team.name}</h3>
               <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">Group {team.group}</span>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {team.players.map(player => (
                 <div 
                   key={player.id} 
                   onClick={() => setSelectedPlayer({ player, team })}
                   className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 cursor-pointer hover:border-cyan-500 hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all group"
                 >
                   <div className="h-32 bg-slate-700 relative overflow-hidden">
                     <img src={player.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={player.name}/>
                     <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                       #{player.number}
                     </div>
                   </div>
                   <div className="p-3">
                     <div className="text-xs text-cyan-400 font-bold mb-1">{player.position}</div>
                     <div className="font-bold text-white truncate">{player.name}</div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         ))}
       </div>
       {selectedPlayer && (
         <PlayerModal 
            player={selectedPlayer.player} 
            team={selectedPlayer.team} 
            onClose={() => setSelectedPlayer(null)} 
            onUpdateImage={handleUpdatePlayerImage}
         />
       )}
    </div>
  );
};

const MatchesView = ({ teams, matches, onRefresh }: { teams: Team[], matches: Match[], onRefresh: () => void }) => {
  const [filter, setFilter] = useState<'ALL' | MatchStatus>('ALL');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredMatches = matches.filter(m => filter === 'ALL' || m.status === filter)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const getTeam = (id: string) => teams.find(t => t.id === id);

  return (
    <div className="pb-20 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">賽程與預測</h2>
          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isRefreshing 
                ? 'bg-cyan-900/50 text-cyan-400 cursor-wait' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "更新中..." : "更新即時賽況"}
          </button>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg self-start">
          {[
            { k: 'ALL', l: '全部' },
            { k: MatchStatus.LIVE, l: '進行中' },
            { k: MatchStatus.SCHEDULED, l: '未來賽事' },
            { k: MatchStatus.FINISHED, l: '已結束' },
          ].map(opt => (
            <button
              key={opt.k}
              onClick={() => setFilter(opt.k as any)}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                filter === opt.k 
                  ? 'bg-cyan-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredMatches.map(match => {
          const home = getTeam(match.homeTeamId);
          const away = getTeam(match.awayTeamId);
          if (!home || !away) return null;

          const matchDate = new Date(match.startTime);

          return (
            <Card key={match.id} className="hover:border-slate-600 transition-colors">
              {/* Header Status */}
              <div className="bg-slate-900/50 px-4 py-2 flex justify-between items-center text-xs">
                 <span className="text-slate-400">
                   {matchDate.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })} {matchDate.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Taipei' })}
                 </span>
                 <div className="flex items-center space-x-2">
                   {match.status === MatchStatus.LIVE && (
                     <span className="flex items-center text-red-500 font-bold animate-pulse">
                       <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> LIVE
                     </span>
                   )}
                   {match.status === MatchStatus.FINISHED && <span className="text-slate-500 font-bold">已結束</span>}
                   {match.status === MatchStatus.SCHEDULED && <span className="text-cyan-500 font-bold">即將開始</span>}
                 </div>
              </div>

              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  {/* Away Team */}
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-2">{away.logo}</div>
                    <div className="font-bold text-white md:text-lg">{away.name}</div>
                    {match.status !== MatchStatus.SCHEDULED && (
                      <div className="text-3xl font-black text-white mt-2 font-mono">
                        {match.status === MatchStatus.LIVE ? match.scores?.away : match.scores?.away}
                      </div>
                    )}
                  </div>

                  {/* Center Info */}
                  <div className="px-4 text-center">
                    {match.status === MatchStatus.LIVE && match.liveData ? (
                      <div className="flex flex-col items-center">
                         <div className="bg-slate-700 px-3 py-1 rounded text-yellow-400 font-mono font-bold text-sm mb-2">
                           {match.liveData.currentInning}
                         </div>
                         <div className="flex space-x-1 mb-2">
                           {/* Bases */}
                           <div className={`w-3 h-3 rotate-45 border border-slate-500 ${match.liveData.bases[1] ? 'bg-yellow-400' : 'bg-slate-800'}`}></div>
                           <div className="flex space-x-4">
                              <div className={`w-3 h-3 rotate-45 border border-slate-500 ${match.liveData.bases[2] ? 'bg-yellow-400' : 'bg-slate-800'}`}></div>
                              <div className={`w-3 h-3 rotate-45 border border-slate-500 ${match.liveData.bases[0] ? 'bg-yellow-400' : 'bg-slate-800'}`}></div>
                           </div>
                         </div>
                         <div className="text-xs text-slate-400 space-x-2">
                            <span>B:{match.liveData.count.b}</span>
                            <span>S:{match.liveData.count.s}</span>
                            <span className="text-red-400">O:{match.liveData.outs}</span>
                         </div>
                         <div className="flex flex-col gap-2 mt-3">
                           <a 
                              href="https://ofagirls.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center justify-center"
                           >
                              <Play size={10} className="mr-1" /> 立即觀看
                           </a>
                           <button 
                             onClick={() => setSelectedMatch(match)}
                             className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1 rounded-full flex items-center justify-center"
                           >
                              <BrainCircuit size={10} className="mr-1" /> AI 分析
                           </button>
                         </div>
                      </div>
                    ) : match.status === MatchStatus.SCHEDULED ? (
                      <button 
                        onClick={() => setSelectedMatch(match)}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
                      >
                         <BrainCircuit size={16} />
                         <span>AI 預測分析</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="text-slate-500 font-bold text-xl mb-2">FINAL</div>
                        <button 
                          onClick={() => setSelectedMatch(match)}
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center border border-cyan-900/50 bg-cyan-900/20 px-3 py-1 rounded-full transition-colors"
                        >
                           <BrainCircuit size={12} className="mr-1" />
                           回顧預測
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Home Team */}
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-2">{home.logo}</div>
                    <div className="font-bold text-white md:text-lg">{home.name}</div>
                    {match.status !== MatchStatus.SCHEDULED && (
                      <div className="text-3xl font-black text-white mt-2 font-mono">
                        {match.scores?.home}
                      </div>
                    )}
                  </div>
                </div>

                {/* Finished Match: AI vs Real Comparison */}
                {match.status === MatchStatus.FINISHED && match.aiPrediction && (
                  <div className="mt-6 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                       <BrainCircuit size={14} className="text-purple-400" />
                       <span className="text-xs font-bold text-slate-300">賽前 AI 預測回顧</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                       <span>預測比分: {match.aiPrediction.awayScore} - {match.aiPrediction.homeScore}</span>
                       <span className={
                         Math.abs((match.scores!.home - match.scores!.away) - (match.aiPrediction.homeScore - match.aiPrediction.awayScore)) < 2 
                         ? "text-green-400" : "text-yellow-400"
                       }>
                         {Math.abs((match.scores!.home - match.scores!.away) - (match.aiPrediction.homeScore - match.aiPrediction.awayScore)) < 2 
                           ? "準確預測" : "差異較大"}
                       </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{match.aiPrediction.summary}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {selectedMatch && (
        <PredictionModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
};

const StatsView = () => {
  const StatList = ({ title, data, color }: { title: string, data: any[], color: string }) => (
    <Card className="p-0">
      <div className={`px-5 py-3 border-b border-slate-700 bg-slate-800/80`}>
         <h3 className={`font-bold text-lg ${color}`}>{title}</h3>
      </div>
      <div className="divide-y divide-slate-700">
         {data.map((item, i) => (
           <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <span className={`font-mono font-bold w-4 ${i === 0 ? 'text-yellow-400' : 'text-slate-500'}`}>{i + 1}</span>
                <span className="text-slate-200">{item.team} {item.name}</span>
              </div>
              <div className="font-bold font-mono text-white text-lg">{item.stat}</div>
           </div>
         ))}
      </div>
    </Card>
  );

  return (
    <div className="pb-20">
       <h2 className="text-2xl font-bold text-white mb-6">即時數據排行榜</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatList title="打擊率 AVG" data={MOCK_STATS_LEADERBOARD.batting} color="text-green-400" />
          <StatList title="全壘打 HR" data={MOCK_STATS_LEADERBOARD.homeruns} color="text-red-400" />
          <StatList title="防禦率 ERA" data={MOCK_STATS_LEADERBOARD.pitching} color="text-blue-400" />
       </div>
    </div>
  );
};

// --- Main Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewState>(ViewState.HOME);
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [matches, setMatches] = useState<Match[]>(MATCHES);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      if (res.ok) {
        const data: Match[] = await res.json();
        setMatches(data);
        
        // Update standings based on fetched matches
        setTeams(prevTeams => {
          // Reset stats but keep other team data (like players/images)
          const newTeams = prevTeams.map(t => ({
            ...t,
            wins: 0,
            losses: 0,
            winRate: 0
          }));

          data.forEach(match => {
            if (match.status === MatchStatus.FINISHED && match.scores) {
              const home = newTeams.find(t => t.id === match.homeTeamId);
              const away = newTeams.find(t => t.id === match.awayTeamId);
              
              if (home && away) {
                if (match.scores.home > match.scores.away) {
                  home.wins++;
                  away.losses++;
                } else if (match.scores.away > match.scores.home) {
                  away.wins++;
                  home.losses++;
                }
              }
            }
          });

          // Calculate win rates
          newTeams.forEach(t => {
            const total = t.wins + t.losses;
            t.winRate = total > 0 ? t.wins / total : 0;
          });

          return newTeams;
        });
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Simple scroll-to-top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-cyan-500/30">
      <Navbar active={activeTab} setActive={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 animate-fadeIn">
        {activeTab === ViewState.HOME && <HomeView setView={setActiveTab} teams={teams} matches={matches} />}
        {activeTab === ViewState.STANDINGS && <StandingsView teams={teams} />}
        {activeTab === ViewState.TEAMS && <TeamsView teams={teams} setTeams={setTeams} />}
        {activeTab === ViewState.MATCHES && <MatchesView teams={teams} matches={matches} onRefresh={fetchMatches} />}
        {activeTab === ViewState.STATS && <StatsView />}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 WBC AI Prediction Platform. All rights reserved.</p>
        <p className="mt-1 text-xs">Data provided by Gemini 3 Flash Preview & Official WBC Statistics.</p>
      </footer>
    </div>
  );
}