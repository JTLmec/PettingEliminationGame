import React, { useState, useEffect, useCallback } from 'react';
import {
  GamePhase,
  PetId,
  PetData,
  Player,
  ActiveSpot,
  SpotOutcome,
  RevealData,
} from './types/game';
import { PETS, BOT_NAMES, PLAYER_COLORS } from './data/pets';
import { Lobby } from './components/Lobby';
import { PetSelector } from './components/PetSelector';
import { DiceRollModal } from './components/DiceRollModal';
import { TurnBanner } from './components/TurnBanner';
import { PetVisualizer } from './components/PetVisualizer';
import { OutcomeModal } from './components/OutcomeModal';
import { VictoryScreen } from './components/VictoryScreen';
import { sound } from './services/audio';

export const App: React.FC = () => {
  // --- Game State ---
  const [phase, setPhase] = useState<GamePhase>('LOBBY');
  const [selectedPetId, setSelectedPetId] = useState<PetId>('garfield_cat');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Players
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'p1',
      name: 'Player 1',
      avatar: '🐶',
      color: PLAYER_COLORS[0].bg,
      isBot: false,
      isEliminated: false,
      diceRoll: 0,
      score: 0,
    },
    {
      id: 'p2',
      name: BOT_NAMES[0],
      avatar: '🐱',
      color: PLAYER_COLORS[1].bg,
      isBot: true,
      isEliminated: false,
      diceRoll: 0,
      score: 0,
    },
    {
      id: 'p3',
      name: BOT_NAMES[1],
      avatar: '🐰',
      color: PLAYER_COLORS[2].bg,
      isBot: true,
      isEliminated: false,
      diceRoll: 0,
      score: 0,
    },
  ]);

  // Turn Tracking
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [activeSpots, setActiveSpots] = useState<ActiveSpot[]>([]);
  const [petMood, setPetMood] = useState<'idle' | 'happy' | 'angry' | 'euphoric'>('idle');
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [reachingCoords, setReachingCoords] = useState<{ x: number; y: number } | null>(null);

  // Reveal & Win States
  const [revealData, setRevealData] = useState<RevealData | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winType, setWinType] = useState<'sweet_spot' | 'last_survivor'>('sweet_spot');

  const selectedPet: PetData = PETS[selectedPetId];

  // Sound Mute Toggle
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Generate randomized spots for the chosen pet
  const initializeSpotsForPet = (petId: PetId): ActiveSpot[] => {
    const pet = PETS[petId];
    const spotDefs = [...pet.spots];
    const count = spotDefs.length;

    // Shuffle indexes to assign outcomes
    const shuffledIndexes = spotDefs.map((_, i) => i).sort(() => Math.random() - 0.5);

    // Exactly 1 Sweet Spot
    const sweetIdx = shuffledIndexes[0];
    // 2 Danger Spots (or 3 if 8 spots)
    const dangerCount = count >= 8 ? 3 : 2;
    const dangerIndices = new Set(shuffledIndexes.slice(1, 1 + dangerCount));

    return spotDefs.map((def, idx) => {
      let outcome: SpotOutcome = 'safe';
      if (idx === sweetIdx) {
        outcome = 'sweet';
      } else if (dangerIndices.has(idx)) {
        outcome = 'danger';
      }

      return {
        ...def,
        outcome,
        state: 'unpicked',
      };
    });
  };

  // Start game from lobby -> Go to Pet Select
  const handleLobbyStart = () => {
    setPhase('PET_SELECT');
  };

  // Pet confirmed -> Go to Dice Roll
  const handlePetSelected = (petId: PetId) => {
    setSelectedPetId(petId);
    setPhase('DICE_ROLL');
  };

  // Dice roll complete -> Initialize match and start playing
  const handleDiceRollComplete = (orderedPlayers: Player[]) => {
    const initialSpots = initializeSpotsForPet(selectedPetId);
    setPlayers(orderedPlayers);
    setActiveSpots(initialSpots);
    setActivePlayerIndex(0);
    setPetMood('idle');
    setWinner(null);
    setRevealData(null);
    setPhase('PLAYING');
    sound.startBgm();
  };

  // Active player reference
  const activePlayer = players[activePlayerIndex] || players[0];

  // Execute petting of a spot
  const executePetSpot = useCallback((spot: ActiveSpot) => {
    if (phase !== 'PLAYING') return;

    // Show animated reaching hand
    setReachingCoords({ x: spot.x, y: spot.y });

    setTimeout(() => {
      setReachingCoords(null);

      // Play pet reaction sound
      sound.playPetVoice(selectedPetId, spot.outcome);

      let message = '';
      if (spot.outcome === 'sweet') {
        setPetMood('euphoric');
        message = `PURE BLISS! ${selectedPet.name} purrs loudly, roll over, and melts into your hands! You found the Golden Sweet Spot!`;
      } else if (spot.outcome === 'danger') {
        setPetMood('angry');
        if (selectedPetId === 'garfield_cat') {
          message = `SWAT! Garfield's murder mittens strike! He hissed and kicked you right out of the match!`;
        } else if (selectedPetId === 'pomeranian') {
          message = `YIP-SNAP! Princess Waffles unleashed the ankle-nibble tornado! You're eliminated!`;
        } else if (selectedPetId === 'capybara') {
          message = `REJECTED! The Zen Master was disturbed, dropped his yuzu, and gave you the cold shoulder! Eliminated!`;
        } else if (selectedPetId === 'snake') {
          message = `HISS! Slinky coiled tight, snapped his fangs, and disqualified you from petting!`;
        } else {
          message = `PINCH! Heracles clamped his mighty horn down with lightning speed! Eliminated!`;
        }
      } else {
        setPetMood('happy');
        message = `Nice and cozy! ${selectedPet.name} leans contentedly into your touch. You're safe!`;
      }

      // Update spot state
      const nextSpots = activeSpots.map((s) => {
        if (s.id === spot.id) {
          return {
            ...s,
            state: (spot.outcome === 'sweet'
              ? 'picked_sweet'
              : spot.outcome === 'danger'
              ? 'picked_danger'
              : 'picked_safe') as ActiveSpot['state'],
            pickedBy: activePlayer.id,
          };
        }
        return s;
      });
      setActiveSpots(nextSpots);

      // Trigger Outcome Modal
      setRevealData({
        player: activePlayer,
        spot,
        outcome: spot.outcome,
        message,
      });
    }, 600);
  }, [phase, selectedPetId, selectedPet.name, activeSpots, activePlayer]);

  // Handle outcome modal dismissal and turn progression
  const handleDismissOutcome = () => {
    if (!revealData) return;

    const currentOutcome = revealData.outcome;
    setRevealData(null);
    setPetMood('idle');

    // Case 1: Sweet spot found -> Sudden Death Victory!
    if (currentOutcome === 'sweet') {
      setWinner(revealData.player);
      setWinType('sweet_spot');
      setPhase('GAME_OVER');
      return;
    }

    // Case 2: Danger spot -> Player eliminated
    let updatedPlayers = [...players];
    if (currentOutcome === 'danger') {
      updatedPlayers = updatedPlayers.map((p) =>
        p.id === revealData.player.id ? { ...p, isEliminated: true } : p
      );
      setPlayers(updatedPlayers);

      // Check if only 1 player remains alive!
      const alivePlayers = updatedPlayers.filter((p) => !p.isEliminated);
      if (alivePlayers.length === 1) {
        setWinner(alivePlayers[0]);
        setWinType('last_survivor');
        setPhase('GAME_OVER');
        return;
      }
      if (alivePlayers.length === 0) {
        // Fallback draw/reset
        setWinner(revealData.player);
        setWinType('last_survivor');
        setPhase('GAME_OVER');
        return;
      }
    }

    // Advance to next active (non-eliminated) player
    let nextIdx = (activePlayerIndex + 1) % updatedPlayers.length;
    while (updatedPlayers[nextIdx].isEliminated) {
      nextIdx = (nextIdx + 1) % updatedPlayers.length;
    }
    setActivePlayerIndex(nextIdx);
  };

  // Bot Turn Automation Effect
  useEffect(() => {
    if (phase !== 'PLAYING' || revealData !== null) return;

    const currentP = players[activePlayerIndex];
    if (currentP && currentP.isBot && !currentP.isEliminated) {
      setIsBotThinking(true);

      const unpickedSpots = activeSpots.filter((s) => s.state === 'unpicked');
      if (unpickedSpots.length === 0) return;

      // Random bot choice with realistic deliberation delay
      const chosenSpot = unpickedSpots[Math.floor(Math.random() * unpickedSpots.length)];

      const timer = setTimeout(() => {
        setIsBotThinking(false);
        executePetSpot(chosenSpot);
      }, 1400 + Math.random() * 800);

      return () => {
        clearTimeout(timer);
        setIsBotThinking(false);
      };
    }
  }, [phase, activePlayerIndex, players, activeSpots, revealData, executePetSpot]);

  // Rematch with the same pet
  const handlePlayAgain = () => {
    const freshSpots = initializeSpotsForPet(selectedPetId);
    const revivedPlayers = players.map((p) => ({
      ...p,
      isEliminated: false,
      diceRoll: 0,
    }));
    setPlayers(revivedPlayers);
    setActiveSpots(freshSpots);
    setWinner(null);
    setRevealData(null);
    setPetMood('idle');
    setPhase('DICE_ROLL');
  };

  // Return to full Lobby
  const handleReturnToLobby = () => {
    const revivedPlayers = players.map((p) => ({
      ...p,
      isEliminated: false,
      diceRoll: 0,
    }));
    setPlayers(revivedPlayers);
    setWinner(null);
    setRevealData(null);
    setPetMood('idle');
    setPhase('LOBBY');
  };

  return (
    <div className="min-h-screen bg-amber-50/50 py-4 px-3 flex flex-col items-center">
      {/* 1. LOBBY PHASE */}
      {phase === 'LOBBY' && (
        <Lobby
          players={players}
          setPlayers={setPlayers}
          onStart={handleLobbyStart}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. PET SELECTOR PHASE */}
      {phase === 'PET_SELECT' && (
        <PetSelector
          onSelectPet={handlePetSelected}
          onBackToLobby={() => setPhase('LOBBY')}
        />
      )}

      {/* 3. DICE ROLL INITIATIVE MODAL */}
      {phase === 'DICE_ROLL' && (
        <DiceRollModal
          players={players}
          onCompleteRoll={handleDiceRollComplete}
        />
      )}

      {/* 4. ACTIVE GAMEPLAY PHASE */}
      {(phase === 'PLAYING' || phase === 'REVEAL') && (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <TurnBanner
            activePlayer={activePlayer}
            players={players}
            activePlayerIndex={activePlayerIndex}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            isBotThinking={isBotThinking}
          />

          <PetVisualizer
            pet={selectedPet}
            spots={activeSpots}
            activePlayer={activePlayer}
            onPickSpot={executePetSpot}
            disabled={activePlayer.isBot || isBotThinking || revealData !== null}
            petMood={petMood}
            reachingCoords={reachingCoords}
          />
        </div>
      )}

      {/* REVEAL POPUP MODAL */}
      {revealData && (
        <OutcomeModal
          data={revealData}
          onDismiss={handleDismissOutcome}
        />
      )}

      {/* 5. VICTORY SCREEN */}
      {phase === 'GAME_OVER' && winner && (
        <VictoryScreen
          winner={winner}
          pet={selectedPet}
          spots={activeSpots}
          winType={winType}
          onPlayAgain={handlePlayAgain}
          onReturnToLobby={handleReturnToLobby}
        />
      )}
    </div>
  );
};
