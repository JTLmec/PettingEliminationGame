import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';
import { Dice5, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { sound } from '../services/audio';

interface DiceRollModalProps {
  players: Player[];
  onCompleteRoll: (orderedPlayers: Player[]) => void;
}

export const DiceRollModal: React.FC<DiceRollModalProps> = ({ players, onCompleteRoll }) => {
  const [rolling, setRolling] = useState<boolean>(true);
  const [playerRolls, setPlayerRolls] = useState<{ [playerId: string]: number }>({});
  const [isDone, setIsDone] = useState<boolean>(false);
  const [sortedLadder, setSortedLadder] = useState<Player[]>([]);

  useEffect(() => {
    // Start rolling animation & audio
    sound.playDiceRoll();

    // Random roll cycle effect
    const interval = setInterval(() => {
      const tempRolls: { [playerId: string]: number } = {};
      players.forEach((p) => {
        tempRolls[p.id] = Math.floor(Math.random() * 6) + 1;
      });
      setPlayerRolls(tempRolls);
    }, 100);

    // Settle dice rolls after 1.8 seconds with tie-breaking
    const timeout = setTimeout(() => {
      clearInterval(interval);
      sound.playSafe();

      // Ensure unique or descending values for clear turn order
      const finalRolls: { [playerId: string]: number } = {};
      const usedNumbers = new Set<number>();

      // Generate distinct roll values (or tie-break automatically)
      const rolledPlayers = players.map((p, idx) => {
        let val = Math.floor(Math.random() * 6) + 1;
        // if tie, add fractional tie-break based on unique index
        while (usedNumbers.has(val) && usedNumbers.size < 6) {
          val = Math.floor(Math.random() * 6) + 1;
        }
        usedNumbers.add(val);
        finalRolls[p.id] = val;
        return { ...p, diceRoll: val, tieBreak: Math.random() + (6 - idx) * 0.01 };
      });

      // Sort descending (highest roll pets 1st)
      const sorted = [...rolledPlayers].sort((a, b) => {
        if (b.diceRoll !== a.diceRoll) {
          return b.diceRoll - a.diceRoll;
        }
        return b.tieBreak - a.tieBreak;
      });

      setPlayerRolls(finalRolls);
      setSortedLadder(sorted);
      setRolling(false);
      setIsDone(true);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [players]);

  const handleProceed = () => {
    sound.playClick();
    onCompleteRoll(sortedLadder);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-300 text-center max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-100 text-amber-900 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-3">
          <Dice5 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
          <span>High Roller Initiative</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          {rolling ? 'Rolling the Dice...' : 'Turn Order Decided!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
          Highest roll pets first. Choose your spots wisely!
        </p>

        {/* Dice Cards for Each Player */}
        <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
          {(isDone ? sortedLadder : players).map((player, idx) => {
            const roll = playerRolls[player.id] || 1;
            const isFirst = isDone && idx === 0;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl border-2 transition-all ${
                  isFirst
                    ? 'bg-amber-50 border-amber-400 shadow-md scale-[1.02]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Rank Badge */}
                  {isDone && (
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center ${
                        idx === 0
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {idx === 0 ? <Trophy className="w-3.5 h-3.5" /> : `#${idx + 1}`}
                    </div>
                  )}
                  <span className="text-xl sm:text-2xl">{player.avatar}</span>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {isFirst && (
                        <span className="text-[9px] sm:text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-black">
                          PETS 1ST
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                      {player.isBot ? 'CPU Bot' : 'Human Player'}
                    </div>
                  </div>
                </div>

                {/* Animated Die Face */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-inner border-2 transition-transform ${
                    rolling ? 'animate-wiggle bg-amber-100 text-amber-700 border-amber-300' : 'bg-white text-slate-900 border-slate-300 shadow-md'
                  }`}
                >
                  <DieFace value={roll} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Petting Action */}
        <button
          onClick={handleProceed}
          disabled={rolling}
          className={`w-full py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg font-black text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
            rolling
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-300/50 hover:scale-105 active:scale-95 cursor-pointer'
          }`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200" />
          <span>Enter Petting Arena!</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

/* SVG Dot representation of 6-sided die */
const DieFace: React.FC<{ value: number }> = ({ value }) => {
  const dots: { [val: number]: [number, number][] } = {
    1: [[50, 50]],
    2: [[25, 25], [75, 78]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  };

  const coords = dots[value] || [[50, 50]];

  return (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      {coords.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="10" fill="currentColor" />
      ))}
    </svg>
  );
};

