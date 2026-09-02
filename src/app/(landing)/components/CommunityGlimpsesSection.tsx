'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

const communityGalleries = [
  {
    title: 'Durga Puja Mahotsav',
    tagline: 'Grand Pandal, Cultural Aarti & Divine Celebrations',
    location: 'Luhuren Central Mandap',
    season: 'Autumn Festival',
    imageUrl: 'https://images.unsplash.com/photo-1570701123784-2d41777f5e93?auto=format&fit=crop&w=1200&q=80',
    stat: '₹2.8L Budget Managed',
  },
  {
    title: 'Deepavali & Kali Puja Lights',
    tagline: '10,000 Diyas, Lighting Decor & Fireworks',
    location: 'Village Temple Square',
    season: 'Festival of Lights',
    imageUrl: 'https://images.unsplash.com/photo-1605807923112-f7ef0e854999?auto=format&fit=crop&w=1200&q=80',
    stat: '100% Family Participation',
  },
  {
    title: 'Maha Annadanam & Community Feast',
    tagline: 'Traditional Feast with Over 1,500 Villagers & Guests',
    location: 'Community Hall Grounds',
    season: 'Annual Mahabhoj',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    stat: '1,500+ Meals Served',
  },
  {
    title: 'Ratha Yatra & Youth Procession',
    tagline: 'Chariot Pulling, Kirtan & Traditional Percussions',
    location: 'Main Village Roadway',
    season: 'Monsoon Celebration',
    imageUrl: 'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=1200&q=80',
    stat: 'Youth Volunteer Driven',
  },
  {
    title: 'Youth Cultural Night & Sound Show',
    tagline: 'Music, Stage Performances & Traditional Drama',
    location: 'Club Stage Complex',
    season: 'Cultural Evening',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    stat: '18 Youth Performers',
  },
];

export default function CommunityGlimpsesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % communityGalleries.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % communityGalleries.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + communityGalleries.length) % communityGalleries.length
    );
  };

  const activeItem = communityGalleries[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cherished Community Memories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Village Festivals & Celebrations
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            Real moments of devotion, joy, and unity made possible through transparent community contributions.
          </p>
        </div>

        {/* Main Showcase Banner */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 aspect-[16/9] group">
            {/* Background High-Res Image with Overlay */}
            <div className="absolute inset-0 transition-all duration-700">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-gray-950">
                  {activeItem.stat}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {activeItem.season}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {activeItem.location}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                {activeItem.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed">
                {activeItem.tagline}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full border border-white/20 flex items-center justify-center transition-all hover:scale-110 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full border border-white/20 flex items-center justify-center transition-all hover:scale-110 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            {communityGalleries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  idx === currentIndex
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.03]'
                    : 'border-gray-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <p className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-bold text-white truncate text-left">
                  {item.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
