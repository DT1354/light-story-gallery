// Supabase 客户端配置
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 客户端 Supabase 实例
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 服务端 Supabase 实例
export const createServerClient = async () => {
  const cookieStore = await cookies()
  
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          return cookieStore.get(name)?.value
        },
      },
    }
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