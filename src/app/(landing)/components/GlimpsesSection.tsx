'use client';

export default function GlimpsesSection() {
  const glimpses = [
    {
      title: 'Dashboard Overview',
      description: 'Real-time statistics and insights',
      gradient: 'from-primary-400 to-primary-600',
    },
    {
      title: 'Family List',
      description: 'Manage all family records',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Festival Page',
      description: 'Track festival contributions',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Receipt Preview',
      description: 'Professional payment receipts',
      gradient: 'from-secondary-400 to-secondary-600',
    },
    {
      title: 'Calendar View',
      description: 'Festival schedules at a glance',
      gradient: 'from-green-400 to-green-600',
    },
    {
      title: 'Reports',
      description: 'Detailed analytics and reports',
      gradient: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <section id="glimpses" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            A Quick Look Inside
          </h2>
          <p className="text-xl text-gray-600">
            Explore the platform features through screenshots
          </p>
        </div>

        {/* Glimpses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {glimpses.map((glimpse, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Mock Screenshot with Gradient */}
              <div
                className={`aspect-[4/3] bg-gradient-to-br ${glimpse.gradient} p-8 flex items-center justify-center`}
              >
                {/* Mock UI Elements */}
                <div className="space-y-4 w-full">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="h-3 bg-white/40 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-white/30 rounded w-1/2"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 h-20"></div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 h-20"></div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="h-2 bg-white/40 rounded w-full mb-2"></div>
                    <div className="h-2 bg-white/30 rounded w-3/4"></div>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{glimpse.title}</h3>
                  <p className="text-sm">{glimpse.description}</p>
                </div>
              </div>

              {/* Zoom Effect */}
              <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
