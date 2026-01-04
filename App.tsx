
import React, { useState, useCallback } from 'react';
import { GamePhase, Horse, RaceState, Player, Bet } from './types';
import { HORSES, TRACK_LENGTH, INITIAL_TOKENS } from './constants';
import { calculateMovement } from './utils';
import { HorseTrack } from './components/HorseTrack';
import { BettingPanel } from './components/BettingPanel';
import { getRaceCommentary } from './geminiService';
import { Heart, Coins, Play, RotateCcw, MessageSquareQuote, Users, Star } from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0);
  const [raceState, setRaceState] = useState<RaceState>({
    horsePositions: Object.fromEntries(HORSES.map(h => [h.id, 0])),
    round: 0,
    winners: []
  });
  const [commentary, setCommentary] = useState<string>("친구들과 함께 즐거운 동물 경주를 시작해보세요!");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRoundProcessing, setIsRoundProcessing] = useState(false);

  const setupPlayers = (count: number) => {
    const newPlayers: Player[] = Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      name: `플레이어 ${i + 1}`,
      balance: INITIAL_TOKENS,
      bets: []
    }));
    setPlayers(newPlayers);
    setPhase(GamePhase.BETTING_PHASE_1);
    setCommentary("첫 번째 베팅 라운드입니다! 모두의 행운을 빌어요!");
  };

  const updateCommentary = async (p: 'mid-race' | 'finish', currentRaceState: RaceState) => {
    setIsAiLoading(true);
    const text = await getRaceCommentary(p, HORSES, currentRaceState);
    setCommentary(text);
    setIsAiLoading(false);
  };

  const placeBet = (horseId: number, amount: number) => {
    const isPhase1 = phase === GamePhase.BETTING_PHASE_1;
    const currentPhaseNum = isPhase1 ? 1 : 2;
    
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIdx) {
        return {
          ...p,
          balance: p.balance - amount,
          bets: [...p.bets, { horseId, amount, phase: currentPhaseNum }]
        };
      }
      return p;
    }));

    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(prev => prev + 1);
    } else {
      // All players have bet
      setCurrentPlayerIdx(0);
      if (isPhase1) {
        setPhase(GamePhase.INITIAL); // Ready to run R1-R3
      } else {
        setPhase(GamePhase.RACING_FINAL); // Ready to run till end
      }
    }
  };

  const runRounds = async (untilRound: number | 'finish') => {
    setIsRoundProcessing(true);
    let currentPositions = { ...raceState.horsePositions };
    let currentRound = raceState.round;
    let foundWinners: number[] = [];

    const interval = setInterval(async () => {
      currentRound++;
      const nextPositions = { ...currentPositions };

      HORSES.forEach(horse => {
        if (nextPositions[horse.id] < TRACK_LENGTH) {
          nextPositions[horse.id] += calculateMovement(horse.probabilities);
          if (nextPositions[horse.id] > TRACK_LENGTH) nextPositions[horse.id] = TRACK_LENGTH;
        }
      });

      currentPositions = nextPositions;
      foundWinners = Object.entries(currentPositions)
        .filter(([_, pos]) => pos >= TRACK_LENGTH)
        .map(([id, _]) => parseInt(id));

      setRaceState(prev => ({
        ...prev,
        round: currentRound,
        horsePositions: currentPositions,
        winners: foundWinners
      }));

      const shouldStop = 
        (untilRound === 'finish' && foundWinners.length > 0) || 
        (typeof untilRound === 'number' && currentRound >= untilRound);

      if (shouldStop) {
        clearInterval(interval);
        setIsRoundProcessing(false);

        if (untilRound === 3) {
          setPhase(GamePhase.BETTING_PHASE_2);
          await updateCommentary('mid-race', { ...raceState, horsePositions: currentPositions, round: currentRound, winners: foundWinners });
        } else {
          setPhase(GamePhase.RESULTS);
          // Process Payouts for tokens
          setPlayers(prev => prev.map(p => {
            let totalWin = 0;
            p.bets.forEach(bet => {
              if (foundWinners.includes(bet.horseId)) {
                totalWin += bet.amount * (bet.phase === 1 ? 3 : 2);
              }
            });
            return { ...p, balance: p.balance + totalWin };
          }));
          await updateCommentary('finish', { ...raceState, horsePositions: currentPositions, round: currentRound, winners: foundWinners });
        }
      }
    }, 800);
  };

  const resetGame = () => {
    setRaceState({
      horsePositions: Object.fromEntries(HORSES.map(h => [h.id, 0])),
      round: 0,
      winners: []
    });
    setPlayers(prev => prev.map(p => ({ ...p, bets: [] })));
    setPhase(GamePhase.BETTING_PHASE_1);
    setCurrentPlayerIdx(0);
    setCommentary("다시 한 번 달려볼까요? 새로운 경주를 준비했어요!");
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#ff7e67] flex items-center gap-3 drop-shadow-sm">
              <Heart className="fill-[#ff7e67] w-10 h-10" />
              말랑말랑 <span className="text-[#ff9a8b]">동물 경주</span>
            </h1>
            <p className="text-slate-500 font-medium">행운을 부르는 귀여운 친구들의 달리기!</p>
          </div>
          {phase !== GamePhase.SETUP && (
            <div className="flex gap-2">
              {players.map(p => (
                <div key={p.id} className="bg-white border-2 border-[#ff9a8b]/20 rounded-2xl px-4 py-2 flex items-center space-x-2 shadow-sm">
                  <Coins className="text-yellow-500 w-4 h-4" />
                  <span className="text-slate-700 font-bold text-sm">{p.name}: {p.balance}개</span>
                </div>
              ))}
            </div>
          )}
        </header>

        {phase === GamePhase.SETUP ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-3xl p-10 shadow-xl border-4 border-[#ff9a8b]/10">
            <Users className="w-20 h-20 text-[#ff7e67] mb-6" />
            <h2 className="text-2xl font-bold mb-6 text-slate-700">참여 인원을 선택해주세요</h2>
            <div className="flex gap-4 mb-8">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => setPlayerCount(num)}
                  className={`w-14 h-14 rounded-2xl font-bold text-xl transition-all ${
                    playerCount === num 
                    ? 'bg-[#ff7e67] text-white scale-110 shadow-lg' 
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => setupPlayers(playerCount)}
              className="px-10 py-4 bg-[#ff7e67] hover:bg-[#ff644d] text-white font-bold rounded-2xl shadow-xl transition-transform hover:scale-105"
            >
              게임 시작!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <HorseTrack horses={HORSES} raceState={raceState} />
              
              <div className="bg-white border-2 border-[#ff9a8b]/10 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <MessageSquareQuote className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-bold text-[#ff7e67] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Star className="w-3 h-3 fill-[#ff7e67]" /> 콩떡 해설위원
                </h3>
                <p className="text-lg text-slate-700 font-medium leading-relaxed">
                  {commentary}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {phase === GamePhase.INITIAL && (
                  <button onClick={() => runRounds(3)} className="btn-main bg-[#ff7e67]">라운드 1-3 달리기!</button>
                )}
                {phase === GamePhase.RACING_FINAL && (
                  <button onClick={() => runRounds('finish')} className="btn-main bg-[#ff7e67]">최종 라운드 시작!</button>
                )}
                {phase === GamePhase.RESULTS && (
                  <button onClick={resetGame} className="btn-main bg-slate-600">다음 경기 준비하기</button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {(phase === GamePhase.BETTING_PHASE_1 || phase === GamePhase.BETTING_PHASE_2) && (
                <BettingPanel 
                  horses={HORSES} 
                  player={players[currentPlayerIdx]} 
                  onPlaceBet={placeBet}
                  isLocked={isRoundProcessing}
                  phase={phase === GamePhase.BETTING_PHASE_1 ? 1 : 2}
                />
              )}

              <div className="bg-white border-2 border-[#ff9a8b]/10 rounded-2xl p-6 shadow-sm">
                <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  현재 베팅 요약
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {players.every(p => p.bets.length === 0) ? (
                    <p className="text-slate-400 text-sm italic">베팅을 시작해주세요!</p>
                  ) : (
                    players.map(p => (
                      <div key={p.id} className="space-y-2">
                        <p className="text-xs font-bold text-[#ff7e67] border-b border-[#ff9a8b]/10 pb-1">{p.name}</p>
                        {p.bets.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">아직 베팅 전입니다.</p>
                        ) : (
                          p.bets.map((b, i) => {
                            const h = HORSES.find(h => h.id === b.horseId);
                            return (
                              <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
                                <span className="flex items-center gap-1">{h?.icon} {h?.name}</span>
                                <span className="font-bold">{b.amount}토큰</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .btn-main {
          padding: 1rem 2rem;
          color: white;
          font-weight: 800;
          border-radius: 1.25rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-main:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
};

export default App;
