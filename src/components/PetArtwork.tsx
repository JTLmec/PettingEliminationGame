import React from 'react';
import { PetId } from '../types/game';

interface PetArtworkProps {
  petId: PetId;
  mood: 'idle' | 'happy' | 'angry' | 'euphoric';
}

export const PetArtwork: React.FC<PetArtworkProps> = ({ petId, mood }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {petId === 'pomeranian' && <PomeranianArt mood={mood} />}
      {petId === 'garfield_cat' && <GarfieldCatArt mood={mood} />}
      {petId === 'capybara' && <CapybaraArt mood={mood} />}
      {petId === 'snake' && <SnakeArt mood={mood} />}
      {petId === 'beetle' && <BeetleArt mood={mood} />}
    </div>
  );
};

/* --- 1. POMERANIAN (GRAY BRINDLE FLUFF DOG) --- */
const PomeranianArt: React.FC<{ mood: string }> = ({ mood }) => {
  const isAngry = mood === 'angry';
  const isHappy = mood === 'happy' || mood === 'euphoric';

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[420px] drop-shadow-xl transition-all duration-300">
      <defs>
        {/* Gray Brindle Base Coat Gradient */}
        <radialGradient id="pomCoat" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="35%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>

        {/* Silvery Pearl Ruff & Fur Tufts */}
        <radialGradient id="pomSilver" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>

        {/* Charcoal Brindle Shadow */}
        <radialGradient id="pomCharcoal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </radialGradient>

        {/* Golden Charm Gradient */}
        <linearGradient id="goldTag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>

      {/* Signature Plumed Tail Curled High Over Back (Gray Brindle) */}
      <g className="animate-wiggle origin-[310px_160px]">
        {/* Big feathered plume */}
        <path
          d="M 270 210 C 330 180 370 120 320 80 C 270 50 240 100 250 130 C 240 90 280 60 330 90 C 370 120 340 190 270 210 Z"
          fill="url(#pomCoat)"
        />
        {/* Brindle streaks on tail */}
        <path d="M 290 85 Q 320 95 310 125" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M 275 110 Q 300 120 295 145" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75" />
        <circle cx="300" cy="95" r="30" fill="url(#pomSilver)" opacity="0.9" />
        <circle cx="325" cy="120" r="24" fill="url(#pomSilver)" opacity="0.9" />
        <circle cx="270" cy="95" r="20" fill="url(#pomSilver)" opacity="0.9" />
      </g>

      {/* Massive Cloud Body (Puffball) */}
      <ellipse cx="200" cy="255" rx="115" ry="90" fill="url(#pomCoat)" />
      {/* Body fluff clouds */}
      <circle cx="115" cy="260" r="48" fill="url(#pomCoat)" />
      <circle cx="285" cy="260" r="48" fill="url(#pomCoat)" />
      <circle cx="145" cy="290" r="42" fill="url(#pomCoat)" />
      <circle cx="255" cy="290" r="42" fill="url(#pomCoat)" />

      {/* Charcoal Brindle Tiger Streaks Across Body */}
      <g opacity="0.7" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M 120 230 Q 135 245 125 265" />
        <path d="M 140 220 Q 155 240 145 260" />
        <path d="M 115 270 Q 130 285 125 300" />
        <path d="M 280 230 Q 265 245 275 265" />
        <path d="M 260 220 Q 245 240 255 260" />
        <path d="M 285 270 Q 270 285 275 300" />
        {/* Flank streaks */}
        <path d="M 170 275 Q 180 290 175 305" strokeWidth="4" />
        <path d="M 230 275 Q 220 290 225 305" strokeWidth="4" />
      </g>

      {/* Fluffy Silvery Chest Mane / Lion Ruff */}
      <ellipse cx="200" cy="235" rx="80" ry="65" fill="url(#pomSilver)" />
      <circle cx="155" cy="245" r="32" fill="url(#pomSilver)" />
      <circle cx="245" cy="245" r="32" fill="url(#pomSilver)" />

      {/* Vibrant Cyan / Royal Blue Dog Collar with Shiny Gold Bone */}
      <g>
        <path d="M 140 215 Q 200 238 260 215" stroke="#0284c7" strokeWidth="12" strokeLinecap="round" fill="none" />
        {/* Collar Studs */}
        <circle cx="170" cy="222" r="3" fill="#ffffff" />
        <circle cx="200" cy="226" r="3" fill="#ffffff" />
        <circle cx="230" cy="222" r="3" fill="#ffffff" />

        {/* Hanging Golden Bone Dog Tag */}
        <g transform="translate(187, 226)">
          {/* Tag ring */}
          <circle cx="13" cy="4" r="4" fill="none" stroke="#eab308" strokeWidth="2" />
          {/* Bone charm */}
          <path
            d="M 5 10 C 2 7 2 4 5 4 C 7 4 8 6 9 7 C 10 6 11 4 13 4 C 16 4 16 7 13 10 L 13 12 C 16 15 16 18 13 18 C 11 18 10 16 9 15 C 8 16 7 18 5 18 C 2 18 2 15 5 12 Z"
            fill="url(#goldTag)"
            stroke="#a16207"
            strokeWidth="1"
            transform="rotate(-20 13 10)"
          />
        </g>
      </g>

      {/* Front Puppy Paws (Silvery Gray) */}
      <g>
        <ellipse cx="155" cy="330" rx="24" ry="16" fill="url(#pomSilver)" stroke="#64748b" strokeWidth="2.5" />
        <ellipse cx="245" cy="330" rx="24" ry="16" fill="url(#pomSilver)" stroke="#64748b" strokeWidth="2.5" />
        {/* Dog Paw Toe divisions */}
        <path d="M 148 326 L 148 335 M 162 326 L 162 335" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <path d="M 238 326 L 238 335 M 252 326 L 252 335" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Giant Round Fluffy Pomeranian Head (Gray Brindle) */}
      <g className={isHappy ? 'animate-bounce-short origin-center' : isAngry ? 'animate-shiver' : ''}>
        {/* Halo of Head Fluff */}
        <circle cx="200" cy="130" r="75" fill="url(#pomCoat)" />
        <circle cx="135" cy="130" r="38" fill="url(#pomCoat)" />
        <circle cx="265" cy="130" r="38" fill="url(#pomCoat)" />
        <circle cx="200" cy="80" r="42" fill="url(#pomCoat)" />

        {/* Head Brindle Streaks */}
        <g opacity="0.65" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 160 85 Q 170 100 165 110" />
          <path d="M 200 70 Q 200 88 198 102" />
          <path d="M 240 85 Q 230 100 235 110" />
          <path d="M 125 115 Q 140 125 130 140" />
          <path d="M 275 115 Q 260 125 270 140" />
        </g>

        {/* Fluffy Rounded Teddy Bear Dog Ears (Dark Charcoal with Silver Fluff) */}
        {/* Left Ear */}
        <g>
          <ellipse cx="140" cy="72" rx="22" ry="24" fill="#1e293b" transform="rotate(-15 140 72)" />
          <ellipse cx="140" cy="72" rx="14" ry="16" fill="#cbd5e1" transform="rotate(-15 140 72)" />
          {/* Ear fluff tufts */}
          <circle cx="126" cy="82" r="12" fill="url(#pomSilver)" />
        </g>

        {/* Right Ear */}
        <g>
          <ellipse cx="260" cy="72" rx="22" ry="24" fill="#1e293b" transform="rotate(15 260 72)" />
          <ellipse cx="260" cy="72" rx="14" ry="16" fill="#cbd5e1" transform="rotate(15 260 72)" />
          {/* Ear fluff tufts */}
          <circle cx="274" cy="82" r="12" fill="url(#pomSilver)" />
        </g>

        {/* Fluffy Cheeks & Muzzle Base (Misty Silver) */}
        <ellipse cx="200" cy="135" rx="60" ry="50" fill="url(#pomSilver)" />
        <circle cx="145" cy="142" r="28" fill="url(#pomSilver)" />
        <circle cx="255" cy="142" r="28" fill="url(#pomSilver)" />

        {/* Cute Puppy Eyebrow Fur Dots */}
        <circle cx="168" cy="100" r="5" fill="#475569" opacity="0.65" />
        <circle cx="232" cy="100" r="5" fill="#475569" opacity="0.65" />

        {/* Big Sparkling Puppy Dog Eyes */}
        {!isAngry && !isHappy && (
          <g>
            {/* Left Eye */}
            <circle cx="168" cy="120" r="12" fill="#0f172a" />
            <circle cx="164" cy="116" r="4.5" fill="#ffffff" />
            <circle cx="172" cy="123" r="2" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="232" cy="120" r="12" fill="#0f172a" />
            <circle cx="228" cy="116" r="4.5" fill="#ffffff" />
            <circle cx="236" cy="123" r="2" fill="#ffffff" />
          </g>
        )}

        {isHappy && (
          <g>
            {/* Happy Curved Puppy Eyes */}
            <path d="M 156 122 Q 168 106 180 122" stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 220 122 Q 232 106 244 122" stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Blushing Dog Cheeks */}
            <ellipse cx="145" cy="138" rx="14" ry="8" fill="#fda4af" opacity="0.85" />
            <ellipse cx="255" cy="138" rx="14" ry="8" fill="#fda4af" opacity="0.85" />
          </g>
        )}

        {isAngry && (
          <g>
            {/* Angry Pomeranian Eyes */}
            <polygon points="156,112 180,124 162,130" fill="#991b1b" />
            <polygon points="244,112 220,124 238,130" fill="#991b1b" />
            <path d="M 152 106 L 180 118" stroke="#450a0a" strokeWidth="4" strokeLinecap="round" />
            <path d="M 248 106 L 220 118" stroke="#450a0a" strokeWidth="4" strokeLinecap="round" />
            {/* Indignant vein */}
            <path d="M 245 68 L 265 68 M 255 58 L 255 78" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {/* Distinct 3D Rounded Puppy Snout Muzzle */}
        <ellipse cx="200" cy="146" rx="26" ry="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />

        {/* Shiny Black Wet Button Dog Nose with Nostrils */}
        <path
          d="M 191 138 Q 200 133 209 138 Q 200 150 191 138 Z"
          fill="#0f172a"
        />
        {/* Nose shine highlight */}
        <ellipse cx="197" cy="138" rx="3.5" ry="1.8" fill="#ffffff" opacity="0.75" />

        {/* Dog Mouth & Big Panting Tongue */}
        {!isAngry ? (
          <g>
            {/* Center philtrum line */}
            <line x1="200" y1="147" x2="200" y2="152" stroke="#0f172a" strokeWidth="2.5" />
            {/* Smiling lips */}
            <path d="M 188 152 Q 200 157 212 152" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Happy panting floppy pink dog tongue */}
            <path
              d="M 194 153 Q 192 174 200 176 Q 208 174 206 153 Z"
              fill="#fb7185"
              stroke="#e11d48"
              strokeWidth="1.5"
            />
            {/* Tongue midline crease */}
            <line x1="200" y1="154" x2="200" y2="171" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <path d="M 188 158 Q 200 148 212 158" stroke="#450a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Tiny puppy fangs */}
            <polygon points="191,155 194,162 196,155" fill="#ffffff" />
            <polygon points="204,155 206,162 209,155" fill="#ffffff" />
          </g>
        )}
      </g>
    </svg>
  );
};

/* --- 2. GARFIELD ORANGE TABBY CAT --- */
const GarfieldCatArt: React.FC<{ mood: string }> = ({ mood }) => {
  const isAngry = mood === 'angry';
  const isHappy = mood === 'happy' || mood === 'euphoric';

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[420px] drop-shadow-xl transition-all duration-300">
      <defs>
        <radialGradient id="catFur" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="70%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
      </defs>

      {/* Twitching Striped Tail */}
      <g className={isAngry ? 'animate-wiggle origin-[310px_270px]' : ''}>
        <path d="M 280 270 Q 370 290 350 210 Q 330 170 340 140" stroke="url(#catFur)" strokeWidth="32" strokeLinecap="round" fill="none" />
        {/* Tail stripes */}
        <path d="M 330 230 L 355 240" stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" />
        <path d="M 325 190 L 350 195" stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" />
        <path d="M 330 155 L 345 152" stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Chubby Loaf Body */}
      <ellipse cx="200" cy="260" rx="125" ry="85" fill="url(#catFur)" />

      {/* Body Tabby Stripes */}
      <path d="M 130 210 L 155 240" stroke="#7c2d12" strokeWidth="8" strokeLinecap="round" />
      <path d="M 170 195 L 185 235" stroke="#7c2d12" strokeWidth="8" strokeLinecap="round" />
      <path d="M 230 195 L 215 235" stroke="#7c2d12" strokeWidth="8" strokeLinecap="round" />
      <path d="M 270 210 L 245 240" stroke="#7c2d12" strokeWidth="8" strokeLinecap="round" />

      {/* Giant Chubby Belly Fluff */}
      <ellipse cx="200" cy="275" rx="80" ry="55" fill="#ffedd5" />

      {/* Loafed Paws */}
      <ellipse cx="140" cy="330" rx="30" ry="20" fill="#fed7aa" stroke="#c2410c" strokeWidth="3" />
      <ellipse cx="260" cy="330" rx="30" ry="20" fill="#fed7aa" stroke="#c2410c" strokeWidth="3" />

      {/* Giant Round Garfield Head */}
      <g className={isAngry ? 'animate-shiver' : ''}>
        {/* Ears */}
        <polygon points="120,130 100,50 170,90" fill="#ea580c" />
        <polygon points="122,120 110,65 160,95" fill="#fecdd3" />
        <polygon points="280,130 300,50 230,90" fill="#ea580c" />
        <polygon points="278,120 290,65 240,95" fill="#fecdd3" />

        {/* Head Base */}
        <circle cx="200" cy="145" r="85" fill="url(#catFur)" />
        {/* Head Stripes */}
        <path d="M 175 75 L 185 105" stroke="#7c2d12" strokeWidth="7" strokeLinecap="round" />
        <path d="M 200 70 L 200 105" stroke="#7c2d12" strokeWidth="7" strokeLinecap="round" />
        <path d="M 225 75 L 215 105" stroke="#7c2d12" strokeWidth="7" strokeLinecap="round" />

        {/* Chubby Cheeks */}
        <ellipse cx="140" cy="165" rx="35" ry="30" fill="#fed7aa" />
        <ellipse cx="260" cy="165" rx="35" ry="30" fill="#fed7aa" />
        <ellipse cx="200" cy="170" rx="45" ry="30" fill="#fed7aa" />

        {/* Heavy Garfield Eyelids / Eyes */}
        {!isAngry && !isHappy && (
          <g>
            {/* Left Eye */}
            <ellipse cx="165" cy="135" rx="22" ry="26" fill="#ffffff" stroke="#7c2d12" strokeWidth="3" />
            <circle cx="170" cy="138" r="7" fill="#0f172a" />
            {/* Heavy Eyelid */}
            <path d="M 143 130 Q 165 142 187 130 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="3" />

            {/* Right Eye */}
            <ellipse cx="235" cy="135" rx="22" ry="26" fill="#ffffff" stroke="#7c2d12" strokeWidth="3" />
            <circle cx="230" cy="138" r="7" fill="#0f172a" />
            {/* Heavy Eyelid */}
            <path d="M 213 130 Q 235 142 257 130 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="3" />
          </g>
        )}

        {isHappy && (
          <g>
            <path d="M 145 140 Q 165 118 185 140" stroke="#7c2d12" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 215 140 Q 235 118 255 140" stroke="#7c2d12" strokeWidth="6" fill="none" strokeLinecap="round" />
            <ellipse cx="145" cy="165" rx="16" ry="10" fill="#fda4af" opacity="0.8" />
            <ellipse cx="255" cy="165" rx="16" ry="10" fill="#fda4af" opacity="0.8" />
          </g>
        )}

        {isAngry && (
          <g>
            {/* Wide Furious Cat Eyes */}
            <circle cx="165" cy="135" r="22" fill="#facc15" stroke="#450a0a" strokeWidth="3" />
            <line x1="165" y1="115" x2="165" y2="155" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            <circle cx="235" cy="135" r="22" fill="#facc15" stroke="#450a0a" strokeWidth="3" />
            <line x1="235" y1="115" x2="235" y2="155" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            {/* Claws Flying */}
            <path d="M 60 110 L 100 150 M 50 140 L 90 180 M 70 90 L 110 130" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {/* Big Oval Pink Sarcastic Nose */}
        <ellipse cx="200" cy="155" rx="15" ry="10" fill="#fb7185" stroke="#be123c" strokeWidth="2" />

        {/* Smug Garfield Smile */}
        {!isAngry ? (
          <path d="M 180 170 Q 200 180 220 170" stroke="#7c2d12" strokeWidth="4" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 175 180 Q 200 160 225 180" stroke="#450a0a" strokeWidth="5" fill="none" strokeLinecap="round" />
        )}

        {/* Whiskers */}
        <line x1="95" y1="160" x2="135" y2="165" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
        <line x1="90" y1="175" x2="135" y2="175" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
        <line x1="305" y1="160" x2="265" y2="165" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
        <line x1="310" y1="175" x2="265" y2="175" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/* --- 3. CAPYBARA WITH YUZU --- */
const CapybaraArt: React.FC<{ mood: string }> = ({ mood }) => {
  const isAngry = mood === 'angry';
  const isHappy = mood === 'happy' || mood === 'euphoric';

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[420px] drop-shadow-xl transition-all duration-300">
      <defs>
        <radialGradient id="capyFur" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="70%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
      </defs>

      {/* Onsen Bath Ripples */}
      <ellipse cx="200" cy="335" rx="170" ry="40" fill="#38bdf8" opacity="0.4" />
      <ellipse cx="200" cy="340" rx="150" ry="30" fill="#0284c7" opacity="0.5" />

      {/* Steam Wisps */}
      <path d="M 120 280 Q 110 240 130 200" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" className="animate-float" />
      <path d="M 280 290 Q 290 250 270 210" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" className="animate-float" />

      {/* Capybara Heavy Sturdy Body */}
      <path d="M 110 330 C 100 240 160 170 280 180 C 330 190 350 250 340 330 Z" fill="url(#capyFur)" />

      {/* Capybara Snout and Head Block */}
      <g>
        {/* Dewlap / Neck Fold */}
        <path d="M 110 230 C 130 260 210 280 250 260" stroke="#451a03" strokeWidth="4" fill="none" />

        {/* Blocky Head */}
        <path d="M 100 170 C 90 120 150 100 220 110 C 250 115 260 170 230 220 C 180 240 120 230 100 170 Z" fill="url(#capyFur)" />

        {/* Tiny Ear */}
        <ellipse cx="235" cy="115" rx="14" ry="10" fill="#451a03" />
        <ellipse cx="233" cy="115" rx="8" ry="6" fill="#fecdd3" />

        {/* Stoic Eyes */}
        {!isAngry && !isHappy && (
          <>
            <ellipse cx="185" cy="138" rx="8" ry="4" fill="#0f172a" />
            <line x1="175" y1="135" x2="195" y2="135" stroke="#451a03" strokeWidth="3" />
          </>
        )}

        {isHappy && (
          <>
            <path d="M 175 140 Q 185 128 195 140" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
            <ellipse cx="185" cy="155" rx="14" ry="8" fill="#fda4af" opacity="0.8" />
          </>
        )}

        {isAngry && (
          <>
            <circle cx="185" cy="138" r="8" fill="#991b1b" />
            <circle cx="185" cy="138" r="3" fill="#ffffff" />
            <line x1="175" y1="128" x2="195" y2="138" stroke="#450a0a" strokeWidth="4" />
          </>
        )}

        {/* Zen Nostril & Flat Snout */}
        <ellipse cx="108" cy="175" rx="6" ry="12" fill="#291205" />
        <path d="M 108 185 Q 125 195 145 185" stroke="#291205" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* THE SACRED YUZU ORANGE ON HEAD */}
        <g className={isAngry ? 'animate-wiggle origin-[200px_85px]' : ''}>
          <circle cx="195" cy="85" r="24" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
          {/* Yuzu Leaf */}
          <path d="M 195 62 Q 215 50 210 65 Q 195 65 195 62 Z" fill="#22c55e" />
          {/* Yuzu Dimple */}
          <circle cx="195" cy="65" r="2.5" fill="#a16207" />
        </g>
      </g>
    </svg>
  );
};

/* --- 4. SNAKE (EMERALD PYTHON) --- */
const SnakeArt: React.FC<{ mood: string }> = ({ mood }) => {
  const isAngry = mood === 'angry';
  const isHappy = mood === 'happy' || mood === 'euphoric';

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[420px] drop-shadow-xl transition-all duration-300">
      {/* Bamboo Perch Branch */}
      <rect x="50" y="240" width="300" height="35" rx="16" fill="#84cc16" stroke="#4d7c0f" strokeWidth="4" />
      <line x1="150" y1="240" x2="150" y2="275" stroke="#4d7c0f" strokeWidth="4" />
      <line x1="250" y1="240" x2="250" y2="275" stroke="#4d7c0f" strokeWidth="4" />

      {/* Coiled Snake Body Loops */}
      <g>
        {/* Back loop */}
        <path d="M 180 230 C 180 160 280 160 280 240 C 280 310 220 310 170 270" stroke="#15803d" strokeWidth="38" strokeLinecap="round" fill="none" />
        {/* Cream Belly Stripe */}
        <path d="M 190 230 C 190 175 270 175 270 240 C 270 295 225 295 180 265" stroke="#fef08a" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* Front Loop */}
        <path d="M 230 220 C 280 200 320 270 260 300 C 210 320 150 260 130 220" stroke="#16a34a" strokeWidth="36" strokeLinecap="round" fill="none" />
        <path d="M 230 220 C 275 205 305 265 255 290" stroke="#fef08a" strokeWidth="10" strokeLinecap="round" fill="none" />

        {/* Diamond Scale Markings */}
        <polygon points="230,175 240,165 250,175 240,185" fill="#facc15" />
        <polygon points="275,230 285,220 295,230 285,240" fill="#facc15" />
      </g>

      {/* Snake Head */}
      <g className={isAngry ? 'animate-shiver' : ''}>
        {/* Neck */}
        <path d="M 130 220 C 110 180 130 140 160 130" stroke="#16a34a" strokeWidth="28" strokeLinecap="round" fill="none" />

        {/* Diamond Shaped Head */}
        <path d="M 130 130 C 120 100 170 80 190 110 C 200 125 180 150 150 150 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />

        {/* Eyes */}
        {!isAngry && !isHappy && (
          <>
            <circle cx="165" cy="115" r="9" fill="#facc15" stroke="#854d0e" strokeWidth="2" />
            <line x1="165" y1="108" x2="165" y2="122" stroke="#000" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {isHappy && (
          <>
            <path d="M 158 118 Q 166 108 174 118" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
            <ellipse cx="155" cy="130" rx="8" ry="5" fill="#fda4af" />
          </>
        )}

        {isAngry && (
          <>
            <circle cx="165" cy="115" r="10" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
            <line x1="165" y1="106" x2="165" y2="124" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            {/* Fangs */}
            <polygon points="135,135 130,150 140,137" fill="#ffffff" />
            <polygon points="145,137 140,152 150,139" fill="#ffffff" />
          </>
        )}

        {/* Forked Tongue */}
        <path d="M 130 132 L 105 130 L 92 122 M 105 130 L 92 138" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/* --- 5. RHINOCEROS BEETLE --- */
const BeetleArt: React.FC<{ mood: string }> = ({ mood }) => {
  const isAngry = mood === 'angry';
  const isHappy = mood === 'happy' || mood === 'euphoric';

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[420px] drop-shadow-xl transition-all duration-300">
      <defs>
        <radialGradient id="beetleShell" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0284c7" />
          <stop offset="80%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>

      {/* Mossy Tree Log Perch */}
      <rect x="70" y="320" width="260" height="50" rx="15" fill="#78350f" stroke="#451a03" strokeWidth="4" />
      <ellipse cx="140" cy="325" rx="30" ry="10" fill="#65a30d" />

      {/* Six Segmented Claws / Legs */}
      <g stroke="#0f172a" strokeWidth="6" strokeLinecap="round" fill="none">
        {/* Left Legs */}
        <path d="M 150 200 L 90 190 L 80 230" />
        <path d="M 140 240 L 70 250 L 65 300" />
        <path d="M 150 280 L 90 310 L 100 340" />

        {/* Right Legs */}
        <path d="M 250 200 L 310 190 L 320 230" />
        <path d="M 260 240 L 330 250 L 335 300" />
        <path d="M 250 280 L 310 310 L 300 340" />
      </g>

      {/* Carapace / Wing Cases */}
      <ellipse cx="200" cy="250" rx="85" ry="95" fill="url(#beetleShell)" stroke="#0f172a" strokeWidth="3" />
      {/* Wing Seam */}
      <line x1="200" y1="160" x2="200" y2="340" stroke="#0284c7" strokeWidth="3" />
      {/* Gloss Highlight Reflection */}
      <ellipse cx="170" cy="220" rx="20" ry="50" fill="#ffffff" opacity="0.25" transform="rotate(-15, 170, 220)" />

      {/* Head & Thorax */}
      <ellipse cx="200" cy="155" rx="55" ry="35" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />

      {/* Antennae */}
      <g stroke="#38bdf8" strokeWidth="3" fill="none">
        <path d="M 170 140 Q 140 120 130 100" />
        <path d="M 130 100 L 122 105 M 130 100 L 125 92" />
        <path d="M 230 140 Q 260 120 270 100" />
        <path d="M 270 100 L 278 105 M 270 100 L 275 92" />
      </g>

      {/* Mighty Rhinoceros Horn */}
      <g className={isAngry ? 'animate-wiggle origin-[200px_140px]' : ''}>
        <path d="M 190 145 C 190 90 170 50 195 25 C 205 25 210 50 210 145 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
        {/* Forked Horn Crown */}
        <polygon points="195,25 180,10 200,20" fill="#38bdf8" />
        <polygon points="205,25 220,10 200,20" fill="#38bdf8" />
      </g>

      {/* Cute Little Compound Eyes */}
      {!isAngry && !isHappy && (
        <>
          <circle cx="160" cy="150" r="7" fill="#38bdf8" />
          <circle cx="240" cy="150" r="7" fill="#38bdf8" />
        </>
      )}

      {isHappy && (
        <>
          <path d="M 152 150 Q 160 142 168 150" stroke="#38bdf8" strokeWidth="3" fill="none" />
          <path d="M 232 150 Q 240 142 248 150" stroke="#38bdf8" strokeWidth="3" fill="none" />
        </>
      )}

      {isAngry && (
        <>
          <circle cx="160" cy="150" r="8" fill="#ef4444" />
          <circle cx="240" cy="150" r="8" fill="#ef4444" />
          {/* Electricity sparks */}
          <path d="M 175 40 L 185 30 L 180 20" stroke="#facc15" strokeWidth="3" fill="none" />
          <path d="M 225 40 L 215 30 L 220 20" stroke="#facc15" strokeWidth="3" fill="none" />
        </>
      )}
    </svg>
  );
};

