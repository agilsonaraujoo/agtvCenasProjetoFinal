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
  const [shownNames, setShownNames] = useState(new Set());
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  useEffect(() => {
    // Atualiza o estado das notificações quando mudar no localStorage
    const saved = localStorage.getItem('showNotifications');
    if (saved !== null) {
      setShowNotifications(saved === 'true');
    }
  }, []);

  // Removido o useEffect que estava causando duplicatas
  // Mantendo apenas a lógica de scroll para mostrar as notificações
  // A lógica de controle de nomes mostrados e progresso está no showNextNotification

  // Função para mostrar nova notificação
  const showNextNotification = () => {
    if (!showNotifications || isManuallyClosed) return;
    
    // Verifica se já existe um popup sendo mostrado
    if (showPopup) return;

    // Verifica se o nome já foi mostrado nesta sessão
    const newSubscription = getNewSubscription();
    if (shownNames.has(newSubscription.name)) {
      // Se já foi mostrado nesta sessão, não mostra mais
      return;
    }

    // Adiciona o nome à lista de mostrados nesta sessão
    setShownNames(prev => new Set([...prev, newSubscription.name]));
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
        // Não verifica mais o isAnimating
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
          // Limpa o nome mostrado desta sessão
          setShownNames(new Set());
          // Espera mais 6 segundos antes de mostrar a próxima notificação
          setTimeout(showNextNotification, 30000); // Aumentando para 30 segundos
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
          // Se o usuário já tiver fechado manualmente, não mostra mais
          if (isManuallyClosed) return;
          
          // Se já não estiver mostrando e já tiver passado 3 segundos desde o último
          if (!showPopup && (!lastShown || Date.now() - lastShown >= 3000)) {
            setLastShown(Date.now());
            showNextNotification();
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPopup, lastShown, isManuallyClosed]);

  // Removido o useEffect de mousemove que estava causando duplicatas
  // O popup agora só será mostrado através do scroll na seção de planos
  // e respeitando o intervalo de 30 segundos entre as notificações

  const handleClose = () => {
    // Desabilita as notificações permanentemente
    setShowNotifications(false);
    localStorage.setItem('showNotifications', 'false');
    
    // Remove o nome da lista de mostrados
    setShownNames(new Set());
    setIsHiding(true);
    // Espera 3 segundos para a animação de saída
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // Limpa o estado quando o componente é desmontado
  useEffect(() => {
    return () => {
      setIsManuallyClosed(false);
      setShowNotifications(true);
    };
  }, []);

  return (
    <>
      {showPopup && subscription && (
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-blue-500">
                <FaBell size={16} />
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-400">Novo Assinante!</p>
                <p className="text-sm font-semibold text-white">{subscription.name} {subscription.message}</p>
                <p className="text-xs text-blue-400">Plano {subscription.plan}</p>
                <div className="mt-2">
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
      )}
    </>
  );
};

export default NewSubscriptionPopup;
