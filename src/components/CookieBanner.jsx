import React, { useState, useEffect } from 'react';
import { FaCookieBite, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './cookieBanner.css';

const CookieBanner = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerClosed, setBannerClosed] = useState(true);

  // Verifica se o banner já foi aceito/rejeitado
  useEffect(() => {
    const bannerStatus = localStorage.getItem('cookieBannerClosed');
    setBannerClosed(bannerStatus === 'true');
  }, []);

  // Função para aceitar
  const handleAccept = (e) => {
    e.stopPropagation();
    localStorage.setItem('cookieBannerClosed', 'true');
    setIsHiding(true);
    setTimeout(() => setShowBanner(false), 300);
  };

  // Função para rejeitar
  const handleReject = (e) => {
    e.stopPropagation();
    localStorage.setItem('cookieBannerClosed', 'true');
    setIsHiding(true);
    setTimeout(() => setShowBanner(false), 300);
  };

  // Mostra o banner após o carregamento da página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pageReloaded = sessionStorage.getItem('pageReloaded') === 'true';
      if (!pageReloaded) {
        sessionStorage.setItem('pageReloaded', 'true');
        const timer = setTimeout(() => {
          setShowBanner(true);
          setBannerClosed(false);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (!bannerClosed) {
        setShowBanner(true);
      }
    }
  }, [bannerClosed]);

  // Se o banner já foi fechado, não mostra
  if (bannerClosed) {
    return null;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`cookie-banner ${isExpanded ? 'expanded' : ''} ${isHiding ? 'hiding' : ''}`}>
      <div className="cookie-banner-content">
        <div className="cookie-banner-header" onClick={toggleExpand}>
          <div className="cookie-banner-text">
            <FaCookieBite className="text-yellow-400" size={18} />
            <span>Usamos cookies</span>
            {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>
        </div>
        
        <div className="cookie-banner-message-container">
          <p className="cookie-banner-message">
            Este site usa cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.
          </p>
          <div className="cookie-banner-buttons">
            <button className="cookie-banner-button reject" onClick={handleReject}>
              Rejeitar
            </button>
            <button className="cookie-banner-button accept" onClick={handleAccept}>
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
