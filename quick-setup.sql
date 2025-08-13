-- 快速设置 - 复制这段代码到 Supabase SQL Editor 执行

-- 1. 创建 exhibitions 表
CREATE TABLE IF NOT EXISTS exhibitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    photo_url TEXT NOT NULL,
    photo_story TEXT NOT NULL,
    location TEXT,
    date_taken DATE,
    author_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 创建 profiles 表
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 启用行级别安全（暂时允许所有操作，方便测试）
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. 创建宽松的安全策略（测试用）
CREATE POLICY "Allow all for exhibitions" ON exhibitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- 5. 创建存储桶
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true) 
ON CONFLICT (id) DO NOTHING;

-- 6. 存储桶策略
CREATE POLICY "Allow all storage operations" ON storage.objects FOR ALL USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');