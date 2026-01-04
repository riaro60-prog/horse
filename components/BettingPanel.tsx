
import React, { useState } from 'react';
import { Horse, Player } from '../types';

interface BettingPanelProps {
  horses: Horse[];
  player: Player;
  onPlaceBet: (horseId: number, amount: number) => void;
  isLocked: boolean;
  phase: number;
}

export const BettingPanel: React.FC<BettingPanelProps> = ({ horses, player, onPlaceBet, isLocked, phase }) => {
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [tokens, setTokens] = useState<number>(1);

  const handleBet = () => {
    if (selectedHorse === null) return;
    if (tokens <= 0 || tokens > player.balance) return;
    onPlaceBet(selectedHorse, tokens);
    setSelectedHorse(null);
    setTokens(1);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border-4 border-[#ff9a8b]/10 shadow-lg transition-all">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-[#ff7e67]">{player.name}님의 차례</h2>
          <p className="text-slate-400 text-xs font-bold">라운드 {phase} 베팅 중</p>
        </div>
        <div className="bg-[#fff5f5] px-4 py-2 rounded-2xl border border-[#ff9a8b]/20">
          <p className="text-slate-400 text-[10px] font-bold uppercase">남은 토큰</p>
          <p className="text-[#ff7e67] font-black text-xl">{player.balance}개</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {horses.map((horse) => (
          <button
            key={horse.id}
            onClick={() => !isLocked && setSelectedHorse(horse.id)}
            disabled={isLocked}
            className={`p-2 rounded-xl border-2 transition-all flex items-center space-x-2 ${
              selectedHorse === horse.id 
                ? 'bg-[#ff9a8b]/10 border-[#ff7e67] scale-105' 
                : 'bg-white border-slate-100 hover:border-[#ff9a8b]/30'
            } ${isLocked ? 'opacity-50 grayscale' : ''}`}
          >
            <span className="text-2xl">{horse.icon}</span>
            <div className="text-left overflow-hidden">
              <p className="text-slate-700 font-bold text-xs truncate">{horse.name}</p>
              <p className="text-[9px] text-slate-400">#{horse.id}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-slate-400 text-[10px] font-bold mb-2 uppercase text-center">토큰 개수 선택</label>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => setTokens(Math.max(1, tokens - 1))}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold text-xl hover:bg-slate-200"
            >-</button>
            <span className="text-3xl font-black text-slate-700 w-12 text-center">{tokens}</span>
            <button 
              onClick={() => setTokens(Math.min(player.balance, tokens + 1))}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold text-xl hover:bg-slate-200"
            >+</button>
          </div>
        </div>

        <button
          onClick={handleBet}
          disabled={isLocked || selectedHorse === null || player.balance === 0}
          className="w-full py-4 bg-[#ff7e67] hover:bg-[#ff644d] disabled:bg-slate-200 text-white font-black rounded-2xl transition-all shadow-md active:scale-95"
        >
          베팅 완료!
        </button>
      </div>
    </div>
  );
};
