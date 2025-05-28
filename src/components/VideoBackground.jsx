import React, { useEffect, useState } from 'react';

const VideoBackground = () => {
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(error => {
          console.error('Erro ao iniciar o vídeo:', error);
        });
        setIsVideoReady(true);
      });
      video.addEventListener('error', () => {
        console.error('Erro ao carregar o vídeo');
        setIsVideoReady(false);
      });
    }
  }, []);

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          pointerEvents: 'none',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          filter: 'brightness(0.8) contrast(1.2)',
          transition: 'filter 0.3s ease'
        }}
        data-video-type="background"
        onloadedmetadata={(e) => {
          const video = e.target;
          video.play().catch(error => {
            console.error('Erro ao iniciar o vídeo:', error);
          });
        }}
      >
        <source src="/videos/fundo-original.mp4" type="video/mp4" />
        Seu navegador não suporta vídeo HTML5.
      </video>
      
      {/* Imagem de fallback até que o vídeo carregue */}
      {!isVideoReady && (
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: 'url(/download.jpg)',
          zIndex: -2
        }} />
      )}
    </>
  );
};

export default VideoBackground;
