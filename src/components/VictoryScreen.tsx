import React, { useEffect } from 'react';
import { Player, PetData, ActiveSpot } from '../types/game';
import { Trophy, Crown, RotateCcw, Home } from 'lucide-react';
import { sound } from '../services/audio';
import confetti from 'canvas-confetti';

interface VictoryScreenProps {
  winner: Player;
  pet: PetData;
  spots: ActiveSpot[];
  winType: 'sweet_spot' | 'last_survivor';
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  winner,
  pet,
  spots,
  winType,
  onPlayAgain,
  onReturnToLobby,
}) => {
  useEffect(() => {
    sound.playVictory();

    // Continuous celebration confetti bursts
    const end = Date.now() + 2.5 * 1000;
    const interval = window.setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const safeSpotsCount = spots.filter((s) => s.state === 'picked_safe').length;
  const sweetSpot = spots.find((s) => s.outcome === 'sweet');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-xl mx-auto text-center animate-fade-in">
      <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-yellow-300 ring-8 ring-yellow-200/50">
        {/* Crown Badge */}
        <div className="flex justify-center -mt-12 mb-3">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-3xl flex items-center justify-center text-white shadow-xl ring-4 ring-white animate-bounce">
            <Crown className="w-11 h-11 fill-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Match Champion</span>
        </div>

        {/* Winner Name */}
        <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1 flex items-center justify-center gap-2">
          <span>{winner.avatar}</span>
          <span>{winner.name}</span>
        </div>

        {/* Win Subtitle */}
        <p className="text-amber-800 font-bold text-base md:text-lg mb-6">
          {winType === 'sweet_spot'
            ? `Achieved Sudden Death Victory on ${pet.name}!`
            : `Outlasted all competitors with nerves of steel!`}
        </p>

        {/* Match Summary Card */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 mb-6 text-left flex flex-col gap-2.5 text-xs md:text-sm">
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <span>Pet Challenged:</span>
            <span className="text-amber-900 font-black">{pet.name} ({pet.species})</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <span>The Golden Sweet Spot Was:</span>
            <span className="text-amber-600 font-black">
              ⭐ {sweetSpot ? sweetSpot.name : 'Hidden'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <span>Safe Spots Discovered:</span>
            <span className="text-emerald-700 font-black">{safeSpotsCount} spots</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <span>Victory Condition:</span>
            <span className="text-purple-700 font-black">
              {winType === 'sweet_spot' ? '⚡ Sudden Death Finisher' : '🛡️ Last Survivor Standing'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-300/50 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer text-base"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Rematch with {pet.name}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onReturnToLobby();
            }}
            className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition active:scale-95 flex items-center justify-center gap-2 border border-slate-200 cursor-pointer text-base"
          >
            <Home className="w-5 h-5" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
