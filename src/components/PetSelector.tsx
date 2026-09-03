import React, { useState } from 'react';
import { PetId, PetData } from '../types/game';
import { PETS } from '../data/pets';
import { PetArtwork } from './PetArtwork';
import { Flame, Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { sound } from '../services/audio';

interface PetSelectorProps {
  onSelectPet: (petId: PetId) => void;
  onBackToLobby: () => void;
}

export const PetSelector: React.FC<PetSelectorProps> = ({ onSelectPet, onBackToLobby }) => {
  const petList = Object.values(PETS);
  const [selectedPetId, setSelectedPetId] = useState<PetId>('garfield_cat');

  const selectedPet: PetData = PETS[selectedPetId];

  const handleSelect = (id: PetId) => {
    sound.playClick();
    setSelectedPetId(id);
  };

  const handleConfirm = () => {
    sound.playClick();
    onSelectPet(selectedPetId);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center py-4 px-2 sm:px-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
        <button
          onClick={() => {
            sound.playClick();
            onBackToLobby();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 hover:bg-white text-slate-700 text-xs sm:text-sm font-bold rounded-2xl border border-slate-200 shadow-sm transition active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Roster</span>
        </button>
        <div className="text-xs sm:text-sm font-bold text-amber-900 bg-amber-200/80 px-3 sm:px-4 py-1.5 rounded-full border border-amber-300">
          Step 2: Pick Pet
        </div>
      </div>

      <div className="text-center mb-4 sm:mb-6 px-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-950 tracking-tight mb-1">
          Who Will You Dare to Pet?
        </h1>
        <p className="text-slate-600 font-medium text-xs sm:text-sm md:text-base">
          Each animal has unique temperaments, danger zones, and sweet spots!
        </p>
      </div>

      {/* Pet Selection Horizontal Strip / Tabs */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap mb-4 sm:mb-6 w-full">
        {petList.map((pet) => {
          const isSelected = pet.id === selectedPetId;
          return (
            <button
              key={pet.id}
              onClick={() => handleSelect(pet.id)}
              className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold transition-all shadow-sm active:scale-95 text-xs sm:text-sm ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-300 scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span className="text-lg sm:text-xl">
                {pet.id === 'pomeranian' && '🐶'}
                {pet.id === 'garfield_cat' && '🐱'}
                {pet.id === 'capybara' && '🥔'}
                {pet.id === 'snake' && '🐍'}
                {pet.id === 'beetle' && '🪲'}
              </span>
              <span>{pet.name}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Pet Spotlight Card */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center mb-6 sm:mb-8">
        {/* Left: Animated Pet Showcase */}
        <div className={`relative rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-br ${selectedPet.color.bgGradient} border-2 border-amber-200/60 min-h-[260px] sm:min-h-[320px] overflow-hidden`}>
          <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center">
            <PetArtwork petId={selectedPet.id} mood="happy" />
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-bold text-slate-600 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
            <span>{selectedPet.spots.length} Clickable Zones</span>
            <span className="text-amber-700 font-black">1 Sudden Death Sweet Spot</span>
          </div>
        </div>

        {/* Right: Pet Bio and Stats */}
        <div className="flex flex-col justify-between h-full gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                {selectedPet.species}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                Difficulty: {selectedPet.difficulty}
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-1">
              {selectedPet.name}
            </h2>
            <p className="text-amber-800 font-bold text-sm mb-3">
              {selectedPet.title}
            </p>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {selectedPet.bio}
            </p>

            <blockquote className="italic text-xs font-semibold text-amber-900 bg-amber-50 p-3 rounded-xl border-l-4 border-amber-400 mb-4">
              {selectedPet.quote}
            </blockquote>

            {/* Quirk alert */}
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-200 flex items-start gap-2.5 mb-4">
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs text-orange-950 font-medium">
                <span className="font-bold text-orange-800">Temperament: </span>
                {selectedPet.quirk}
              </div>
            </div>

            {/* Danger meter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Spook Danger:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <Flame
                    key={val}
                    className={`w-4 h-4 ${
                      val <= selectedPet.dangerRating
                        ? 'text-rose-500 fill-rose-500'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-black rounded-2xl shadow-lg shadow-orange-300/50 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer mt-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Confirm {selectedPet.name} & Roll Dice!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

