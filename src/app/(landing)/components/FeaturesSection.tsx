'use client';

import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: '👨‍👩‍👧',
    title: 'Family Management',
    description: 'Create and manage family records with contribution history.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: '💰',
    title: 'Festival-based Collection',
    description: 'Track chanda amount per festival with real-time totals.',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    icon: '🧾',
    title: 'Receipt Generation',
    description: 'Generate and download payment receipts instantly.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: '📅',
    title: 'Festival Calendar',
    description: 'View upcoming festivals and contribution schedules.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: '📊',
    title: 'Transparent Reports',
    description: 'Everyone can see paid and pending status.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: '🔔',
    title: 'Smart Notifications',
    description: 'Get reminders for upcoming contributions and events.',
    color: 'from-orange-500 to-orange-600',
  },
];

export default function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage community festival contributions
            efficiently and transparently
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
