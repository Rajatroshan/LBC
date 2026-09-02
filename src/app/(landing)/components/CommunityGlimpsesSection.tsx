'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Utensils, 
  Lamp, 
  Music, 
  Trophy, 
  Flame,
  CheckCircle2
} from 'lucide-react';

const communityGalleries = [
  {
    id: 'durga-puja',
    title: 'Durga Puja Mahotsav',
    tagline: 'Grand Pandal, Divine Aarti & Cultural Gathering',
    location: 'Luhuren Central Mandap',
    season: 'Autumn Festival',
    icon: Sparkles,
    imageUrl: 'https://images.unsplash.com/photo-1570701123784-2d41777f5e93?auto=format&fit=crop&w=1200&q=80',
    stat: '₹2.8L Budget Managed',
    initiative: 'Pandal & Stage Decoration',
    initiativeDesc: 'Eco-friendly bamboo craftsmanship, artisan deity idols, and community floral decor.'
  },
  {
    id: 'diwali',
    title: 'Deepavali & Kali Puja Lights',
    tagline: '10,000 Diyas, Temple Illumination & Rangoli',
    location: 'Village Temple Square',
    season: 'Festival of Lights',
    icon: Lamp,
    imageUrl: 'https://images.unsplash.com/photo-1605807923112-f7ef0e854999?auto=format&fit=crop&w=1200&q=80',
    stat: '100% Family Participation',
    initiative: 'Village Illumination Drive',
    initiativeDesc: 'Solar lighting across main village pathways, traditional terracotta diyas, and fireworks safety.'
  },
  {
    id: 'annadanam',
    title: 'Maha Annadanam & Community Feast',
    tagline: 'Traditional Feast with Over 1,500 Villagers & Guests',
    location: 'Community Hall Grounds',
    season: 'Annual Mahabhoj',
    icon: Utensils,
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    stat: '1,500+ Meals Served',
    initiative: 'Zero-Waste Community Kitchen',
    initiativeDesc: 'Traditional banana leaf serving, organic ingredients sponsored by households, and youth volunteer seva.'
  },
  {
    id: 'ratha-yatra',
    title: 'Ratha Yatra & Youth Procession',
    tagline: 'Chariot Pulling, Kirtan & Traditional Percussion',
    location: 'Main Village Roadway',
    season: 'Monsoon Celebration',
    icon: Flame,
    imageUrl: 'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=1200&q=80',
    stat: 'Youth Volunteer Driven',
    initiative: 'Chariot Craft & Security',
    initiativeDesc: 'Handcrafted wooden chariot, volunteer crowd guidance, and water stations for pilgrims.'
  },
  {
    id: 'youth-cultural',
    title: 'Youth Cultural Night & Drama',
    tagline: 'Music, Folk Drama & Community Stage Shows',
    location: 'Club Stage Complex',
    season: 'Cultural Evening',
    icon: Music,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    stat: '18 Youth Performers',
    initiative: 'Folk Heritage & Stage Craft',
    initiativeDesc: 'Preserving traditional Odia folk theatre (Nataka), youth music groups, and sound acoustics.'
  },
];

const villageInitiatives = [
  {
    icon: Utensils,
    title: 'Maha Annadanam Kitchen',
    metric: '1,500+ Meals',
    desc: 'Transparent tracking of grocery sponsorships (rice, dal, oil, vegetables) from village families.',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    icon: Lamp,
    title: 'Eco Temple Lighting',
    metric: '10,000 Diyas',
    desc: 'Community funded lighting arrays and traditional clay lamps across village streets.',
    accent: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Trophy,
    title: 'Annual Youth Sabha',
    metric: '18 Events',
    desc: 'Annual sports, cricket tournament, elder felicitation, and merit student scholarships.',
    accent: 'from-emerald-500 to-teal-600',
  },
];

export default function CommunityGlimpsesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % communityGalleries.length);
    }, 6000);

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
  const ActiveIcon = activeItem.icon;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Village Heritage & Devotion</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Village Festivals & Celebrations
          </h2>
          <p className="text-xs sm:text-base text-gray-300">
            Real moments of devotion, joy, and unity made possible through transparent community contributions.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-5xl mx-auto">
          {/* Main Slide Card with High Mobile Height & Solid Overlays */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 min-h-[380px] sm:min-h-[440px] md:aspect-[16/9] flex flex-col justify-end group">
            {/* Background High-Res Image with Dark Gradient Layer */}
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/20"></div>
            </div>

            {/* Top Bar on Card: Navigation Arrows & Indicator */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-bold">
                <ActiveIcon className="w-3.5 h-3.5" />
                <span>{activeItem.season}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white rounded-full border border-white/20 flex items-center justify-center transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white rounded-full border border-white/20 flex items-center justify-center transition-all active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 p-5 sm:p-8 space-y-2.5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-amber-400 text-gray-950 shadow-sm">
                  {activeItem.stat}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-300" /> {activeItem.location}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                {activeItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 max-w-2xl leading-relaxed">
                {activeItem.tagline}
              </p>

              {/* Initiative Note */}
              <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate"><strong>Initiative:</strong> {activeItem.initiativeDesc}</span>
              </div>
            </div>
          </div>

          {/* Interactive Horizontal Scrollable Festival Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 no-scrollbar">
            {communityGalleries.map((item, idx) => {
              const IconC = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                    idx === currentIndex
                      ? 'bg-amber-400 text-gray-950 border-amber-300 shadow-lg scale-105'
                      : 'bg-gray-900 hover:bg-gray-850 text-gray-300 border-gray-800'
                  }`}
                >
                  <IconC className="w-3.5 h-3.5" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* New Village Theme Feature: Community Initiatives Showcase Grid */}
          <div className="mt-10 sm:mt-14 pt-8 border-t border-gray-800">
            <div className="text-center mb-6">
              <h4 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2">
                <span>🌾 Village Mandap Community Initiatives</span>
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                How our village transforms chanda collections into community impact & harmony.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {villageInitiatives.map((init, i) => {
                const IconComponent = init.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-amber-400/50 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${init.accent} text-white flex items-center justify-center shadow-md`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        {init.metric}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {init.title}
                    </h5>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {init.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
