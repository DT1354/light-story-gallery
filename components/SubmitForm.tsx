'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase-client'
import { Upload, MapPin, Calendar, FileText, Image as ImageIcon } from 'lucide-react'

export default function SubmitForm() {
  const [formData, setFormData] = useState({
    photo_story: '',
    location: '',
    date_taken: ''
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('请选择一张照片')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // 获取当前用户
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('请先登录')
      }

      // 上传图片到 Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      // 获取图片的公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      // 保存展品信息到数据库
      const { error: insertError } = await supabase
        .from('exhibitions')
        .insert({
          photo_url: publicUrl,
          photo_story: formData.photo_story,
          location: formData.location,
          date_taken: formData.date_taken || null,
          author_id: user.id
        })

      if (insertError) {
        throw insertError
      }

      // 成功后跳转到首页
      router.push('/')
    } catch (error: any) {
      setError(error.message || '上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Upload className="h-6 w-6" />
            <span>分享你的光影故事</span>
          </h1>
          <p className="text-amber-100 mt-2">让每一张照片都承载着温暖的回忆</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* 图片上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              选择照片 *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="预览"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setPreview(null)
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    重新选择
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">点击选择或拖拽图片到这里</p>
                  <p className="text-sm text-gray-400">支持 JPG, PNG, GIF 格式</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="选择照片文件"
              />
            </div>
          </div>

          {/* 故事文字 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              照片故事 *
            </label>
            <textarea
              value={formData.photo_story}
              onChange={(e) => setFormData({ ...formData, photo_story: e.target.value })}
              placeholder="分享这张照片背后的故事..."
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 拍摄地点 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              拍摄地点
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="在哪里拍摄的这张照片？"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* 拍摄日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              拍摄日期
            </label>
            <input
              type="date"
              value={formData.date_taken}
              onChange={(e) => setFormData({ ...formData, date_taken: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              aria-label="选择拍摄日期"
            />
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? '正在上传...' : '分享故事'}
          </button>
        </form>
      </div>
    </div>
  )
}