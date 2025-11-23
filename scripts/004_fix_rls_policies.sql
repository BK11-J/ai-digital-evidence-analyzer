-- Drop the problematic recursive admin policy
drop policy if exists "Admins can view all users" on public.users;

-- Create a safer admin policy using a function to avoid recursion
-- Instead of querying users table, we'll trust is_admin flag on auth.jwt()
-- For admin operations, use authenticated access from app via admin service role
-- Users table now only allows:
-- 1. Users viewing/updating their own data
-- 2. Service role (backend) can access everything for admin operations
