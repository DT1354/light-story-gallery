import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerClient } from '../../../lib/supabase'
import { ArrowLeft, MapPin, Calendar, User, Heart } from 'lucide-react'

interface ExhibitionPageProps {
    params: {
        id: string
    }
}

export default async function ExhibitionPage({ params }: ExhibitionPageProps) {
    const supabase = await createServerClient()

    const { data: exhibition, error } = await supabase
        .from('exhibitions')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !exhibition) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 返回按钮 */}
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span>返回首页</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* 图片展示 */}
                    <div className="space-y-6">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={exhibition.photo_url}
                                alt="摄影作品"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>

                        {/* 图片信息卡片 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                            <div className="space-y-4">
                                {exhibition.location && (
                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <MapPin className="h-5 w-5 text-amber-600" />
                                        <span className="font-medium">{exhibition.location}</span>
                                    </div>
                                )}

                                {exhibition.date_taken && (
                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <Calendar className="h-5 w-5 text-amber-600" />
                                        <span>{new Date(exhibition.date_taken).toLocaleDateString('zh-CN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                )}

                                {exhibition.profiles?.display_name && (
                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <User className="h-5 w-5 text-amber-600" />
                                        <span>摄影师：{exhibition.profiles.display_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 故事内容 */}
                    <div className="space-y-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center space-x-2 mb-6">
                                <Heart className="h-6 w-6 text-red-500" />
                                <h1 className="text-2xl font-bold text-gray-800">照片故事</h1>
                            </div>

                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                    {exhibition.photo_story}
                                </p>
                            </div>
                        </div>

                        {/* 作者信息 */}
                        {exhibition.profiles && (
                            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">关于摄影师</h3>
                                <div className="flex items-center space-x-4">
                                    {exhibition.profiles.avatar_url ? (
                                        <Image
                                            src={exhibition.profiles.avatar_url}
                                            alt={exhibition.profiles.display_name}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {exhibition.profiles.display_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            @{exhibition.profiles.username}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 分享按钮 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">分享这个故事</h3>
                            <div className="flex space-x-4">
                                <button type="button" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                                    分享到微信
                                </button>
                                <button type="button" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg">
                                    复制链接
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}