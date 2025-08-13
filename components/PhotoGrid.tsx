'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient, Exhibition } from '../lib/supabase-client'
import Masonry from 'react-masonry-css'
import { MapPin, Calendar, User } from 'lucide-react'

export default function PhotoGrid() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchExhibitions = async () => {
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching exhibitions:', error)
      } else {
        setExhibitions(data || [])
      }
      setLoading(false)
    }

    fetchExhibitions()
  }, [supabase])

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg animate-pulse">
              <div className="aspect-[3/4] bg-gray-300 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (exhibitions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">还没有故事分享</h3>
          <p className="text-gray-600 mb-6">成为第一个分享光影故事的人吧！</p>
          <Link
            href="/auth"
            className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            开始分享
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -ml-6"
        columnClassName="pl-6 bg-clip-padding"
      >
        {exhibitions.map((exhibition) => (
          <Link
            key={exhibition.id}
            href={`/exhibition/${exhibition.id}`}
            className="block mb-6 group"
          >
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={exhibition.photo_url}
                  alt="摄影作品"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              <div className="p-4">
                <p className="text-gray-800 text-sm line-clamp-3 mb-3 leading-relaxed">
                  {exhibition.photo_story}
                </p>

                <div className="space-y-2 text-xs text-gray-500">
                  {exhibition.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{exhibition.location}</span>
                    </div>
                  )}

                  {exhibition.date_taken && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(exhibition.date_taken).toLocaleDateString('zh-CN')}</span>
                    </div>
                  )}

                  {exhibition.profiles?.display_name && (
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{exhibition.profiles.display_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </Masonry>
    </div>
  )
}