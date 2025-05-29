import React, { useState, useEffect, useRef } from 'react';
import { getNewSubscription } from '../data/newSubscribers';
import './notifications.css';

const NewSubscriptionPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [lastShown, setLastShown] = useState(null);
  const popupRef = useRef(null);
  const [shownNames, setShownNames] = useState(new Set());
  const [isHiding, setIsHiding] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  // Verifica se as notificações devem ser mostradas
  const showNotifications = localStorage.getItem('showNotifications') !== 'false';

  useEffect(() => {
    if (!showNotifications) {
      return;
    }

    const interval = setInterval(() => {
      const newSubscription = getNewSubscription();
      if (!newSubscription) return;

      // Verifica se o nome já foi mostrado
      if (shownNames.has(newSubscription.name)) {
        return;
      }

      setSubscription(newSubscription);
      setShowPopup(true);
      setLastShown(newSubscription.name);

      // Adiciona o nome aos mostrados
      setShownNames(prev => {
        const newSet = new Set(prev);
        newSet.add(newSubscription.name);
        return newSet;
      });

      // Inicia a animação de progresso
      setIsAnimating(true);
      setProgress(100);

      // Fecha o popup após 3 segundos
      setTimeout(() => {
        setIsAnimating(false);
        setShowPopup(false);
        setTimeout(() => {
          setProgress(100);
        }, 500);
      }, 3000);
    }, 10000);

    return () => clearInterval(interval);
  }, [showNotifications]);

  // Função para mostrar nova notificação
  const showNextNotification = () => {
    if (!showNotifications || isManuallyClosed) return;

    const newSubscription = getNewSubscription();
    if (!newSubscription) return;

    // Verifica se o nome já foi mostrado
    if (shownNames.has(newSubscription.name)) {
      return;
    }

    setSubscription(newSubscription);
    setShowPopup(true);
    setLastShown(newSubscription.name);

    // Adiciona o nome aos mostrados
    setShownNames(prev => {
      const newSet = new Set(prev);
      newSet.add(newSubscription.name);
      return newSet;
    });

    // Inicia a animação de progresso
    setIsAnimating(true);
    setProgress(100);

    // Fecha o popup após 3 segundos
    setTimeout(() => {
      setIsAnimating(false);
      setShowPopup(false);
      setTimeout(() => {
        setProgress(100);
      }, 500);
    }, 3000);
  };

  // Função para fechar o popup manualmente
  const handleClose = () => {
    setIsManuallyClosed(true);
    setShowPopup(false);
    setIsAnimating(false);
  };

  // Função para reativar as notificações
  const handleRestart = () => {
    setIsManuallyClosed(false);
    setShowPopup(false);
    setIsAnimating(false);
    setProgress(100);
  };

  return (
    <div className="relative">
      {showPopup && (
        <div
          className={`fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full transform transition-transform duration-300 ${
            isHiding ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
          }`}
          ref={popupRef}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Novo Assinante!</span>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {subscription?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {subscription?.name}
              </p>
              <p className="text-xs text-gray-600">
                {subscription?.message}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-blue-600 transform transition-transform duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{Math.round(progress)}%</span>
            <span>3s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSubscriptionPopup;
