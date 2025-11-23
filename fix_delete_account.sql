-- 1. Fix 'profiles' table constraint
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 2. Fix 'history' table constraint
ALTER TABLE history
DROP CONSTRAINT IF EXISTS history_user_id_fkey;

ALTER TABLE history
ADD CONSTRAINT history_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;
