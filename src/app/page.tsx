'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { APP_ROUTES } from '@/core/routes';
import { Loader } from '@/components/ui/Loader';
import Navigation from './(landing)/components/Navigation';
import HeroSection from './(landing)/components/HeroSection';
import PublicTransparencyHub from './(landing)/components/PublicTransparencyHub';
import VillageNewsFeed from './(landing)/components/VillageNewsFeed';
import GlimpsesSection from './(landing)/components/GlimpsesSection';
import FeaturesSection from './(landing)/components/FeaturesSection';
import WhoIsThisForSection from './(landing)/components/WhoIsThisForSection';
import AboutSection from './(landing)/components/AboutSection';
import HowItWorksSection from './(landing)/components/HowItWorksSection';
import CommunityGlimpsesSection from './(landing)/components/CommunityGlimpsesSection';
import DeveloperSection from './(landing)/components/DeveloperSection';
import Footer from './(landing)/components/Footer';

export default function HomePage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authenticated, automatically redirect from base URL to Dashboard
    if (!loading && (user || firebaseUser)) {
      router.replace(APP_ROUTES.DASHBOARD);
    }
  }, [user, firebaseUser, loading, router]);

  // If still checking auth or already logged in (redirecting), show clean centered loader
  if (loading || user || firebaseUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader size="lg" />
        <p className="text-xs text-gray-400 mt-4">Loading LBC...</p>
      </div>
    );
  }

  // If not logged in, render the public landing page with live transparency hub
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* ⭐ 100% Khula Hisab - Live Public Transparency Portal */}
      <PublicTransparencyHub />

      {/* 📰 Gaon Samachar - Village Notices & Public Reaction Board */}
      <VillageNewsFeed />

      {/* Glimpses Section (Screenshots) */}
      <GlimpsesSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Who Is This For */}
      <WhoIsThisForSection />

      {/* About Us */}
      <AboutSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Community Glimpses (Photos Carousel) */}
      <CommunityGlimpsesSection />

      {/* Meet the Developer Section */}
      <DeveloperSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
