-- 光影故事客厅 - 修正版数据库设置
-- 在 Supabase SQL Editor 中执行以下代码

-- 1. 启用 exhibitions 表的行级别安全
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- 2. 删除可能存在的旧策略（避免重复）
DROP POLICY IF EXISTS "Anyone can view published exhibitions" ON exhibitions;
DROP POLICY IF EXISTS "Authenticated users can insert exhibitions" ON exhibitions;
DROP POLICY IF EXISTS "Users can update own exhibitions" ON exhibitions;
DROP POLICY IF EXISTS "Users can delete own exhibitions" ON exhibitions;

-- 3. 创建新的安全策略
CREATE POLICY "Anyone can view published exhibitions" ON exhibitions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert exhibitions" ON exhibitions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own exhibitions" ON exhibitions
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own exhibitions" ON exhibitions
    FOR DELETE USING (auth.uid() = author_id);

-- 4. 存储桶策略（photos 桶已存在，只设置策略）
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;

CREATE POLICY "Anyone can view photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'photos' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete own photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'photos' 
        AND auth.uid() = owner
    );

-- 5. 创建用户资料表
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- 6. 启用 profiles 表的 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. 删除可能存在的旧策略
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 8. 创建 profiles 表策略
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);