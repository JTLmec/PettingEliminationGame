import React from 'react';
import { Player } from '../types/game';
import { Bot, User, Volume2, VolumeX, ShieldCheck, Skull } from 'lucide-react';
import { sound } from '../services/audio';

interface TurnBannerProps {
  activePlayer: Player;
  players: Player[];
  activePlayerIndex: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isBotThinking: boolean;
}

export const TurnBanner: React.FC<TurnBannerProps> = ({
  activePlayer,
  players,
  activePlayerIndex,
  isMuted,
  onToggleMute,
  isBotThinking,
}) => {
  const alivePlayers = players.filter((p) => !p.isEliminated);
  const eliminatedPlayers = players.filter((p) => p.isEliminated);

  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      {/* Top Bar with Audio & Counts */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{alivePlayers.length} Contestants Alive</span>
          </span>
          {eliminatedPlayers.length > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-black shadow-sm">
              <Skull className="w-3.5 h-3.5 text-rose-600" />
              <span>{eliminatedPlayers.length} Eliminated</span>
            </span>
          )}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="p-2 bg-white/90 hover:bg-white rounded-full border border-slate-200 text-slate-700 shadow-sm transition active:scale-95"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
        </button>
      </div>

      {/* Main Active Player Spotlight Banner */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative shrink-0">
            <span className="text-3xl sm:text-4xl p-1.5 sm:p-2 bg-amber-100 rounded-2xl block border border-amber-200 shadow-inner">
              {activePlayer.avatar}
            </span>
            <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-full text-xs font-black">
              {activePlayer.isBot ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Current Turn
              </span>
              {isBotThinking && (
                <span className="text-xs text-purple-600 font-bold animate-pulse">
                  🤖 Bot thinking...
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {activePlayer.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {activePlayer.isBot
                ? 'Choosing where to touch...'
                : 'Tap a spot on the pet to test your luck!'}
            </p>
          </div>
        </div>

        {/* Turn Queue Avatars */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 shrink-0 self-start sm:self-auto">
          {players.map((p, idx) => {
            const isActive = idx === activePlayerIndex;
            return (
              <div
                key={p.id}
                className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold border-2 transition-all ${
                  p.isEliminated
                    ? 'opacity-30 grayscale bg-slate-100 border-slate-300'
                    : isActive
                    ? 'scale-110 bg-amber-400 border-amber-500 shadow-md shadow-amber-300'
                    : 'bg-white/80 border-slate-200'
                }`}
                title={`${p.name} ${p.isEliminated ? '(Eliminated)' : ''}`}
              >
                <span>{p.avatar}</span>
                {p.isEliminated && (
                  <span className="absolute inset-0 flex items-center justify-center text-rose-600 text-xs font-black">
                    ✕
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

