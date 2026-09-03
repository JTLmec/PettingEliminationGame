export type PetId = 'pomeranian' | 'garfield_cat' | 'capybara' | 'snake' | 'beetle';

export type SpotOutcome = 'sweet' | 'danger' | 'safe';

export type SpotState = 'unpicked' | 'picked_safe' | 'picked_danger' | 'picked_sweet';

export interface SpotDefinition {
  id: string;
  name: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  description: string;
  flavor: string;
}

export interface ActiveSpot extends SpotDefinition {
  outcome: SpotOutcome;
  state: SpotState;
  pickedBy?: string; // Player ID
}

export interface PetData {
  id: PetId;
  name: string;
  species: string;
  title: string;
  bio: string;
  quote: string;
  quirk: string;
  difficulty: 'Easy' | 'Medium' | 'Spicy' | 'Hard' | 'Zen';
  dangerRating: number; // 1 to 5
  color: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradient: string;
    cardBg: string;
  };
  spots: SpotDefinition[];
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isBot: boolean;
  isEliminated: boolean;
  diceRoll: number;
  score: number;
}

export type GamePhase = 'LOBBY' | 'PET_SELECT' | 'DICE_ROLL' | 'PLAYING' | 'REVEAL' | 'GAME_OVER';

export interface RevealData {
  player: Player;
  spot: ActiveSpot;
  outcome: SpotOutcome;
  message: string;
}

