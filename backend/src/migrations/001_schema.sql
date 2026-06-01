-- ============================================================
-- CodeCraft Database Schema — Phase 1
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  display_name  text,
  avatar_url    text,
  trust_score   integer default 0 check (trust_score >= 0 and trust_score <= 1000),
  preferences   jsonb default '{}'::jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. SIMULATION COMPANIES
create table if not exists public.simulation_companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  tech_stack  text[] default '{}',
  difficulty  text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at  timestamptz default now()
);

-- 3. TICKETS (Jira-style tasks)
create table if not exists public.tickets (
  id                 uuid primary key default gen_random_uuid(),
  simulation_id      uuid references public.simulation_companies(id) on delete cascade,
  assignee_id        uuid references auth.users(id) on delete set null,
  title              text not null,
  description        text,
  acceptance_criteria text[] default '{}',
  difficulty         text check (difficulty in ('easy', 'medium', 'hard')),
  status             text default 'todo' check (status in ('todo', 'in_progress', 'in_review', 'done', 'blocked')),
  ticket_type        text default 'bug' check (ticket_type in ('bug', 'feature', 'refactor', 'chore')),
  priority           text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  repo_branch        text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- 4. PULL REQUINTS
create table if not exists public.pull_requests (
  id            uuid primary key default gen_random_uuid(),
  ticket_id     uuid references public.tickets(id) on delete cascade,
  user_id       uuid references auth.users(id) on delete cascade,
  workspace_id  uuid,
  status        text default 'open' check (status in ('open', 'approved', 'rejected')),
  diff_snapshot text,
  feedback      text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 5. SIM-SLACK MESSAGES
create table if not exists public.sim_messages (
  id            uuid primary key default gen_random_uuid(),
  simulation_id uuid references public.simulation_companies(id) on delete cascade,
  channel       text not null,
  sender_id     uuid references auth.users(id) on delete set null,
  sender_type   text default 'user' check (sender_type in ('user', 'ai_pm', 'ai_peer', 'ai_tech_lead', 'system')),
  content       text not null,
  created_at    timestamptz default now()
);

-- 6. CHAOS ENGINE EVENTS
create table if not exists public.chaos_events (
  id            uuid primary key default gen_random_uuid(),
  simulation_id uuid references public.simulation_companies(id) on delete cascade,
  event_type    text not null,
  title         text not null,
  description   text,
  severity      text default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  status        text default 'pending' check (status in ('pending', 'active', 'resolved')),
  triggered_at  timestamptz default now(),
  resolved_at   timestamptz
);

-- 7. INDEXES
create index if not exists idx_tickets_assignee on public.tickets(assignee_id);
create index if not exists idx_tickets_status on public.tickets(status);
create index if not exists idx_prs_ticket on public.pull_requests(ticket_id);
create index if not exists idx_sim_messages_channel on public.sim_messages(channel);
create index if not exists idx_sim_messages_simulation on public.sim_messages(simulation_id);

-- 8. ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.pull_requests enable row level security;
alter table public.sim_messages enable row level security;
alter table public.simulation_companies enable row level security;
alter table public.chaos_events enable row level security;

-- Users can read/update their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can read tickets assigned to them
create policy "Users can read assigned tickets"
  on public.tickets for select
  using (auth.uid() = assignee_id);

-- Users can update tickets assigned to them
create policy "Users can update assigned tickets"
  on public.tickets for update
  using (auth.uid() = assignee_id);

-- Users can read their own PRs
create policy "Users can read own PRs"
  on public.pull_requests for select
  using (auth.uid() = user_id);

-- Users can read sim messages in their simulation
create policy "Users can read sim messages"
  on public.sim_messages for select
  using (true); -- restricted by app logic in production

-- Seed data: sample simulation company
insert into public.simulation_companies (name, description, tech_stack, difficulty) values
  ('FinTechFast', 'A fast-growing fintech startup building the next-gen payment platform. You''re joining as a junior backend developer.', 
   array['React', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'], 'beginner'),
  ('CloudForge', 'A DevOps platform company. You''ll be working on infrastructure automation and monitoring tools.',
   array['Go', 'Kubernetes', 'Terraform', 'Prometheus', 'AWS'], 'intermediate');
