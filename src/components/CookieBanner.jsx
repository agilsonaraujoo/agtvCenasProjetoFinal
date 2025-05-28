import React, { useState, useEffect } from 'react';
import { FaCookieBite } from 'react-icons/fa';
import './cookieBanner.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Sempre mostra o banner quando a página é carregada
    setShowBanner(true);
    // Reativa as notificações
    setShowNotifications(true);
    // Remove os estados de cookies do localStorage
    localStorage.removeItem('cookiesAccepted');
    localStorage.removeItem('cookiesRejected');
    localStorage.removeItem('showNotifications');
  }, []);

  useEffect(() => {
    if (!showBanner) {
      setIsHiding(true);
      // Aguarda a animação terminar antes de remover o elemento
      setTimeout(() => {
        setIsHiding(false);
      }, 2000);
    }
  }, [showBanner]);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
    // Mantém as notificações ativadas
    localStorage.setItem('showNotifications', 'true');
  };

  const handleReject = () => {
    localStorage.setItem('cookiesRejected', 'true');
    setShowBanner(false);
    // Desativa as notificações
    localStorage.setItem('showNotifications', 'false');
  };

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm p-4 ${isHiding ? 'cookie-banner hiding' : 'cookie-banner'}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaCookieBite className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-sm font-medium text-white">Usamos Cookies</h3>
              <p className="text-xs text-gray-400">
                Este site usa cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Rejeitar
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
