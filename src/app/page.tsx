import Navigation from './(landing)/components/Navigation';
import HeroSection from './(landing)/components/HeroSection';
import GlimpsesSection from './(landing)/components/GlimpsesSection';
import FeaturesSection from './(landing)/components/FeaturesSection';
import WhoIsThisForSection from './(landing)/components/WhoIsThisForSection';
import AboutSection from './(landing)/components/AboutSection';
import HowItWorksSection from './(landing)/components/HowItWorksSection';
import CommunityGlimpsesSection from './(landing)/components/CommunityGlimpsesSection';
import CTASection from './(landing)/components/CTASection';
import Footer from './(landing)/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

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

      {/* Call to Action */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
