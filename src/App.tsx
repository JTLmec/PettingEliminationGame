import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { RotateCcw } from 'lucide-react';
import {
  createGameRoom,
  findGameRoom,
  isSupabaseConfigured,
  subscribeToRoom,
  updateRoomPlayers,
  updateRoomGameState,
  GameRoom,
} from './services/supabase';

export const App: React.FC = () => {
  // --- Game State ---
  const [phase, setPhase] = useState<GamePhase>('LOBBY');
  const [selectedPetId, setSelectedPetId] = useState<PetId>('garfield_cat');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const [selectorPlayerId, setSelectorPlayerId] = useState<string | null>(null);

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
  const roomSyncTimerRef = useRef<number | null>(null);

  const selectedPet: PetData = PETS[selectedPetId];

  const getLocalPlayerId = () => {
    const storedPlayerId = window.localStorage.getItem('petting-player-id');
    if (storedPlayerId && !/^p\d+$/.test(storedPlayerId)) return storedPlayerId;

    const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem('petting-player-id', playerId);
    return playerId;
  };

  const isRoomHost = !room || room.host_player_id === window.localStorage.getItem('petting-player-id');
  const canSelectPet = !room || selectorPlayerId === window.localStorage.getItem('petting-player-id');

  useEffect(() => {
    const roomCode = new URLSearchParams(window.location.search).get('room');
    if (!roomCode || !isSupabaseConfigured) return;

    findGameRoom(roomCode)
      .then(async (foundRoom) => {
        const roomPlayers = foundRoom.game_state.players ?? [];
        const playerId = getLocalPlayerId();
        const existingPlayer = roomPlayers.find((player) => player.id === playerId);
        const joinedPlayers = existingPlayer
          ? roomPlayers
          : [...roomPlayers, { ...players[0], id: playerId, isBot: false }];

        if (!existingPlayer) await updateRoomPlayers(foundRoom.id, joinedPlayers);
        const joinedRoom = { ...foundRoom, game_state: { ...foundRoom.game_state, players: joinedPlayers } };
        setRoom(joinedRoom);
        setPlayers(joinedPlayers);
        if (foundRoom.game_state.selectedPetId && foundRoom.game_state.selectedPetId in PETS) {
          setSelectedPetId(foundRoom.game_state.selectedPetId as PetId);
        }
        setSelectorPlayerId(foundRoom.game_state.selectorPlayerId ?? null);
        if (foundRoom.game_state.activeSpots) setActiveSpots(foundRoom.game_state.activeSpots);
        if (foundRoom.game_state.activePlayerIndex !== undefined) setActivePlayerIndex(foundRoom.game_state.activePlayerIndex);
        if (foundRoom.game_state.phase) setPhase(foundRoom.game_state.phase);
        window.history.replaceState({}, '', `${window.location.pathname}?room=${foundRoom.room_code}`);
      })
      .catch(() => setOnlineError('That room could not be found. Check the room code and try again.'));
  }, []);

  useEffect(() => {
    if (!room) return;
    const applyRoomUpdate = (updatedRoom: GameRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom.game_state.players) setPlayers(updatedRoom.game_state.players);
      if (updatedRoom.game_state.selectedPetId && updatedRoom.game_state.selectedPetId in PETS) {
        setSelectedPetId(updatedRoom.game_state.selectedPetId as PetId);
      }
      setSelectorPlayerId(updatedRoom.game_state.selectorPlayerId ?? null);
      if (updatedRoom.game_state.activeSpots) setActiveSpots(updatedRoom.game_state.activeSpots);
      if (updatedRoom.game_state.activePlayerIndex !== undefined) setActivePlayerIndex(updatedRoom.game_state.activePlayerIndex);
      if (updatedRoom.game_state.phase) setPhase(updatedRoom.game_state.phase);
      if (updatedRoom.game_state.winner !== undefined) setWinner(updatedRoom.game_state.winner ?? null);
      if (updatedRoom.game_state.winType) setWinType(updatedRoom.game_state.winType);
      if (updatedRoom.game_state.revealData !== undefined) setRevealData(updatedRoom.game_state.revealData ?? null);
    };
    const unsubscribe = subscribeToRoom(room.id, applyRoomUpdate);
    const refreshTimer = window.setInterval(() => {
      findGameRoom(room.room_code).then(applyRoomUpdate).catch(() => undefined);
    }, 3000);

    return () => {
      unsubscribe();
      window.clearInterval(refreshTimer);
    };
  }, [room?.id]);

  const handleCreateRoom = async () => {
    setOnlineError(null);
    try {
      const host = { ...players[0], id: getLocalPlayerId(), isBot: false };
      const createdRoom = await createGameRoom(host);
      setRoom(createdRoom);
      window.history.replaceState({}, '', `${window.location.pathname}?room=${createdRoom.room_code}`);
    } catch (error) {
      setOnlineError(error instanceof Error ? error.message : 'Unable to create a room.');
    }
  };

  const handleJoinRoom = async (roomCode: string) => {
    setOnlineError(null);
    try {
      const foundRoom = await findGameRoom(roomCode);
      const playerId = getLocalPlayerId();
      const currentPlayer = { ...players[0], id: playerId, isBot: false };
      const roomPlayers = foundRoom.game_state.players ?? [];
      if (roomPlayers.length >= 6 && !roomPlayers.some((player) => player.id === currentPlayer.id)) {
        throw new Error('This room is full. The maximum is 6 players.');
      }
      const updatedPlayers = roomPlayers.some((player) => player.id === currentPlayer.id)
        ? roomPlayers
        : [...roomPlayers, currentPlayer];
      if (updatedPlayers.length !== roomPlayers.length) {
        await updateRoomPlayers(foundRoom.id, updatedPlayers);
      }
      setRoom({ ...foundRoom, game_state: { players: updatedPlayers } });
      setPlayers(updatedPlayers);
      window.history.replaceState({}, '', `${window.location.pathname}?room=${foundRoom.room_code}`);
    } catch (error) {
      setOnlineError(error instanceof Error ? `Unable to join room: ${error.message}` : 'Unable to join that room.');
    }
  };

  const handleLeaveRoom = () => {
    setRoom(null);
    setSelectorPlayerId(null);
    setPhase('LOBBY');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleResetSession = () => {
    window.localStorage.removeItem('petting-room-code');
    window.localStorage.removeItem('petting-player-id');
    window.location.assign(window.location.pathname);
  };

  const setLobbyPlayers: React.Dispatch<React.SetStateAction<Player[]>> = (nextPlayers) => {
    setPlayers((currentPlayers) => {
      const updatedPlayers = typeof nextPlayers === 'function'
        ? nextPlayers(currentPlayers)
        : nextPlayers;

      if (room) {
        if (roomSyncTimerRef.current) {
          window.clearTimeout(roomSyncTimerRef.current);
        }

        roomSyncTimerRef.current = window.setTimeout(() => {
          void updateRoomPlayers(room.id, updatedPlayers);
        }, 250);
      }

      return updatedPlayers;
    });
  };

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
    if (!isRoomHost) return;
    setPhase('DICE_ROLL');
    if (room) void updateRoomGameState(room, { phase: 'DICE_ROLL' });
  };

  // Pet confirmed -> Go to Dice Roll
  const handlePetSelected = (petId: PetId) => {
    if (!canSelectPet) return;
    const freshSpots = initializeSpotsForPet(petId);
    setSelectedPetId(petId);
    setActiveSpots(freshSpots);
    setActivePlayerIndex(0);
    setPetMood('idle');
    setWinner(null);
    setRevealData(null);
    setPhase('PLAYING');
    if (room) {
      void updateRoomGameState(room, {
        phase: 'PLAYING',
        selectedPetId: petId,
        activePlayerIndex: 0,
        activeSpots: freshSpots,
      });
    }
  };

  // Dice roll complete -> Highest roller chooses the pet
  const handleDiceRollComplete = (orderedPlayers: Player[]) => {
    setPlayers(orderedPlayers);
    const diceWinner = orderedPlayers[0];
    setSelectorPlayerId(diceWinner.id);
    setPhase('PET_SELECT');
    if (room) {
      void updateRoomGameState(room, {
        players: orderedPlayers,
        selectorPlayerId: diceWinner.id,
        phase: 'PET_SELECT',
      });
    }
  };

  // Active player reference
  const activePlayer = players[activePlayerIndex] || players[0];
  const canPet = !room || activePlayer.id === window.localStorage.getItem('petting-player-id');

  // Execute petting of a spot
  const executePetSpot = useCallback((spot: ActiveSpot) => {
    if (phase !== 'PLAYING') return;
    if (room && activePlayer.id !== window.localStorage.getItem('petting-player-id')) return;

    const resolvedSpot = activeSpots.find((s) => s.id === spot.id) ?? spot;
    const resolvedOutcome = resolvedSpot.outcome;

    // Show animated reaching hand
    setReachingCoords({ x: spot.x, y: spot.y });

    setTimeout(() => {
      setReachingCoords(null);

      // Play pet reaction sound
      sound.playPetVoice(selectedPetId, resolvedOutcome);

      let message = '';
      if (resolvedOutcome === 'sweet') {
        setPetMood('euphoric');
        message = `PURE BLISS! ${selectedPet.name} purrs loudly, roll over, and melts into your hands! You found the Golden Sweet Spot!`;
      } else if (resolvedOutcome === 'danger') {
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
        if (s.id === resolvedSpot.id) {
          return {
            ...s,
            state: (resolvedOutcome === 'sweet'
              ? 'picked_sweet'
              : resolvedOutcome === 'danger'
              ? 'picked_danger'
              : 'picked_safe') as ActiveSpot['state'],
            pickedBy: activePlayer.id,
          };
        }
        return s;
      });
      setActiveSpots(nextSpots);

      const reveal = {
        player: activePlayer,
        spot: resolvedSpot,
        outcome: resolvedOutcome,
        message,
      };

      // Trigger Outcome Modal for all clients in the room
      setRevealData(reveal);
      if (room) {
        void updateRoomGameState(room, {
          players,
          activePlayerIndex,
          activeSpots: nextSpots,
          phase: 'PLAYING',
          revealData: reveal,
        });
      }
    }, 600);
  }, [phase, selectedPetId, selectedPet.name, activeSpots, activePlayer, room, players, activePlayerIndex]);

  // Handle outcome modal dismissal and turn progression
  const handleDismissOutcome = () => {
    if (!revealData) return;

    const currentOutcome = revealData.outcome;
    const latestPlayers = room?.game_state.players ?? players;
    const latestActiveSpots = room?.game_state.activeSpots ?? activeSpots;

    setRevealData(null);
    if (room) {
      void updateRoomGameState(room, {
        players: latestPlayers,
        activePlayerIndex,
        activeSpots: latestActiveSpots,
        phase: 'PLAYING',
        revealData: null,
      });
    }
    setPetMood('idle');

    // Case 1: Sweet spot found -> Sudden Death Victory!
    if (currentOutcome === 'sweet') {
      const sweetWinner = revealData.player;
      setWinner(sweetWinner);
      setWinType('sweet_spot');
      setPhase('GAME_OVER');
      if (room) {
        void updateRoomGameState(room, {
          players: latestPlayers,
          activePlayerIndex,
          activeSpots: latestActiveSpots,
          phase: 'GAME_OVER',
          winner: sweetWinner,
          winType: 'sweet_spot',
          revealData: null,
        });
      }
      return;
    }

    // Case 2: Danger spot -> Player eliminated
    let updatedPlayers = [...latestPlayers];
    if (currentOutcome === 'danger') {
      updatedPlayers = updatedPlayers.map((p) =>
        p.id === revealData.player.id ? { ...p, isEliminated: true } : p
      );
      setPlayers(updatedPlayers);

      // Check if only 1 player remains alive!
      const alivePlayers = updatedPlayers.filter((p) => !p.isEliminated);
      if (alivePlayers.length === 1) {
        const lastSurvivor = alivePlayers[0];
        setWinner(lastSurvivor);
        setWinType('last_survivor');
        setPhase('GAME_OVER');
        if (room) {
          void updateRoomGameState(room, {
            players: updatedPlayers,
            activePlayerIndex,
            activeSpots: latestActiveSpots,
            phase: 'GAME_OVER',
            winner: lastSurvivor,
            winType: 'last_survivor',
            revealData: null,
          });
        }
        return;
      }
      if (alivePlayers.length === 0) {
        // Fallback draw/reset
        const fallbackWinner = revealData.player;
        setWinner(fallbackWinner);
        setWinType('last_survivor');
        setPhase('GAME_OVER');
        if (room) {
          void updateRoomGameState(room, {
            players: updatedPlayers,
            activePlayerIndex,
            activeSpots: latestActiveSpots,
            phase: 'GAME_OVER',
            winner: fallbackWinner,
            winType: 'last_survivor',
            revealData: null,
          });
        }
        return;
      }
    }

    // Advance to next active (non-eliminated) player
    let nextIdx = (activePlayerIndex + 1) % updatedPlayers.length;
    while (updatedPlayers[nextIdx]?.isEliminated) {
      nextIdx = (nextIdx + 1) % updatedPlayers.length;
    }
    setActivePlayerIndex(nextIdx);
    if (room) {
      void updateRoomGameState(room, {
        players: updatedPlayers,
        activePlayerIndex: nextIdx,
        activeSpots: latestActiveSpots,
        phase: 'PLAYING',
        revealData: null,
      });
    }
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
    if (room) {
      void updateRoomGameState(room, {
        players: revivedPlayers,
        activePlayerIndex: 0,
        activeSpots: freshSpots,
        phase: 'DICE_ROLL',
        winner: null,
        winType: 'sweet_spot',
      });
    }
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
    if (room) {
      void updateRoomGameState(room, {
        players: revivedPlayers,
        activePlayerIndex: 0,
        activeSpots: [],
        phase: 'LOBBY',
        winner: null,
        winType: 'sweet_spot',
      });
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50 py-4 px-3 flex flex-col items-center">
      {(room || phase !== 'LOBBY') && (
        <button
          onClick={handleResetSession}
          className="fixed top-3 right-3 z-40 p-2.5 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-rose-50 hover:text-rose-600 transition"
          title="Reset session and return to main lobby"
          aria-label="Reset session and return to main lobby"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      )}
      {/* 1. LOBBY PHASE */}
      {phase === 'LOBBY' && (
        <Lobby
          players={players}
          setPlayers={setLobbyPlayers}
          onStart={handleLobbyStart}
          roomCode={room?.room_code ?? null}
          onlineError={onlineError}
          isOnlineConfigured={isSupabaseConfigured}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onLeaveRoom={handleLeaveRoom}
          isOnlineRoom={room !== null}
          isRoomHost={isRoomHost}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. PET SELECTOR PHASE */}
      {phase === 'PET_SELECT' && canSelectPet && (
        <PetSelector
          onSelectPet={handlePetSelected}
          onBackToLobby={() => setPhase('LOBBY')}
        />
      )}

      {phase === 'PET_SELECT' && !canSelectPet && (
        <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 max-w-md">
            <div className="text-5xl mb-4">🐾</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Waiting for the dice winner</h2>
            <p className="text-slate-500 font-medium">The player with the highest roll is choosing which pet everyone will play.</p>
          </div>
        </div>
      )}

      {/* 3. DICE ROLL INITIATIVE MODAL */}
      {phase === 'DICE_ROLL' && isRoomHost && (
        <DiceRollModal
          players={players}
          onCompleteRoll={handleDiceRollComplete}
        />
      )}

      {phase === 'DICE_ROLL' && !isRoomHost && (
        <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 max-w-md">
            <div className="text-5xl mb-4">🎲</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">The host is rolling</h2>
            <p className="text-slate-500 font-medium">The highest roll will choose the pet for everyone.</p>
          </div>
        </div>
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
            disabled={!canPet || activePlayer.isBot || isBotThinking || revealData !== null}
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
