'use client';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Illustration */}
            <div className="relative">
              <div className="relative z-10">
                {/* Group Illustration */}
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-12 shadow-xl">
                  <div className="flex justify-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                      👨
                    </div>
                    <div className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center text-3xl shadow-lg -mt-4">
                      👩
                    </div>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                      👴
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                      👧
                    </div>
                    <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-3xl shadow-lg -mb-4">
                      🧒
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-200 rounded-full -z-10 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-200 rounded-full -z-10 opacity-50"></div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About Us
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-primary-600">
                    LBC (Luhuren Bae Club)
                  </span>{' '}
                  is a community initiative created to manage village festival
                  contributions in a transparent and digital way.
                </p>
                <p>
                  Our goal is to replace manual registers with a simple online
                  system that everyone can understand and trust. We believe in
                  transparency, accountability, and making community management
                  easier for everyone.
                </p>
                <p>
                  With LBC, every family contribution is recorded, every payment
                  is tracked, and every member can access information anytime,
                  anywhere. We&apos;re building a digital bridge between tradition
                  and technology.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="font-semibold text-gray-900">
                    Transparent
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <div className="font-semibold text-gray-900">
                    Trustworthy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💡</div>
                  <div className="font-semibold text-gray-900">Simple</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
