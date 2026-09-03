import React, { useEffect } from 'react';
import { RevealData } from '../types/game';
import { ShieldCheck, Skull, Crown, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutcomeModalProps {
  data: RevealData;
  onDismiss: () => void;
}

export const OutcomeModal: React.FC<OutcomeModalProps> = ({ data, onDismiss }) => {
  const { player, spot, outcome, message } = data;

  useEffect(() => {
    if (outcome === 'sweet') {
      // Confetti blast!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#f43f5e'],
      });
    }
  }, [outcome]);

  const isSweet = outcome === 'sweet';
  const isDanger = outcome === 'danger';
  const isSafe = outcome === 'safe';

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
      <div
        className={`bg-white rounded-3xl p-5 sm:p-6 md:p-8 max-w-md w-full text-center shadow-2xl border-4 transform transition-transform ${
          isSweet
            ? 'border-yellow-400 ring-4 sm:ring-8 ring-yellow-200/50 scale-105'
            : isDanger
            ? 'border-rose-500 ring-4 sm:ring-8 ring-rose-200/50'
            : 'border-emerald-400 ring-4 sm:ring-8 ring-emerald-200/50'
        }`}
      >
        {/* Outcome Header Icon */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-lg ${
              isSweet
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 animate-bounce'
                : isDanger
                ? 'bg-gradient-to-tr from-rose-600 to-red-400 animate-wiggle'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400'
            }`}
          >
            {isSweet && <Crown className="w-8 h-8 sm:w-10 sm:h-10 fill-white" />}
            {isDanger && <Skull className="w-8 h-8 sm:w-10 sm:h-10" />}
            {isSafe && <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />}
          </div>
        </div>

        {/* Player Name and Action */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-100 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-slate-700 mb-2">
          <span>{player.avatar}</span>
          <span>{player.name}</span>
          <span className="text-slate-400">pet</span>
          <span className="font-extrabold text-amber-700">{spot.name}</span>
        </div>

        {/* Title */}
        <h2
          className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${
            isSweet
              ? 'text-amber-500'
              : isDanger
              ? 'text-rose-600'
              : 'text-emerald-600'
          }`}
        >
          {isSweet && 'SUDDEN DEATH VICTORY! 👑'}
          {isDanger && 'OUCH! ELIMINATED! 💥'}
          {isSafe && 'PHEW! SAFE! 💖'}
        </h2>

        {/* Narrative Message */}
        <p className="text-slate-600 text-xs sm:text-sm md:text-base font-medium mb-4 sm:mb-6 leading-relaxed bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-100">
          {message}
        </p>

        {isSweet && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-700 bg-amber-50 py-1.5 sm:py-2 rounded-xl border border-amber-200 mb-3 sm:mb-4">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Pure bliss unlocked! Match instantly won!</span>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={onDismiss}
          className={`w-full py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg font-black text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
            isSweet
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-300'
              : isDanger
              ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-300'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-300'
          }`}
        >
          <span>{isSweet ? 'Crown the Champion!' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

