// 客户端专用 Supabase 配置
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 数据库类型定义
export interface Exhibition {
  id: string
  photo_url: string
  photo_story: string
  location: string
  date_taken: string
  author_id: string
  created_at: string
  profiles?: {
    display_name: string
    username: string
  }
}

export interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url?: string
  created_at: string
}