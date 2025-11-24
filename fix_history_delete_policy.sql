-- Allow users to delete their own history items
drop policy if exists "Users can delete their own history items." on history;
create policy "Users can delete their own history items."
  on history for delete
  using ( auth.uid() = user_id );
