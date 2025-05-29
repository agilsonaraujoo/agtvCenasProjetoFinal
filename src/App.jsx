import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
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
import { Helmet } from 'react-helmet-async';

const App = () => {
  const siteUrl = 'https://agtvcenas.com';
  const siteTitle = 'AGTV - Sua Plataforma de Streaming';
  const siteDescription = 'Assista aos melhores canais de TV ao vivo e conteúdo sob demanda com a melhor qualidade.';
  const siteImage = `${siteUrl}/images/agtv-og-image.jpg`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={siteTitle} />
        <meta property="twitter:description" content={siteDescription} />
        <meta property="twitter:image" content={siteImage} />
        
        {/* WhatsApp */}
        <meta property="og:site_name" content="AGTV" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>
      
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
        </div>
      </div>
      <CookieBanner />
    </HelmetProvider>
  );
};

export default App;
