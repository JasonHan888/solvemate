-- Create the history table
create table history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  image_url text,
  user_description text,
  result jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table history enable row level security;

-- Policy to allow users to select their own history
create policy "Users can view their own history"
  on history for select
  using ( auth.uid() = user_id );

-- Policy to allow users to insert their own history
create policy "Users can insert their own history"
  on history for insert
  with check ( auth.uid() = user_id );
