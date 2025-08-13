-- 创建 exhibitions 表
CREATE TABLE exhibitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    photo_url TEXT NOT NULL,
    photo_story TEXT NOT NULL,
    location TEXT,
    date_taken DATE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建 profiles 表
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 启用行级别安全
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Anyone can view exhibitions" ON exhibitions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert exhibitions" ON exhibitions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own exhibitions" ON exhibitions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own exhibitions" ON exhibitions FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 创建存储桶
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- 存储桶安全策略
CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos' AND auth.uid() = owner);