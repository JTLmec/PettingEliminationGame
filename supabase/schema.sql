create extension if not exists pgcrypto;

create table if not exists public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (room_code ~ '^[A-Z0-9]{4,8}$'),
  host_player_id text not null,
  status text not null default 'lobby' check (status in ('lobby', 'playing', 'finished')),
  game_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists game_rooms_room_code_idx on public.game_rooms (room_code);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'game_rooms_max_players'
      and conrelid = 'public.game_rooms'::regclass
  ) then
    alter table public.game_rooms
      add constraint game_rooms_max_players
      check (jsonb_array_length(coalesce(game_state->'players', '[]'::jsonb)) <= 6);
  end if;
end $$;

alter table public.game_rooms enable row level security;

drop policy if exists "Anyone can read game rooms" on public.game_rooms;
create policy "Anyone can read game rooms"
  on public.game_rooms for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can create game rooms" on public.game_rooms;
create policy "Anyone can create game rooms"
  on public.game_rooms for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can update game rooms" on public.game_rooms;
create policy "Anyone can update game rooms"
  on public.game_rooms for update
  to anon, authenticated
  using (true)
  with check (true);

alter table public.game_rooms replica identity full;

-- Add the table to Supabase Realtime once, if it is not already present.
alter publication supabase_realtime add table public.game_rooms;
