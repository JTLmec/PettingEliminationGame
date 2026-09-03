import React, { useState } from 'react';
import { PetData, ActiveSpot, Player } from '../types/game';
import { PetArtwork } from './PetArtwork';
import { Sparkles, Shield, Skull, Crown, Hand } from 'lucide-react';
import { sound } from '../services/audio';

interface PetVisualizerProps {
  pet: PetData;
  spots: ActiveSpot[];
  activePlayer: Player;
  onPickSpot: (spot: ActiveSpot) => void;
  disabled: boolean;
  petMood: 'idle' | 'happy' | 'angry' | 'euphoric';
  reachingCoords?: { x: number; y: number } | null;
}

export const PetVisualizer: React.FC<PetVisualizerProps> = ({
  pet,
  spots,
  activePlayer,
  onPickSpot,
  disabled,
  petMood,
  reachingCoords,
}) => {
  const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);

  const handleSpotHover = (spot: ActiveSpot) => {
    if (disabled || spot.state !== 'unpicked' || activePlayer.isBot) return;
    sound.playTension();
    setHoveredSpotId(spot.id);
  };

  const handleSpotClick = (spot: ActiveSpot) => {
    if (disabled || spot.state !== 'unpicked') return;
    sound.playClick();
    onPickSpot(spot);
  };

  const unpickedCount = spots.filter((s) => s.state === 'unpicked').length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Main Pet Arena Stage */}
      <div
        className={`relative w-full max-w-2xl aspect-square max-h-[420px] sm:max-h-[500px] rounded-3xl p-2 sm:p-4 md:p-8 flex items-center justify-center bg-gradient-to-br ${pet.color.bgGradient} border-2 sm:border-4 border-white/80 shadow-2xl overflow-hidden transition-all duration-300`}
      >
        {/* Arena Atmosphere Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* The Central Animated Pet */}
        <div className="w-full h-full max-w-[340px] sm:max-w-[420px] max-h-[340px] sm:max-h-[420px] flex items-center justify-center relative">
          <PetArtwork petId={pet.id} mood={petMood} />

          {/* Interactive Touch Target Pins Overlaid Directly on Pet */}
          {spots.map((spot) => {
            const isUnpicked = spot.state === 'unpicked';
            const isHovered = hoveredSpotId === spot.id;

            return (
              <div
                key={spot.id}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20"
                onMouseEnter={() => handleSpotHover(spot)}
                onMouseLeave={() => setHoveredSpotId(null)}
              >
                {isUnpicked ? (
                  <button
                    onClick={() => handleSpotClick(spot)}
                    disabled={disabled}
                    className={`group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-200 cursor-pointer shadow-lg active:scale-90 touch-manipulation ${
                      disabled
                        ? 'opacity-60 cursor-not-allowed bg-amber-200 text-amber-900'
                        : isHovered
                        ? 'scale-125 bg-amber-400 text-white ring-4 ring-amber-300 shadow-amber-400/50'
                        : 'bg-white/95 text-amber-900 border-2 border-amber-400 hover:bg-amber-100 animate-hotspot'
                    }`}
                    title={spot.name}
                  >
                    <Hand className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-800/30 group-hover:scale-110 transition-transform" />

                    {/* Tooltip on Hover */}
                    {isHovered && !disabled && (
                      <div className="absolute bottom-full mb-2 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-900/95 text-white text-[11px] sm:text-xs font-bold rounded-xl whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none z-30 flex flex-col items-center">
                        <span>{spot.name}</span>
                        <span className="text-[9px] sm:text-[10px] text-amber-300 font-normal">Tap to Pet!</span>
                        {/* Triangle arrow */}
                        <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 translate-y-1" />
                      </div>
                    )}
                  </button>
                ) : (
                  /* Already Picked Spot Badge */
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white transition-all ${
                      spot.state === 'picked_sweet'
                        ? 'bg-yellow-400 ring-4 ring-yellow-200 animate-bounce'
                        : spot.state === 'picked_danger'
                        ? 'bg-rose-500 ring-2 ring-rose-200'
                        : 'bg-emerald-500 ring-2 ring-emerald-200'
                    }`}
                    title={`${spot.name}: ${spot.state.replace('picked_', '').toUpperCase()}`}
                  >
                    {spot.state === 'picked_sweet' && <Crown className="w-4 h-4 fill-white" />}
                    {spot.state === 'picked_danger' && <Skull className="w-4 h-4" />}
                    {spot.state === 'picked_safe' && <Shield className="w-4 h-4" />}
                  </div>
                )}
              </div>
            );
          })}

          {/* Animated Reaching Hand Cursor during click animation */}
          {reachingCoords && (
            <div
              style={{
                left: `${reachingCoords.x}%`,
                top: `${reachingCoords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-40 pointer-events-none transition-all duration-300 animate-bounce"
            >
              <div className="text-4xl drop-shadow-2xl">
                🫳
              </div>
            </div>
          )}
        </div>

        {/* Bottom Badge inside Arena */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-xs font-bold">
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-slate-700 border border-slate-200 shadow-sm">
            {unpickedCount} Spots Remaining
          </span>
          <span className="bg-amber-500/90 text-white px-3 py-1 rounded-full shadow-sm">
            1 Sudden Death Golden Spot
          </span>
        </div>
      </div>

      {/* Spot Inspector Quick Cards */}
      <div className="w-full max-w-2xl mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
        {spots.map((spot) => {
          const isUnpicked = spot.state === 'unpicked';
          return (
            <button
              key={spot.id}
              onClick={() => handleSpotClick(spot)}
              disabled={disabled || !isUnpicked}
              onMouseEnter={() => handleSpotHover(spot)}
              onMouseLeave={() => setHoveredSpotId(null)}
              className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all touch-manipulation ${
                !isUnpicked
                  ? spot.state === 'picked_safe'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                    : spot.state === 'picked_danger'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 opacity-60'
                    : 'bg-amber-100 border-amber-400 text-amber-900'
                  : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-700 hover:border-amber-400 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold mb-0.5">
                <span className="truncate">{spot.name}</span>
                {spot.state === 'picked_safe' && <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                {spot.state === 'picked_danger' && <Skull className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                {spot.state === 'picked_sweet' && <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {isUnpicked ? spot.description : spot.state.replace('picked_', '').toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

