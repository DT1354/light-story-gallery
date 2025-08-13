-- 光影故事客厅 - Supabase RLS 安全策略
-- 在 Supabase SQL Editor 中执行以下代码

-- 1. 启用 exhibitions 表的行级别安全
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- 2. 允许所有人查看已发布的作品（访客浏览功能）
CREATE POLICY "Anyone can view published exhibitions" ON exhibitions
    FOR SELECT USING (true);

-- 3. 只允许认证用户插入新作品
CREATE POLICY "Authenticated users can insert exhibitions" ON exhibitions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. 只允许作品作者更新自己的作品
CREATE POLICY "Users can update own exhibitions" ON exhibitions
    FOR UPDATE USING (auth.uid() = author_id);

-- 5. 只允许作品作者删除自己的作品
CREATE POLICY "Users can delete own exhibitions" ON exhibitions
    FOR DELETE USING (auth.uid() = author_id);

-- 6. 创建存储桶用于图片文件（如果还没有创建）
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true);

-- 7. 设置存储桶的安全策略
-- 允许所有人查看图片
CREATE POLICY "Anyone can view photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

-- 只允许认证用户上传图片
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'photos' 
        AND auth.role() = 'authenticated'
    );

-- 只允许用户删除自己上传的图片
CREATE POLICY "Users can delete own photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'photos' 
        AND auth.uid() = owner
    );

-- 8. 创建用户资料表（可选，用于存储用户昵称等信息）
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- 启用 profiles 表的 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看用户资料
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- 用户只能更新自己的资料
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 用户可以插入自己的资料
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);