import React, { useState, useEffect, useRef } from 'react';
import { getNewSubscription } from '../data/newSubscribers';
import { FaBell, FaTimes } from 'react-icons/fa';
import './notifications.css';

const NewSubscriptionPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [lastShown, setLastShown] = useState(null);
  const popupRef = useRef(null);
  const [isHiding, setIsHiding] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    // Atualiza o estado das notificações quando mudar no localStorage
    const saved = localStorage.getItem('showNotifications');
    if (saved !== null) {
      setShowNotifications(saved === 'true');
    }
  }, []);

  // Função para mostrar nova notificação
  const showNextNotification = () => {
    if (!showNotifications) return;
    
    const newSubscription = getNewSubscription();
    setSubscription(newSubscription);
    setShowPopup(true);
    setIsHiding(false);
    setProgress(100); // Inicia com 100%
    
    // Aguardar a animação de entrada
    setTimeout(() => {
      setIsAnimating(true);
      // Inicia o temporizador
      let startTime = Date.now();
      let animationFrameId;
      let currentProgress = 100;
      
      const animateProgress = () => {
        if (!isAnimating) {
          setIsAnimating(true);
        }
        
        const elapsed = Date.now() - startTime;
        currentProgress = Math.max(0, 100 - (elapsed / 1000) * 10);
        
        // Atualiza o estado apenas quando necessário
        if (Math.abs(currentProgress - progress) > 0.1) {
          setProgress(currentProgress);
        }
        
        if (currentProgress <= 0) {
          setIsAnimating(false);
          setIsHiding(true);
          return;
        }
        
        animationFrameId = requestAnimationFrame(animateProgress);
      };

      animationFrameId = requestAnimationFrame(animateProgress);

      // Aguardar a animação de saída
      setTimeout(() => {
        setIsHiding(true);
        // Espera 3 segundos para a animação de saída
        setTimeout(() => {
          setShowPopup(false);
          // Espera mais 6 segundos antes de mostrar a próxima notificação
          setTimeout(showNextNotification, 18000);
        }, 3000);
      }, 10000); // Tempo total (10 segundos)

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }, 500); // Duração da animação de entrada
  };

  useEffect(() => {
    // Detectar quando o usuário chegar na seção de planos
    const handleScroll = () => {
      const pricingSection = document.querySelector('.pricing-section');
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          // Mostrar popup quando chegar na seção de planos
          if (!showPopup) {
            showNextNotification();
          }
        }
      }
    };

    // Adiciona listeners para scroll e mousemove
    // Armazena as funções de callback
    const handleMouseMove = () => {
      if (showPopup && !isAnimating) {
        setIsAnimating(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      // Limpa qualquer timer pendente
      const currentTimer = setTimeout(() => {});
      clearTimeout(currentTimer);
    };
  }, [showPopup]);

  if (!showPopup || !subscription) return null;

  const handleClose = () => {
    setShowNotifications(false);
    localStorage.setItem('showNotifications', 'false');
    setIsHiding(true);
    // Espera 3 segundos para a animação de saída
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 w-64 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg p-3 notification-container ${isHiding ? 'hide' : ''}`}
      style={{ 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        width: '24rem',
        maxWidth: '90vw'
      }}
      ref={popupRef}
    >
      <div className="flex items-center space-x-2">
        <div className="text-blue-500">
          <FaBell size={16} />
        </div>
        <div>
          <p className="text-xs text-gray-400">Novo Assinante!</p>
          <p className="text-sm font-semibold text-white">{subscription.name} {subscription.message}</p>
          <p className="text-xs text-blue-400">Plano {subscription.plan}</p>
          <div className="mt-2">
            <div className="flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full transition-all duration-10000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Fechar notificação"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
};

export default NewSubscriptionPopup;
