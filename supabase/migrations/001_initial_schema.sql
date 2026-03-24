-- Enable pgvector extension
create extension if not exists vector;

-- 1. People (contacts/participants)
create table people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  display_name text,
  email text unique,
  role text,
  company text,
  relationship text check (relationship in ('report_direto', 'superior', 'stakeholder', 'externo', 'par')),
  area text,
  preferred_channel text,
  notes text,
  aliases text[] default '{}',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references people(id) on delete set null,
  status text default 'active' check (status in ('planning', 'active', 'paused', 'done')),
  priority text default 'P2' check (priority in ('P0', 'P1', 'P2', 'P3')),
  deadline date,
  description text,
  meta_institucional text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Transcriptions
create table transcriptions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date timestamptz,
  raw_content text not null,
  file_url text,
  file_format text check (file_format in ('vtt', 'docx', 'txt')),
  duration_minutes int,
  status text default 'uploaded' check (status in ('uploaded', 'processing', 'completed', 'error')),
  error_message text,
  ai_model_used text,
  token_count int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- FTS on transcriptions (portuguese)
alter table transcriptions add column search_vector tsvector
  generated always as (to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(raw_content, ''))) stored;
create index idx_transcriptions_fts on transcriptions using gin(search_vector);

-- 4. Transcription participants (many-to-many)
create table transcription_participants (
  id uuid primary key default gen_random_uuid(),
  transcription_id uuid not null references transcriptions(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  speaker_name text not null,
  is_confirmed boolean default false,
  created_at timestamptz default now(),
  unique(transcription_id, speaker_name)
);

-- 5. Minutes (AI-generated meeting notes)
create table minutes (
  id uuid primary key default gen_random_uuid(),
  transcription_id uuid not null unique references transcriptions(id) on delete cascade,
  summary text not null,
  key_topics jsonb default '[]',
  raw_ai_response jsonb,
  status text default 'draft' check (status in ('draft', 'reviewed', 'final')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- FTS on minutes
alter table minutes add column search_vector tsvector
  generated always as (to_tsvector('portuguese', coalesce(summary, ''))) stored;
create index idx_minutes_fts on minutes using gin(search_vector);

-- 6. Tasks / Action Items
create table tasks (
  id uuid primary key default gen_random_uuid(),
  transcription_id uuid references transcriptions(id) on delete set null,
  minutes_id uuid references minutes(id) on delete set null,
  title text not null,
  description text,
  assignee_id uuid references people(id) on delete set null,
  assignee_name text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'done', 'cancelled')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  due_date date,
  completed_at timestamptz,
  project_id uuid references projects(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Decisions
create table decisions (
  id uuid primary key default gen_random_uuid(),
  transcription_id uuid references transcriptions(id) on delete set null,
  minutes_id uuid references minutes(id) on delete set null,
  title text not null,
  description text,
  decided_by uuid references people(id) on delete set null,
  decided_by_name text,
  impact text,
  project_id uuid references projects(id) on delete set null,
  created_at timestamptz default now()
);

-- 8. Commitments
create table commitments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  with_whom_id uuid references people(id) on delete set null,
  deadline date,
  status text default 'pending' check (status in ('pending', 'in_progress', 'done', 'cancelled')),
  type text check (type in ('eu_prometi', 'me_prometeram', 'delegado')),
  context text,
  project_id uuid references projects(id) on delete set null,
  transcription_id uuid references transcriptions(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Embeddings for semantic search
create table embeddings (
  id uuid primary key default gen_random_uuid(),
  source_table text not null,
  source_id uuid not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

-- Indexes
create index idx_embeddings_vector on embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index idx_tasks_assignee on tasks(assignee_id);
create index idx_tasks_status on tasks(status);
create index idx_tasks_due_date on tasks(due_date);
create index idx_transcription_participants_person on transcription_participants(person_id);
create index idx_transcription_participants_transcription on transcription_participants(transcription_id);
create index idx_commitments_deadline on commitments(deadline);
create index idx_commitments_status on commitments(status);
create index idx_decisions_transcription on decisions(transcription_id);
create index idx_projects_status on projects(status);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger tr_people_updated_at before update on people for each row execute function update_updated_at();
create trigger tr_projects_updated_at before update on projects for each row execute function update_updated_at();
create trigger tr_transcriptions_updated_at before update on transcriptions for each row execute function update_updated_at();
create trigger tr_minutes_updated_at before update on minutes for each row execute function update_updated_at();
create trigger tr_tasks_updated_at before update on tasks for each row execute function update_updated_at();
create trigger tr_commitments_updated_at before update on commitments for each row execute function update_updated_at();
