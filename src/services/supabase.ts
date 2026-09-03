import { createClient } from '@supabase/supabase-js';
import { Player } from '../types/game';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface GameRoom {
  id: string;
  room_code: string;
  host_player_id: string;
  status: 'lobby' | 'playing' | 'finished';
  game_state: {
    players?: Player[];
  };
}

const createRoomCode = () =>
  Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');

export const createGameRoom = async (host: Player): Promise<GameRoom> => {
  if (!supabase) throw new Error('Supabase is not configured yet. Add your .env.local values.');

  const { data, error } = await supabase
    .from('game_rooms')
    .insert({
      room_code: createRoomCode(),
      host_player_id: host.id,
      game_state: { players: [host] },
    })
    .select()
    .single();

  if (error) throw error;
  return data as GameRoom;
};

export const findGameRoom = async (roomCode: string): Promise<GameRoom> => {
  if (!supabase) throw new Error('Supabase is not configured yet. Add your .env.local values.');

  const { data, error } = await supabase
    .from('game_rooms')
    .select('*')
    .eq('room_code', roomCode.trim().toUpperCase())
    .single();

  if (error) throw error;
  return data as GameRoom;
};

export const updateRoomPlayers = async (roomId: string, players: Player[]) => {
  if (!supabase) throw new Error('Supabase is not configured yet. Add your .env.local values.');

  const { error } = await supabase
    .from('game_rooms')
    .update({ game_state: { players }, updated_at: new Date().toISOString() })
    .eq('id', roomId);

  if (error) throw error;
};

export const subscribeToRoom = (roomId: string, onChange: (room: GameRoom) => void) => {
  if (!supabase) return () => undefined;

  const channel = supabase
    .channel(`game-room-${roomId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'game_rooms',
      filter: `id=eq.${roomId}`,
    }, (payload) => onChange(payload.new as GameRoom))
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
};
