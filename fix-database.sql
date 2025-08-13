-- 修复数据库关系
-- 在 Supabase SQL Editor 中执行

-- 1. 确保 exhibitions 表有正确的外键约束
ALTER TABLE exhibitions 
DROP CONSTRAINT IF EXISTS exhibitions_author_id_fkey;

ALTER TABLE exhibitions 
ADD CONSTRAINT exhibitions_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. 为现有数据创建 profiles 记录（如果需要）
INSERT INTO profiles (id, username, display_name)
SELECT DISTINCT 
    e.author_id,
    COALESCE(u.email, 'user_' || substring(e.author_id::text, 1, 8)) as username,
    COALESCE(u.email, 'User') as display_name
FROM exhibitions e
LEFT JOIN auth.users u ON e.author_id = u.id
WHERE e.author_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = e.author_id)
ON CONFLICT (id) DO NOTHING;