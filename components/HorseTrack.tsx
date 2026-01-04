
import React from 'react';
import { Horse, RaceState } from '../types';
import { TRACK_LENGTH } from '../constants';

interface HorseTrackProps {
  horses: Horse[];
  raceState: RaceState;
}

export const HorseTrack: React.FC<HorseTrackProps> = ({ horses, raceState }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border-4 border-[#ff9a8b]/10 shadow-lg overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Track Headers */}
        <div className="flex mb-4 text-[#ff7e67]/60 text-[10px] font-black uppercase tracking-widest">
          <div className="w-40 px-4">우리 친구들</div>
          <div className="flex-1 flex justify-between px-2">
            {Array.from({ length: TRACK_LENGTH + 1 }).map((_, i) => (
              <div key={i} className="w-8 text-center">
                {i === 0 ? "출발" : i === TRACK_LENGTH ? "🏁" : i}
              </div>
            ))}
          </div>
        </div>

        {/* Lanes */}
        <div className="space-y-4">
          {horses.map((horse) => {
            const pos = raceState.horsePositions[horse.id] || 0;
            const isWinner = pos >= TRACK_LENGTH;
            return (
              <div key={horse.id} className="relative flex items-center">
                {/* Horse Info */}
                <div className="w-40 flex items-center space-x-2 z-10 px-2">
                  <span 
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-white font-bold shadow-md text-xs"
                    style={{ backgroundColor: horse.color }}
                  >
                    {horse.id}
                  </span>
                  <span className="text-slate-700 font-bold text-sm truncate">{horse.name}</span>
                </div>

                {/* The Lane */}
                <div className="flex-1 relative h-12 flex items-center px-4 bg-[#fffaf5] rounded-2xl border-2 border-[#ff9a8b]/5">
                   <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                     {Array.from({ length: TRACK_LENGTH + 1 }).map((_, i) => (
                       <div key={i} className="w-[1px] h-full bg-[#ff9a8b]/10" />
                     ))}
                   </div>

                   {/* Horse Icon with Animation */}
                   <div 
                    className={`absolute transition-all duration-700 ease-out flex flex-col items-center ${pos > 0 ? 'animate-bounce-slow' : ''}`}
                    style={{ 
                      left: `${(pos / TRACK_LENGTH) * 92 + 2}%`,
                      transform: 'translateX(-50%)'
                    }}
                   >
                     <span className="text-3xl drop-shadow-md">
                       {horse.icon}
                     </span>
                     {isWinner && (
                       <span className="absolute -top-5 bg-yellow-400 text-white text-[9px] px-1 rounded-full font-black animate-pulse">1등!</span>
                     )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 0.8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
