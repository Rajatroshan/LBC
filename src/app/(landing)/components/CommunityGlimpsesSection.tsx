'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Utensils, 
  Lamp, 
  Trophy, 
  CheckCircle2
} from 'lucide-react';
import { CuteTempleMandap, CartoonDiya } from './VillageIllustrations';

const villageTraditions = [
  {
    id: 'durga-puja',
    title: 'Durga Puja Mahotsav',
    tagline: 'Traditional Bamboo Pandal, Divine Aarti & Gram Sabha Feast',
    location: 'Luhuren Central Mandap',
    season: 'Autumn Puja',
    iconEmoji: '🪔',
    stat: '₹2.8L Village Budget',
    initiative: 'Eco Bamboo & Clay Decor',
    initiativeDesc: 'Handcrafted deity idols from organic river clay, non-plastic marigold garlands, and community lighting.',
    accentGradient: 'from-amber-600 via-orange-600 to-red-600',
    sceneColor: 'bg-amber-950/90'
  },
  {
    id: 'diwali',
    title: 'Deepavali 10,000 Diya Illumination',
    tagline: 'Terracotta Diyas, Temple Lighting & Traditional Rangoli',
    location: 'Village Temple Square',
    season: 'Festival of Lights',
    iconEmoji: '✨',
    stat: '100% Family Participation',
    initiative: 'Clay Potters & Solar Lighting',
    initiativeDesc: 'Sponsoring village terracotta potters for 10,000 clay diyas and lighting every village road.',
    accentGradient: 'from-yellow-600 via-amber-600 to-orange-700',
    sceneColor: 'bg-stone-950/90'
  },
  {
    id: 'annadanam',
    title: 'Maha Annadanam & Community Bhojan',
    tagline: 'Zero-Waste Village Feast with over 1,500 Villagers & Guests',
    location: 'Mandap Bhojan Shala',
    season: 'Annual Mahabhoj',
    iconEmoji: '🍛',
    stat: '1,500+ Meals Served',
    initiative: 'Direct Farm-to-Kitchen Rice & Dal',
    initiativeDesc: 'Traditional banana leaf dining, fresh grains donated by village farmers, and youth volunteer seva.',
    accentGradient: 'from-emerald-700 via-teal-700 to-green-800',
    sceneColor: 'bg-emerald-950/90'
  },
  {
    id: 'ratha-yatra',
    title: 'Ratha Yatra Chariot Procession',
    tagline: 'Handmade Wooden Chariot, Kirtan & Folk Percussion',
    location: 'Main Village Roadway',
    season: 'Monsoon Celebration',
    iconEmoji: '🚩',
    stat: 'Youth Volunteer Seva',
    initiative: 'Chariot Craft & Pilgrim Seva',
    initiativeDesc: 'Handcrafted timber chariot, youth volunteer crowd guidance, and cold drinking water stations.',
    accentGradient: 'from-rose-600 via-red-600 to-amber-700',
    sceneColor: 'bg-rose-950/90'
  },
  {
    id: 'youth-cultural',
    title: 'Village Natak & Folk Drama Night',
    tagline: 'Traditional Odia Folk Drama (Nataka), Music & Stage Shows',
    location: 'Club Stage Complex',
    season: 'Cultural Evening',
    iconEmoji: '🎭',
    stat: '18 Village Artists',
    initiative: 'Preserving Village Folklore',
    initiativeDesc: 'Preserving ancient folk theatre traditions, sound acoustics, and encouraging young village talents.',
    accentGradient: 'from-purple-700 via-indigo-700 to-amber-700',
    sceneColor: 'bg-indigo-950/90'
  },
];

const villageInitiatives = [
  {
    icon: Utensils,
    iconEmoji: '🍲',
    title: 'Maha Annadanam Kitchen',
    metric: '1,500+ Meals',
    desc: 'Transparent itemized tracking of grains (rice, dal, spices) contributed by village households.',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    icon: Lamp,
    iconEmoji: '🪔',
    title: 'Eco Temple Lighting',
    metric: '10,000 Diyas',
    desc: 'Community-funded lighting arrays and handcrafted clay lamps across village streets.',
    accent: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Trophy,
    iconEmoji: '🏆',
    title: 'Annual Youth Sabha',
    metric: '18 Events',
    desc: 'Village youth sports, cricket tournament, elder felicitation, and merit student awards.',
    accent: 'from-emerald-500 to-teal-600',
  },
];

export default function CommunityGlimpsesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % villageTraditions.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % villageTraditions.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + villageTraditions.length) % villageTraditions.length
    );
  };

  const activeItem = villageTraditions[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-[#1C1917] text-white relative overflow-hidden border-b-2 border-amber-200">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Village Heritage &amp; Community Spirit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Village Festivals &amp; Cultural Glimpses
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-medium">
            Moments of devotion, joy, and unity made possible through 100% transparent community contributions.
          </p>
        </div>

        {/* Carousel Showcase Card */}
        <div className="max-w-5xl mx-auto">
          
          {/* Main Storybook Illustrated Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/30 bg-stone-900 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-8">
            
            {/* Background Decorative Earthen Scene */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeItem.accentGradient} opacity-20 transition-opacity duration-1000`}></div>
            
            {/* Top Navigation & Seasonal Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/30 text-xs text-amber-300 font-black">
                <span className="text-base">{activeItem.iconEmoji}</span>
                <span>{activeItem.season}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-9 h-9 bg-black/60 hover:bg-amber-500 hover:text-stone-950 backdrop-blur-md text-white rounded-full border border-white/20 flex items-center justify-center transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-9 h-9 bg-black/60 hover:bg-amber-500 hover:text-stone-950 backdrop-blur-md text-white rounded-full border border-white/20 flex items-center justify-center transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Illustrated Elements */}
            <div className="relative z-10 my-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3 max-w-xl text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-400 text-stone-950 shadow-sm">
                    {activeItem.stat}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-stone-300 flex items-center gap-1 border border-white/10">
                    <MapPin className="w-3 h-3 text-amber-400" /> {activeItem.location}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                  {activeItem.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                  {activeItem.tagline}
                </p>

                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs text-amber-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Initiative:</strong> {activeItem.initiativeDesc}</span>
                </div>
              </div>

              {/* Cute Cartoon Vector Spotlight */}
              <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-3xl border border-amber-300/20 backdrop-blur-sm shrink-0">
                <CuteTempleMandap size={100} />
                <div className="flex items-center gap-2 mt-2">
                  <CartoonDiya size={28} />
                  <span className="text-[10px] text-amber-200 font-bold">Auspicious Mandap</span>
                </div>
              </div>

            </div>

            {/* Bottom Progress Bar */}
            <div className="relative z-10 flex gap-1.5 w-full">
              {villageTraditions.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full flex-1 cursor-pointer transition-all ${
                    idx === currentIndex ? 'bg-amber-400' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Horizontal Tradition Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pt-4 pb-2 no-scrollbar">
            {villageTraditions.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`py-2 px-4 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border-2 ${
                  idx === currentIndex
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md scale-105'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                }`}
              >
                <span>{item.iconEmoji}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* Village Initiatives Grid */}
          <div className="mt-12 pt-8 border-t border-stone-800">
            <div className="text-center mb-6">
              <h4 className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-2">
                <span>🌾 Village Mandap Community Initiatives</span>
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                How our village transforms chanda collections into community impact &amp; harmony.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {villageInitiatives.map((init, i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl bg-stone-900/80 border-2 border-stone-800 hover:border-amber-400/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg shadow-sm">
                      {init.iconEmoji}
                    </div>
                    <span className="text-[11px] font-black text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {init.metric}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {init.title}
                  </h5>
                  <p className="text-xs text-stone-400 leading-relaxed font-medium">
                    {init.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
