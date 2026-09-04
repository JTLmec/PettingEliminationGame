import React from 'react';
import { Player } from '../types/game';
import { AVATARS, PLAYER_COLORS, BOT_NAMES } from '../data/pets';
import { Users, Bot, User, Play, Sparkles, Volume2, VolumeX, Dice5, Link, LogIn, LogOut } from 'lucide-react';
import { sound } from '../services/audio';

interface LobbyProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onStart: () => void;
  roomCode: string | null;
  onlineError: string | null;
  isOnlineConfigured: boolean;
  onCreateRoom: () => void;
  onJoinRoom: (roomCode: string) => void;
  onLeaveRoom: () => void;
  isOnlineRoom: boolean;
  isRoomHost: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  players,
  setPlayers,
  onStart,
  roomCode,
  onlineError,
  isOnlineConfigured,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  isOnlineRoom,
  isRoomHost,
  isMuted,
  onToggleMute,
}) => {
  const [joinCode, setJoinCode] = React.useState('');
  const [showJoinRoom, setShowJoinRoom] = React.useState(!roomCode);

  const handleJoinInput = (value: string) => {
    try {
      const parsedUrl = new URL(value);
      const roomFromUrl = parsedUrl.searchParams.get('room');
      setJoinCode(roomFromUrl ?? value.toUpperCase());
    } catch {
      const roomMatch = value.match(/[?&]room=([A-Z0-9]+)/i);
      setJoinCode((roomMatch?.[1] ?? value).toUpperCase());
    }
  };

  const setPlayerCount = (count: number) => {
    sound.playClick();
    if (isOnlineRoom) return;
    if (count > players.length) {
      const newPlayers: Player[] = [...players];
      for (let i = players.length; i < count; i++) {
        const botName = BOT_NAMES[i % BOT_NAMES.length];
        const color = PLAYER_COLORS[i % PLAYER_COLORS.length].bg;
        newPlayers.push({
          id: `player_${Date.now()}_${i}`,
          name: i === 0 ? 'Player 1' : botName,
          avatar: AVATARS[i % AVATARS.length],
          color,
          isBot: i > 0, // First is human, others default to bot for easy solo play
          isEliminated: false,
          diceRoll: 0,
          score: 0,
        });
      }
      setPlayers(newPlayers);
    } else if (count < players.length) {
      setPlayers(players.slice(0, count));
    }
  };

  const togglePlayerBot = (index: number) => {
    sound.playClick();
    if (isOnlineRoom) return;
    setPlayers((prev) => {
      const updated = [...prev];
      const nextIsBot = !updated[index].isBot;
      updated[index] = {
        ...updated[index],
        isBot: nextIsBot,
        name: nextIsBot ? BOT_NAMES[index % BOT_NAMES.length] : `Player ${index + 1}`,
      };
      return updated;
    });
  };

  const localPlayerId = typeof window !== 'undefined' ? window.localStorage.getItem('petting-player-id') : null;

  const canEditProfile = (player: Player) => !isOnlineRoom || player.id === localPlayerId;

  const updatePlayerName = (index: number, name: string) => {
    const player = players[index];
    if (!canEditProfile(player)) return;
    setPlayers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const cycleAvatar = (index: number) => {
    const player = players[index];
    if (!canEditProfile(player)) return;
    sound.playClick();
    setPlayers((prev) => {
      const updated = [...prev];
      const currentIdx = AVATARS.indexOf(updated[index].avatar);
      const nextIdx = (currentIdx + 1) % AVATARS.length;
      updated[index] = { ...updated[index], avatar: AVATARS[nextIdx] };
      return updated;
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center py-4 px-2 sm:px-4 max-w-4xl mx-auto w-full">
      {/* Top Header with Audio Toggle */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-200/80 px-3 sm:px-4 py-1.5 rounded-full border border-amber-300 shadow-sm text-xs sm:text-sm font-bold text-amber-900">
          <Dice5 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
          <span>High-Stakes Pet Party</span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition active:scale-95"
          title={isMuted ? 'Unmute Sound & Music' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />}
        </button>
      </div>

      <div className="w-full bg-slate-900 text-white rounded-3xl p-5 shadow-xl mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Link className="w-5 h-5 text-amber-300" />
          <h2 className="font-black text-lg">Play online with friends</h2>
        </div>
        {roomCode ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-slate-300 mb-1">Share this room code</p>
              <p className="text-2xl font-black tracking-[0.25em] text-amber-300">{roomCode}</p>
            </div>
            <button
              onClick={() => void navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?room=${roomCode}`)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm"
            >
              Copy invite link
            </button>
            <button
              onClick={() => setShowJoinRoom((visible) => !visible)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm"
            >
              Join a room
            </button>
            <button
              onClick={onLeaveRoom}
              className="px-4 py-2 rounded-xl bg-rose-500/90 hover:bg-rose-400 text-white font-black text-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Leave room
            </button>
          </div>
        ) : null}
        {showJoinRoom && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCreateRoom}
              disabled={!isOnlineConfigured}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-600 disabled:text-slate-400 text-slate-950 font-black"
            >
              Create room
            </button>
            <div className="flex flex-1 gap-2">
              <input
                value={joinCode}
                onChange={(event) => handleJoinInput(event.target.value)}
                placeholder="ROOM CODE OR LINK"
                className="min-w-0 flex-1 px-3 py-2 rounded-xl bg-white text-slate-900 font-bold uppercase outline-none"
              />
              <button
                onClick={() => onJoinRoom(joinCode)}
                disabled={!isOnlineConfigured || joinCode.length < 4}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:text-slate-400 text-slate-950 font-black flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Join
              </button>
            </div>
          </div>
        )}
        {!isOnlineConfigured && <p className="text-xs text-slate-400 mt-3">Add your Supabase values to .env.local to enable online rooms.</p>}
        {onlineError && <p className="text-xs text-rose-300 mt-3">{onlineError}</p>}
      </div>

      {/* Main Title Card */}
      <div className="text-center mb-6 sm:mb-8 px-2">
        <div className="inline-flex items-center gap-2 text-3xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight drop-shadow-sm mb-2">
          <span>Petting Roulette</span>
          <span className="animate-bounce">🐾</span>
        </div>
        <p className="text-sm sm:text-base md:text-xl text-amber-800/90 font-medium max-w-xl mx-auto leading-snug">
          Roll the dice for turn order. Pet the animal. Find the <span className="font-bold text-emerald-600">Sweet Spot</span> to instantly win, or touch the wrong spot and get <span className="font-bold text-rose-600">ELIMINATED</span>!
        </p>
      </div>

      {/* Player Count Bar */}
      <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-200 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Player Roster</h2>
              <p className="text-sm text-slate-500">{isOnlineRoom ? `Players in room: ${players.length}/6` : 'Pick 2 to 6 contestants (Humans or AI Bots)'}</p>
            </div>
          </div>

          {/* Quick Count Selectors */}
          <div className="flex items-center gap-2">
            {[2, 3, 4, 5, 6].map((count) => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`w-11 h-11 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center shadow-sm ${
                  players.length === count
                    ? 'bg-amber-500 text-white shadow-amber-300 shadow-md scale-105'
                    : 'bg-amber-100/70 hover:bg-amber-200 text-amber-900'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Player Slot Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className={`relative rounded-2xl p-4 border-2 transition-all shadow-sm bg-white hover:shadow-md flex flex-col gap-3 ${
                player.isBot ? 'border-dashed border-slate-300' : 'border-solid border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Seat #{idx + 1}
                </span>
                {/* Bot / Human Switch */}
                <button
                  onClick={() => togglePlayerBot(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${
                    player.isBot
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                  title="Click to toggle between Human and Bot"
                >
                  {player.isBot ? (
                    <>
                      <Bot className="w-3.5 h-3.5" />
                      <span>CPU Bot</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5" />
                      <span>Human</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Avatar Icon */}
                <button
                  onClick={() => cycleAvatar(idx)}
                  disabled={!canEditProfile(player)}
                  className="text-3xl p-2 bg-slate-100 hover:bg-amber-100 rounded-2xl transition active:scale-90 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={canEditProfile(player) ? 'Click to change avatar' : 'Locked to this player profile'}
                >
                  {player.avatar}
                </button>

                {/* Name Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(idx, e.target.value)}
                    maxLength={16}
                    disabled={!canEditProfile(player)}
                    className="w-full px-3 py-1.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-amber-400 text-sm font-bold text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {player.isBot ? 'Plays automatically' : canEditProfile(player) ? 'Pass & Play' : 'Shared player'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start Game Action */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onStart();
            }}
            disabled={isOnlineRoom && !isRoomHost}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-400 disabled:shadow-none text-white text-xl font-black rounded-2xl shadow-lg shadow-orange-300/50 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
            <span>{isOnlineRoom && !isRoomHost ? 'Waiting for Host' : 'Select Your Pet & Play!'}</span>
            <Play className="w-6 h-6 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

