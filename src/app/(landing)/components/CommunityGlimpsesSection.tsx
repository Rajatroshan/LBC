'use client';

import { useState, useEffect } from 'react';

const communityImages = [
  {
    title: 'Durga Puja Celebration',
    description: 'Community gathering for annual festival',
    emoji: '🎭',
    color: 'from-red-400 to-orange-500',
  },
  {
    title: 'Village Fair',
    description: 'Traditional cultural event',
    emoji: '🎪',
    color: 'from-purple-400 to-pink-500',
  },
  {
    title: 'Community Feast',
    description: 'Members celebrating together',
    emoji: '🍽️',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    title: 'Cultural Program',
    description: 'Traditional dance and music',
    emoji: '🎵',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    title: 'Festival Preparations',
    description: 'Community working together',
    emoji: '🤝',
    color: 'from-green-400 to-teal-500',
  },
];

export default function CommunityGlimpsesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % communityImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % communityImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + communityImages.length) % communityImages.length
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Community Glimpses
          </h2>
          <p className="text-xl text-gray-600">
            Our festivals, our community, our memories
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              {communityImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                >
                  <div
                    className={`w-full h-full bg-gradient-to-br ${image.color} flex items-center justify-center`}
                  >
                    {/* Mock Photo with Emoji */}
                    <div className="text-center text-white p-12">
                      <div className="text-9xl mb-6">{image.emoji}</div>
                      <h3 className="text-3xl font-bold mb-2">
                        {image.title}
                      </h3>
                      <p className="text-xl opacity-90">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {communityImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-12 h-3 bg-primary-600'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Preview */}
          <div className="mt-8 grid grid-cols-5 gap-4">
            {communityImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`aspect-video rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'ring-4 ring-primary-500 scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${image.color} flex items-center justify-center text-3xl`}
                >
                  {image.emoji}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
