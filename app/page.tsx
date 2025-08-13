import PhotoGrid from '../components/PhotoGrid'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            光影故事客厅
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 leading-relaxed">
            每一张照片都有它的故事<br />
            每一个瞬间都值得被记住
          </p>
          <div className="text-lg text-amber-200">
            在这里，我们不只是分享照片，更是分享温暖的回忆与感动
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <PhotoGrid />
    </div>
  )
}