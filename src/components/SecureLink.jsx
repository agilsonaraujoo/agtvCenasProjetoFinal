import React from 'react';

const SecureLink = ({ href, children, className, ...props }) => {
  const handleScroll = (event) => {
    // Verifica se o link começa com #
    if (href.startsWith('#')) {
      event.preventDefault();
      
      // Encontra o elemento correspondente
      const target = document.querySelector(href);
      if (target) {
        // Suaviza o scroll
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Remove caracteres perigosos do href
  const safeHref = href.replace(/[<>"'&]/g, '');

  return (
    <a
      href={safeHref}
      onClick={handleScroll}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

export default SecureLink;
