import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import TrendingContent from './components/TrendingContent';
import RecommendationEngine from './components/RecommendationEngine';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import VideoBackground from './components/VideoBackground';
import Testimonials from './components/Testimonials';
import NewSubscriptionPopup from './components/NewSubscriptionPopup';
import CookieBanner from './components/CookieBanner';

const App = () => {
  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-black/50"></div>
      <div className="relative">
        <Header />
        <Hero />
        <Features />
        <TrendingContent />
        <RecommendationEngine />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Footer />
        <NewSubscriptionPopup />
        <CookieBanner />
      </div>
    </div>
  );
};

export default App;
