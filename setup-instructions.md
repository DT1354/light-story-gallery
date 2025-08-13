# Next.js 项目设置指南

## 1. 创建 Next.js 项目
```bash
npx create-next-app@latest light-story-gallery --typescript --tailwind --eslint --app
cd light-story-gallery
```

## 2. 安装必要依赖
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install lucide-react react-masonry-css
npm install @headlessui/react
```

## 3. 环境变量配置
创建 `.env.local` 文件并添加你的 Supabase 配置：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```