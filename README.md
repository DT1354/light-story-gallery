# 光影故事客厅

一个温暖的线上摄影故事分享社区，让用户通过视觉和文字连接情感，分享感动的瞬间。

## 功能特性

- 📸 **摄影作品展示** - 响应式瀑布流布局展示所有作品
- 📝 **故事分享** - 每张照片都配有温暖的文字故事
- 👤 **用户系统** - 完整的注册、登录和用户认证
- 🔒 **安全保护** - 基于 Supabase RLS 的数据安全策略
- 📱 **响应式设计** - 完美适配各种设备屏幕
- 🎨 **优美界面** - 温暖的渐变色彩和流畅的动画效果

## 技术栈

- **前端**: Next.js 14 + React + TypeScript + Tailwind CSS
- **后端**: Supabase (数据库 + 认证 + 存储)
- **部署**: Vercel / Netlify

## 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd light-story-gallery
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 配置 Supabase 数据库
在 Supabase SQL Editor 中执行 `supabase-rls-policies.sql` 文件中的 SQL 代码。

### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 项目结构

```
light-story-gallery/
├── app/                    # Next.js 13+ App Router
│   ├── auth/              # 认证页面
│   ├── exhibition/[id]/   # 作品详情页
│   ├── submit/            # 作品提交页
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── Header.tsx         # 网站头部
│   ├── PhotoGrid.tsx      # 照片网格
│   └── SubmitForm.tsx     # 提交表单
├── lib/                   # 工具库
│   └── supabase.ts        # Supabase 客户端配置
└── supabase-rls-policies.sql # 数据库安全策略
```

## 数据库结构

### exhibitions 表
- `id` (uuid, primary key)
- `photo_url` (text) - 照片URL
- `photo_story` (text) - 照片故事
- `location` (text) - 拍摄地点
- `date_taken` (date) - 拍摄日期
- `author_id` (uuid) - 作者ID
- `created_at` (timestamp) - 创建时间

### profiles 表
- `id` (uuid, primary key)
- `username` (text, unique) - 用户名
- `display_name` (text) - 显示名称
- `avatar_url` (text) - 头像URL
- `created_at` (timestamp) - 创建时间

## 部署

### Vercel 部署
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### Netlify 部署
1. 将代码推送到 GitHub
2. 在 Netlify 中导入项目
3. 构建命令: `npm run build`
4. 发布目录: `.next`
5. 配置环境变量

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License